fetch('cards.json')
    .then(response => response.json())
    .then(data => {
        const uniqueCards = Array.from(new Set(data.map(card => card.name)))
            .map(name => data.find(card => card.name === name));

        const typeOrder = ["Boost", "Battle", "Trap", "Event", "Gift"];

        const sortedCards = uniqueCards.sort((a, b) => {
            if (a.type === b.type) {
                return a.name.localeCompare(b.name);
            }
            return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
        });

        const cardsPerPage = 14;
        let currentPage = 1;
        const totalPages = Math.ceil(sortedCards.length / cardsPerPage);

        function displayCards(page) {
            const start = (page - 1) * cardsPerPage;
            const end = start + cardsPerPage;
            const cardsToDisplay = sortedCards.slice(start, end);

            const cardsContainer = document.getElementById('cards');
            cardsContainer.innerHTML = '';
            cardsToDisplay.forEach(card => {
                const cardDiv = document.createElement('div');
                cardDiv.classList.add('relative');

                const cardImg = document.createElement('img');
                cardImg.src = `https://orangejuice.wiki/${card.picture}`;
                cardImg.alt = card.name;
                cardsContainer.appendChild(cardDiv);

                cardDiv.appendChild(cardImg);

                const cardDetails = document.createElement('a');
                cardDetails.innerHTML = 'Details';
                cardDetails.href = `https://orangejuice.wiki/wiki/${card.name}`;
                cardDetails.className = 'absolute text-center w-full bottom-2 text-blue-500 underline';
                cardDiv.appendChild(cardDetails);
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