const web3 = new Web3(window.ethereum);
const contractAddress = '0x9E10aEc0BA03eeDC8b5a2A6d33Cfd980C6Be1fc2';
const contractABI =[{ "inputs": [{ "internalType": "uint256", "name": "_price", "type": "uint256" }], "name": "addRoom", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_reservationId", "type": "uint256" }], "name": "cancelReservation", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_reservationId", "type": "uint256" }], "name": "confirmReservation", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
    { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "reservationId", "type": "uint256" }], "name": "ReservationCanceled", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "reservationId", "type": "uint256" }], "name": "ReservationConfirmed", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "customer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "roomId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "checkInDate", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "checkOutDate", "type": "uint256" }], "name": "ReservationMade", "type": "event" },
    { "inputs": [{ "internalType": "uint256", "name": "_roomId", "type": "uint256" }, { "internalType": "uint256", "name": "_checkInDate", "type": "uint256" }, { "internalType": "uint256", "name": "_checkOutDate", "type": "uint256" }, { "internalType": "string", "name": "_name", "type": "string" }, { "internalType": "string", "name": "_phoneNumber", "type": "string" }], "name": "reserveRoom", "outputs": [], "stateMutability": "payable", "type": "function" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "customer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "roomId", "type": "uint256" }, { "indexed": false, "internalType": "uint8", "name": "rating", "type": "uint8" }, { "indexed": false, "internalType": "string", "name": "comment", "type": "string" }], "name": "ReviewSubmitted", "type": "event" },
    { "inputs": [{ "internalType": "uint256", "name": "_roomId", "type": "uint256" }, { "internalType": "uint8", "name": "_rating", "type": "uint8" }, { "internalType": "string", "name": "_comment", "type": "string" }], "name": "submitReview", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_reservationId", "type": "uint256" }], "name": "getReservation", "outputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "getReservationCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_roomId", "type": "uint256" }], "name": "getReviews", "outputs": [{ "components": [{ "internalType": "address", "name": "customer", "type": "address" }, { "internalType": "uint256", "name": "roomId", "type": "uint256" }, { "internalType": "uint8", "name": "rating", "type": "uint8" }, { "internalType": "string", "name": "comment", "type": "string" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "internalType": "struct HotelReservation.Review[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "getRoomCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_roomId", "type": "uint256" }, { "internalType": "uint256", "name": "_checkInDate", "type": "uint256" }, { "internalType": "uint256", "name": "_checkOutDate", "type": "uint256" }], "name": "isRoomAvailable", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "reservationCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "reservations", "outputs": [{ "internalType": "address", "name": "customer", "type": "address" }, { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "phoneNumber", "type": "string" }, { "internalType": "uint256", "name": "roomId", "type": "uint256" }, { "internalType": "uint256", "name": "checkInDate", "type": "uint256" }, { "internalType": "uint256", "name": "checkOutDate", "type": "uint256" }, { "internalType": "bool", "name": "isConfirmed", "type": "bool" }, { "internalType": "bool", "name": "isCancelled", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "reviews", "outputs": [{ "internalType": "address", "name": "customer", "type": "address" }, { "internalType": "uint256", "name": "roomId", "type": "uint256" }, { "internalType": "uint8", "name": "rating", "type": "uint8" }, { "internalType": "string", "name": "comment", "type": "string" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "roomCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    {"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "rooms","outputs": [{"internalType": "uint256","name": "id","type": "uint256"},{"internalType": "uint256","name": "price","type": "uint256"}],"stateMutability": "view","type": "function"}];
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function enableEthereum() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
}

enableEthereum();

window.onload = displayRoomAndReservationCounts;

async function addRoom() {
    const price = document.getElementById('roomPrice').value;
    const minPriceInWei = web3.utils.toWei('1', 'ether');  // 1 ETH in wei
    if (!price || price <= 0 || web3.utils.toWei(price, 'ether') < minPriceInWei) {
        document.getElementById('addRoomMessage').innerHTML = '<div class="alert error">Please enter a valid price greater than or equal to 1 ETH.</div>';
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.addRoom(price).send({ from: accounts[0] });
        document.getElementById('addRoomMessage').innerHTML = '<div class="alert success">Room added successfully!</div>';
    } catch (error) {
        console.error(error);
        document.getElementById('addRoomMessage').innerHTML = '<div class="alert error">Error adding the room.Please enter a valid price greater than or equal to 1 ETH.</div>';
    }
}

async function reserveRoom() {
    const roomId = document.getElementById('roomId').value;
    const name = document.getElementById('name').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const checkInInput = document.getElementById('checkInDate').value;
    const checkOutInput = document.getElementById('checkOutDate').value;

    const checkInParts = checkInInput.split('/');
    const checkOutParts = checkOutInput.split('/');
    const checkInDate = Math.floor(new Date(`${checkInParts[2]}-${checkInParts[1]}-${checkInParts[0]}`).getTime() / 1000);
    const checkOutDate = Math.floor(new Date(`${checkOutParts[2]}-${checkOutParts[1]}-${checkOutParts[0]}`).getTime() / 1000);

    if (!roomId || !checkInDate || !checkOutDate || !name || !phoneNumber) {
        document.getElementById('reservationMessage').innerHTML = '<div class="alert error">Please fill in all fields.</div>';
        return;
    }

    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
        document.getElementById('reservationMessage').innerHTML = '<div class="alert error">Please enter a valid phone number (at least 10 digits).</div>';
        return;
    }

    const now = Math.floor(Date.now() / 1000); // Timestamp actuel en secondes
    if (checkInDate < now) {
        document.getElementById('reservationMessage').innerHTML = '<div class="alert error">Check-in date cannot be in the past.</div>';
        return;
    }
    if (checkOutDate <= checkInDate) {
        document.getElementById('reservationMessage').innerHTML = '<div class="alert error">Check-out date must be after check-in date.</div>';
        return;
    }

    try {
        const room = await contract.methods.rooms(roomId).call();
        const roomPrice = room[1];

        const available = await contract.methods.isRoomAvailable(roomId, checkInDate, checkOutDate).call();
        if (!available) {
            document.getElementById('reservationMessage').innerHTML = '<div class="alert error">This room is not available for the selected dates.</div>';
            return;
        }

        const accounts = await web3.eth.getAccounts();
        if (!accounts || accounts.length === 0 || !web3.utils.isAddress(accounts[0])) {
            document.getElementById('reservationMessage').innerHTML = '<div class="alert error">Invalid Ethereum address.</div>';
            return;
        }

        await contract.methods.reserveRoom(roomId, checkInDate, checkOutDate, name, phoneNumber).send({
            from: accounts[0],
            value: roomPrice
        });

        document.getElementById('reservationMessage').innerHTML = '<div class="alert success">Reservation successful!</div>';
    } catch (error) {
        console.error(error);
        document.getElementById('reservationMessage').innerHTML = `<div class="alert error">Error during reservation: ${error.message}</div>`;
    }
}

async function getRoomDetails() {
    const roomId = document.getElementById('checkRoomId').value;
    if (!roomId) {
        document.getElementById('roomDetailsMessage').innerHTML = '<div class="alert error">Please enter a valid room ID.</div>';
        return;
    }

    try {
        const room = await contract.methods.rooms(roomId).call();
        document.getElementById('roomDetails').innerHTML = ` 
            <p><strong>Price:</strong> ${room[1]} wei</p>
        `;
        document.getElementById('roomDetailsMessage').innerHTML = '<div class="alert success">Details retrieved successfully!</div>';
    } catch (error) {
        console.error(error);
        document.getElementById('roomDetailsMessage').innerHTML = '<div class="alert error">Error retrieving room details.</div>';
    }
}

async function getReservationDetails() {
    const reservationId = document.getElementById('reservationId').value;

    // Vérifier si l'ID est valide
    if (!reservationId) {
        document.getElementById('reservationDetailsMessage').innerHTML = '<div class="alert error">Veuillez entrer un ID de réservation valide.</div>';
        return;
    }

    try {
        // Récupérer les détails de la réservation
        const reservation = await contract.methods.getReservation(reservationId).call();

        // Extraire les valeurs de la réservation
        const customer = reservation[0]; // Adresse du client
        const name = reservation[1];     // Nom
        const phoneNumber = reservation[2]; // Numéro de téléphone
        const roomId = reservation[3];   // ID de la chambre
        const checkInTimestamp = parseInt(reservation[4]);  // Timestamp check-in
        const checkOutTimestamp = parseInt(reservation[5]); // Timestamp check-out
        const isConfirmed = reservation[6]; // Statut de confirmation

        // // Vérifier la validité des dates
        // if (!checkInTimestamp || !checkOutTimestamp || checkOutTimestamp <= checkInTimestamp) {
        //     document.getElementById('reservationDetailsMessage').innerHTML = '<div class="alert error">Les dates sont invalides.</div>';
        //     return;
        // }

        // Conversion correcte des timestamps en dates lisibles
        const checkInDate = new Date(checkInTimestamp * 1000).toLocaleString('fr-FR');  // Multiplier par 1000
        const checkOutDate = new Date(checkOutTimestamp * 1000).toLocaleString('fr-FR'); // Multiplier par 1000

        // Vérifier si les dates sont valides
        if (isNaN(new Date(checkInTimestamp * 1000)) || isNaN(new Date(checkOutTimestamp * 1000))) {
            document.getElementById('reservationDetailsMessage').innerHTML = '<div class="alert error">Erreur de conversion des dates.</div>';
            return;
        }

        // Déterminer l'état de confirmation
        let confirmationStatus = '_'; // Par défaut non confirmé
        if (isConfirmed) {
            confirmationStatus = 'Confirmée';
        } else if (reservation[0] === '0x0000000000000000000000000000000000000000') { // Vérifier si la réservation est annulée
            confirmationStatus = 'Annulée';
        }

        // Afficher les détails de la réservation
        document.getElementById('reservationDetails').innerHTML = `
            <p><strong>Client:</strong> ${customer}</p>
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Numéro de téléphone:</strong> ${phoneNumber}</p>
            <p><strong>ID de la chambre:</strong> ${roomId}</p>
            <p><strong>Date d'arrivée:</strong> ${checkInDate}</p>
            <p><strong>Date de départ:</strong> ${checkOutDate}</p>
            <p><strong>Confirmation:</strong> ${confirmationStatus}</p>
        `;

        document.getElementById('reservationDetailsMessage').innerHTML = '<div class="alert success">Détails de la réservation récupérés avec succès !</div>';
    } catch (error) {
        console.error(error);
        document.getElementById('reservationDetailsMessage').innerHTML = '<div class="alert error">Erreur lors de la récupération des détails de la réservation.</div>';
    }
}

async function confirmReservation() {
    const reservationId = document.getElementById('confirmationReservationId').value;
    if (!reservationId) {
        document.getElementById('confirmationMessage').innerHTML = '<div class="alert error">Please enter a valid reservation ID.</div>';
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.confirmReservation(reservationId).send({ from: accounts[0] });
        document.getElementById('confirmationMessage').innerHTML = '<div class="alert success">Reservation confirmed!</div>';
    } catch (error) {
        console.error(error);
        document.getElementById('confirmationMessage').innerHTML = '<div class="alert error">Error confirming reservation.</div>';
    }
}

async function cancelReservation() {
    const reservationId = document.getElementById('confirmationReservationId').value;
    if (!reservationId) {
        document.getElementById('confirmationMessage').innerHTML = '<div class="alert error">Please enter a valid reservation ID.</div>';
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.cancelReservation(reservationId).send({ from: accounts[0] });
        document.getElementById('confirmationMessage').innerHTML = '<div class="alert success">Reservation canceled!</div>';
    } catch (error) {
        console.error(error);
        document.getElementById('confirmationMessage').innerHTML = '<div class="alert error">Error canceling reservation.</div>';
    }
}

async function displayRoomAndReservationCounts() {
    try {
        const roomCount = await contract.methods.getRoomCount().call();
        const reservationCount = await contract.methods.getReservationCount().call();
        document.getElementById('roomCount').innerText = roomCount;
        document.getElementById('reservationCount').innerText = reservationCount;
     } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
 }
}

// Soumettre un avis
async function submitReview() {
    const roomReviewId = document.getElementById('roomReviewId').value; // Mise à jour avec roomReviewId
    const rating = document.getElementById('rating').value;
    const comment = document.getElementById('comment').value;

    // Validation de la note
    const ratingValue = parseInt(rating);
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
        alert('La note doit être un nombre entre 1 et 5.');
        return;
    }

    // Validation des champs
    if (!roomReviewId || !comment) {
        alert('Les champs roomReviewId et comment ne peuvent pas être vides.');
        return;
    }

    const accounts = await web3.eth.getAccounts();
    const customerAddress = accounts[0];

    try {
        await contract.methods.submitReview(roomReviewId, web3.utils.toBN(rating), comment)
            .send({ from: customerAddress });
        alert('Avis soumis avec succès');
    } catch (error) {
        console.error('Erreur lors de la soumission de l\'avis:', error);
        alert('Erreur lors de la soumission des avis.');
    }
}

async function getReviews() {
    // Récupérer et nettoyer l'ID de la chambre
    const roomReviewIdInput = document.getElementById('roomReviewIdInput').value.trim(); // Utilisation de roomReviewIdInput

    // Vérifier si l'ID est valide (entier positif)
    if (!roomReviewIdInput || isNaN(roomReviewIdInput) || parseInt(roomReviewIdInput) <= 0) {
        alert('Veuillez entrer un ID de chambre valide.');
        return;
    }

    const roomReviewId = parseInt(roomReviewIdInput); // Conversion explicite en entier

    try {
        // Récupérer les avis à partir du contrat
        const reviews = await contract.methods.getReviews(roomReviewId).call();
        const reviewsList = document.getElementById('reviewsList');
        reviewsList.innerHTML = ''; // Réinitialiser la liste des avis

        // Vérifier s'il y a des avis
        if (reviews.length === 0) {
            reviewsList.innerHTML = '<li>Aucun avis disponible pour cette chambre.</li>';
            return;
        }

        // Parcourir et afficher les avis
        reviews.forEach(review => {
            const listItem = document.createElement('li');
            listItem.textContent = `Note: ${review.rating}/5 - Commentaire: ${review.comment}`;
            reviewsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des avis:', error);
        alert('Erreur lors de la récupération des avis.');
    }
}
