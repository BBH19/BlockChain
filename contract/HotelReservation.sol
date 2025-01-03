// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HotelReservation {
    struct Room {
        uint256 id;
        uint256 price;
    }

    struct Reservation {
        address customer;
        string name;
        string phoneNumber;
        uint256 roomId;
        uint256 checkInDate;
        uint256 checkOutDate;
        bool isConfirmed;
        bool isCancelled;
    }

    struct Review {
        address customer;
        uint256 roomId;
        uint8 rating; // Note de 1 à 5
        string comment;
        uint256 timestamp;
    }

    address public owner;
    uint256 public roomCount;
    uint256 public reservationCount;

    mapping(uint256 => Room) public rooms;
    mapping(uint256 => Reservation) public reservations;
    mapping(uint256 => Review[]) public reviews;
    mapping(uint256 => uint256[]) public roomReservations; // Mapping pour les réservations par chambre

    modifier onlyOwner() {
        require(msg.sender == owner, "Seul le proprietaire peut effectuer cette action");
        _;
    }

    modifier roomExists(uint256 _roomId) {
        require(rooms[_roomId].id != 0, "Cette chambre n'existe pas");
        _;
    }

    modifier onlyCustomerOrOwner(uint256 _reservationId) {
        require(
            reservations[_reservationId].customer == msg.sender || msg.sender == owner,
            "Seul le client ou le proprietaire peuvent effectuer cette action"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addRoom(uint256 _price) public onlyOwner {
        require(_price >= 1 ether, "Le prix doit etre superieur a 1 ETH");
        roomCount++;
        rooms[roomCount] = Room(roomCount, _price);
    }

    function isRoomAvailable(uint256 _roomId, uint256 _checkInDate, uint256 _checkOutDate) public view roomExists(_roomId) returns (bool) {
        for (uint256 i = 0; i < roomReservations[_roomId].length; i++) {
            Reservation memory existingReservation = reservations[roomReservations[_roomId][i]];
            if (
                existingReservation.checkOutDate > _checkInDate &&
                existingReservation.checkInDate < _checkOutDate
            ) {
                return false; // Chambre réservée pendant cette période
            }
        }
        return true;
    }

   function reserveRoom(uint256 _roomId, uint256 _checkInDate, uint256 _checkOutDate, string memory _name, string memory _phoneNumber) public payable roomExists(_roomId) {
    // Vérifications des informations de réservation
    require(bytes(_name).length > 0, "Le nom est obligatoire");
    require(bytes(_phoneNumber).length > 0, "Le numero de telephone est obligatoire");
    require(
        isRoomAvailable(_roomId, _checkInDate, _checkOutDate),
        "Conflit de reservation sur cette periode"
    );
    require(msg.value >= rooms[_roomId].price, "Fonds insuffisants");
    require(
        _checkInDate >= block.timestamp,
        "La date d'arrivee doit etre superieure ou egale a la date d'aujourd'hui"
    );
    require(
        _checkOutDate > _checkInDate,
        "La date de depart doit etre strictement superieure a la date d'arrivee"
    );

    // Création de la réservation et gestion du compteur
    reservationCount++;
    reservations[reservationCount] = Reservation(
        msg.sender,
        _name,
        _phoneNumber,
        _roomId,
        _checkInDate,
        _checkOutDate,
        false,
        false // réservation non confirmée au début
    );
    
    // Ajout de la réservation à la liste des réservations de la chambre
    roomReservations[_roomId].push(reservationCount);

    // Remboursement de l'excédent si le montant payé est supérieur au prix de la chambre
    refundExcess(rooms[_roomId].price);

    // Événement de réservation
    emit ReservationMade(msg.sender, _roomId, _checkInDate, _checkOutDate);
}


// Ajouter un event pour débogage
event LogRoomId(uint256 _roomId);





// Fonction de remboursement en cas d'excédent
function refundExcess(uint256 requiredAmount) private {
    if (msg.value > requiredAmount) {
        payable(msg.sender).transfer(msg.value - requiredAmount);
    }
}

    
    function getReservation(uint256 _reservationId)
    public
    view
    returns (
        address,
        string memory,
        string memory,
        uint256,
        uint256,
        uint256,
        bool
    )
{
    Reservation memory reservation = reservations[_reservationId];

    // Supprimer la vérification des dates
    // require(reservation.checkInDate > 0 && reservation.checkOutDate > reservation.checkInDate, "Invalid dates");

    return (
        reservation.customer,
        reservation.name,
        reservation.phoneNumber,
        reservation.roomId,
        reservation.checkInDate,
        reservation.checkOutDate,
        reservation.isConfirmed
    );
}


   // Nouvelle fonction pour obtenir le nombre de chambres
    function getRoomCount() public view returns (uint256) {
        return roomCount;
    }

    // Nouvelle fonction pour obtenir le nombre de réservations
    function getReservationCount() public view returns (uint256) {
        return reservationCount;
    }

    function confirmReservation(uint256 _reservationId) public onlyOwner onlyCustomerOrOwner(_reservationId) {
        Reservation storage reservation = reservations[_reservationId];
        require(!reservation.isConfirmed, "Reservation deja confirme");
        reservation.isConfirmed = true;
        emit ReservationConfirmed(_reservationId);
    }
   function cancelReservation(uint256 _reservationId) public onlyCustomerOrOwner(_reservationId) {
    Reservation storage reservation = reservations[_reservationId];

    // Vérification de l'existence de la réservation
    require(reservation.customer != address(0), "Reservation does not exist");

    // Si la réservation n'est pas confirmée
    if (!reservation.isConfirmed) {
        // Supprimer la réservation avant confirmation
        delete reservations[_reservationId];
        emit ReservationCanceled(_reservationId);
        
        // Mettre à jour reservationCount
        reservationCount--; // Assurer que le count est mis à jour ici
    } else {
        // Si la réservation est confirmée, la marquer comme annulée
        require(!reservation.isCancelled, "Reservation already cancelled");
        require(reservation.customer == msg.sender, "You are not the customer of this reservation");

        // Marquer la réservation comme annulée
        reservation.isCancelled = true;

        // Réduire le nombre total de réservations
        reservationCount--;  // Assurer que le count est mis à jour ici

        // Supprimer l'ID de réservation dans la liste des réservations de la chambre
        removeReservationFromRoom(_reservationId, reservation.roomId);

        emit ReservationCanceled(_reservationId);
    }
}


    // Fonction pour supprimer l'ID de réservation de la liste des réservations de la chambre
    function removeReservationFromRoom(uint256 _reservationId, uint256 _roomId) private {
        uint256[] storage roomRes = roomReservations[_roomId];
        for (uint i = 0; i < roomRes.length; i++) {
            if (roomRes[i] == _reservationId) {
                roomRes[i] = roomRes[roomRes.length - 1]; // Remplacer l'élément par le dernier
                roomRes.pop(); // Retirer le dernier élément
                break;
            }
        }
    }
    

    function submitReview(
        uint256 _roomId,
        uint8 _rating,
        string memory _comment
    ) public roomExists(_roomId) {
        require(_rating >= 1 && _rating <= 5, "La note doit etre entre 1 et 5");
        require(bytes(_comment).length > 0, "Le commentaire ne peut pas etre vide");

        bool hasReserved = false;
        for (uint256 i = 1; i <= reservationCount; i++) {
            if (
                reservations[i].customer == msg.sender &&
                reservations[i].roomId == _roomId
            ) {
                hasReserved = true;
                break;
            }
        }
        require(hasReserved, "Vous devez avoir reserve cette chambre pour laisser un avis");

        reviews[_roomId].push(Review({
            customer: msg.sender,
            roomId: _roomId,
            rating: _rating,
            comment: _comment,
            timestamp: block.timestamp
        }));

        emit ReviewSubmitted(msg.sender, _roomId, _rating, _comment);
    }

    function getReviews(uint256 _roomId) public view returns (Review[] memory) {
        return reviews[_roomId];
    }

    event ReservationMade(address indexed customer, uint256 roomId, uint256 checkInDate, uint256 checkOutDate);
    event ReviewSubmitted(address indexed customer, uint256 roomId, uint8 rating, string comment);
    event ReservationConfirmed(uint256 reservationId);
    event ReservationCanceled(uint256 reservationId);
}
