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

        let deck = Array(7).fill(null);
        let selectedCardIndex = null;

        const placeholderImage = 'https://orangejuice.wiki/w/images/Images/100OrangeJuice_images/2/2d/Back_0.png'; // Placeholder image URL

        function updateDeckDisplay() {
            const deckContainer = document.getElementById('deck');
            deckContainer.innerHTML = '';
            deck.forEach((card, index) => {
                const cardDiv = document.createElement('div');
                cardDiv.classList.add('relative');
                const cardImg = document.createElement('img');
                cardImg.src = card ? `https://orangejuice.wiki/${card.picture}` : placeholderImage;
                cardImg.alt = card ? card.name : 'Placeholder';
                cardDiv.appendChild(cardImg);

                if (index === selectedCardIndex) {
                    cardDiv.classList.add('brightness-50');
                }

                cardDiv.addEventListener('click', () => {
                    selectedCardIndex = index;
                    updateDeckDisplay();
                });
                deckContainer.appendChild(cardDiv);
            });
        }

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

                cardDiv.addEventListener('click', () => {
                    const cardCount = deck.filter(deckCard => deckCard && deckCard.name === card.name).length;
                    if (cardCount >= card.limit) {
                        alert(`You cannot add more than ${card.limit} of this card.`);
                        return;
                    }

                    if (selectedCardIndex !== null) {
                        deck[selectedCardIndex] = card;
                        selectedCardIndex = null;
                        updateDeckDisplay();
                    } else {
                        const firstEmptyIndex = deck.findIndex(item => item === null);
                        if (firstEmptyIndex !== -1) {
                            deck[firstEmptyIndex] = card;
                            updateDeckDisplay();
                        }
                    }
                });
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
        updateDeckDisplay();
    })
    .catch(error => console.error('Error fetching cards:', error));
