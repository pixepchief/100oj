document.addEventListener("DOMContentLoaded", function () {
    const charIcons = document.querySelectorAll(".character-icon");
    const currentChar = document.getElementById("currentChar");

    const changeCharBtn = document.getElementById("changeCharBtn");
    const btnSfx = "./audio/se_DECISION.WAV";

    const windowBtns = document.querySelectorAll(".windowBtn");

    windowBtns.forEach((button) => {
        const dataWindow = button.getAttribute("data-window");
        const targetWindow = document.getElementById(dataWindow);

        button.addEventListener("click", () => {
            playAudio(btnSfx);
            targetWindow.classList.toggle("hidden");
            targetWindow.classList.toggle("flex");
        })
    })

    function playAudio(url) {
        new Audio(url).play();
    }

    changeCharBtn.addEventListener("click", () => {
        playAudio(btnSfx);
    });

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
                    playAudio(btnSfx);
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
