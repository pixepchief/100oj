fetch('cards.json')
    .then(response => response.json())
    .then(data => {
        const boostCards = data.filter(card => card.type === "Boost");

        const uniqueBoostCards = Array.from(new Set(boostCards.map(card => card.name)))
            .map(name => boostCards.find(card => card.name === name));

        const cardsPerPage = 14;
        let currentPage = 1;
        const totalPages = Math.ceil(uniqueBoostCards.length / cardsPerPage);

        function displayCards(page) {
            const start = (page - 1) * cardsPerPage;
            const end = start + cardsPerPage;
            const cardsToDisplay = uniqueBoostCards.slice(start, end);

            const cardsContainer = document.getElementById('cards');
            cardsContainer.innerHTML = '';
            cardsToDisplay.forEach(card => {
                const cardImg = document.createElement('img');
                cardImg.src = `https://orangejuice.wiki/${card.picture}`;
                cardImg.alt = card.name;
                cardsContainer.appendChild(cardImg);
            });

            document.getElementById('page-number').innerText = `${currentPage}/${totalPages}`;
        }

        document.getElementById('prev-page').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayCards(currentPage);
            }
        });

        document.getElementById('next-page').addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayCards(currentPage);
            }
        });

        displayCards(currentPage);
    })
    .catch(error => console.error('Error fetching cards:', error));