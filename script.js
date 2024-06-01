document.addEventListener("DOMContentLoaded", function () {
    const charIcons = document.querySelectorAll(".character-icon");
    const currentChar = document.getElementById("currentChar");

    function imageExists(imageUrl, callback) {
        const img = new Image();
        img.onload = function () {
            callback(true);
        };
        img.onerror = function () {
            callback(false);
        };
        img.src = imageUrl;
    }

    fetch("charids.json")
        .then((response) => response.json())
        .then((charIds) => {
            charIcons.forEach((charIcon) => {
                charIcon.addEventListener("click", function () {
                    const charName = charIcon.getAttribute("data-card2");
                    if (charIds[charName]) {
                        const charId = charIds[charName];
                        const firstImagePath = `./characters/${charName}/${charId}_00_00.png`;
                        const fallbackImagePath = `./characters/${charName}/${charId}_00_00_00.png`;

                        imageExists(firstImagePath, function (exists) {
                            if (exists) {
                                currentChar.src = firstImagePath;
                            } else {
                                currentChar.src = fallbackImagePath;
                            }
                        });
                    } else {
                        console.error(
                            `Character name "${charName}" not found in charids.json`
                        );
                    }
                });
            });
        })
        .catch((error) => console.error("Error loading charids.json:", error));
});
