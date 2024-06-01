document.addEventListener("DOMContentLoaded", function () {
    const charIcons = document.querySelectorAll(".character-icon");
    const currentChar = document.getElementById("currentChar");

    const changeCharBtn = document.getElementById("changeCharBtn");
    const btnSfx = "./audio/se_DECISION.WAV";

    const windowBtns = document.querySelectorAll(".windowBtn");

    let selChar = 'Marc';
    let selCharID = 'marc';
    let currentPose = '00';

    windowBtns.forEach((button) => {
        const dataWindow = button.getAttribute("data-window");
        const targetWindow = document.getElementById(dataWindow);
    
        button.addEventListener("click", () => {
            playAudio(btnSfx);
    
            const isTargetWindowOpen = targetWindow.classList.contains("flex");

            windowBtns.forEach((button2) => {
                const dataWindowHide = button2.getAttribute("data-window");
                const targetWindowHide = document.getElementById(dataWindowHide);
                
                targetWindowHide.classList.add("hidden");
                targetWindowHide.classList.remove("flex");
            });

            if (!isTargetWindowOpen) {
                targetWindow.classList.remove("hidden");
                targetWindow.classList.add("flex");
            }
        });
    });

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

    function setImageSrc(charName, charId, pose) {
        const mainPath = `./characters/${charName}/${charId}_00_${pose}.png`;
        const fallbackPath = `./characters/${charName}/${charId}_00_00_${pose}.png`;
        
        imageExists(mainPath, function (exists) {
            currentChar.src = exists ? mainPath : fallbackPath;
        });
    }

    fetch("charids.json")
        .then((response) => response.json())
        .then((charIds) => {
            charIcons.forEach((charIcon) => {
                charIcon.addEventListener("click", function () {
                    const charName = charIcon.getAttribute("data-card2");
                    playAudio(btnSfx);
                    selChar = charName;
                    currentPose = '00';
                    if (charIds[charName]) {
                        selCharID = charIds[charName];
                        setImageSrc(selChar, selCharID, currentPose);
                    } else {
                        console.error(`Character name "${charName}" not found in charids.json`);
                    }
                });
            });
        })
        .catch((error) => console.error("Error loading charids.json:", error));

    const poseBtns = document.querySelectorAll(".poseBtn");
    poseBtns.forEach((button) => {
        const poseID = button.getAttribute("data-pose");
        button.addEventListener("click", () => {
            currentPose = poseID;
            playAudio(btnSfx);
            setImageSrc(selChar, selCharID, poseID);
        });
        button.addEventListener("mouseover", () => {
            setImageSrc(selChar, selCharID, poseID);
        });

        button.addEventListener("mouseout", () => {
            setImageSrc(selChar, selCharID, currentPose);
        });
    });
});