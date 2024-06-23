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

        let deck = Array(10).fill(null);
        let selectedCardIndex = null;

        const placeholderImage = 'https://orangejuice.wiki/w/images/Images/100OrangeJuice_images/2/2d/Back_0.png';

        function encodeDeck(deck) {
            return deck.map(card => card ? card.name.replace(/ /g, '_') : '').join(',');
        }

        function decodeDeck(encodedDeck) {
            const cardNames = encodedDeck.split(',');
            const decodedDeck = cardNames.map(name => sortedCards.find(card => card.name === name) || null);
            return decodedDeck;
        }

        document.getElementById('generateLinkBtn').addEventListener('click', () => {
            generateLink.showModal();
            const encodedDeck = encodeDeck(deck);
            const link = `${window.location.origin}${window.location.pathname}?deck=${encodedDeck}`;
            const deckLinkInput = document.getElementById('generatedLink');
            deckLinkInput.value = link;
        });

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('deck')) {
            const encodedDeck = urlParams.get('deck');
            deck = decodeDeck(encodedDeck);
            updateDeckDisplay();
            updateMetaDescription(deck);
        }

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

        function updateMetaDescription(deck) {
            const ogDescriptionMeta = document.getElementById('ogDescriptionMeta');
            const ogImageMeta = document.getElementById('ogImageMeta');
            if (ogDescriptionMeta && ogImageMeta) {
                const firstCard = deck.find(card => card !== null);
                if (firstCard) {
                    const deckDescription = deck.filter(card => card !== null).map(card => card.name).join(', ');
                    ogDescriptionMeta.setAttribute('content', `A shared deck that contains the cards: ${deckDescription}`);
                    ogImageMeta.setAttribute('content', `https://orangejuice.wiki/${firstCard.picture}`);
                } else {
                    ogDescriptionMeta.setAttribute('content', `An online deck builder for the game 100% Orange Juice, fully in your web browser!`);
                    ogImageMeta.setAttribute('content', `https://orangejuice.wiki/w/images/Images/100OrangeJuice_images/2/2d/Back_0.png`);
                }
            }
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