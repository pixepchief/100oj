document.addEventListener("DOMContentLoaded", function () {
    const charIcons = document.querySelectorAll(".character-icon");
    const currentChar = document.getElementById("currentChar");

    const changeCharBtn = document.getElementById("changeCharBtn");
    const btnSfx = "./audio/se_DECISION.WAV";

    const windowBtns = document.querySelectorAll(".windowBtn");

    const colorBtns = ['Orange_Icon.png', 'Blue_Icon.png', 'Green_Icon.png', 'Yellow_Icon.png', 
    'Pink_Icon.png', 'Purple_Icon.png', 'Teal_Icon.png', 'Black_Icon.png', 'Rad_Poppo_Icon.png', 'Halloween_Outfit_Icon.png', 
    'Silver_Icon.png', 'Red_and_Blue_Icon.png', 'Dapper_Poppo_Icon.png', 'Cyborg_Poppo_Icon.png',
    'Christmas_Outfit_Icon.png', 'Tuxedo_Poppo_Icon.png', 'Chocolate_Icon.png', 'School_Outfit_Icon.png', 'White_Chocolate_Icon.png',
    'Dark_Chocolate_Icon.png'];

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

    function fetchCharID(defaultChar) {
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

                // Set up the default character
                if (charIds[defaultChar]) {
                    selCharID = charIds[defaultChar];
                    setImageSrc(defaultChar, selCharID, currentPose);
                }
            })
            .catch((error) => console.error("Error loading charids.json:", error));
    }

    function fetchColors(defaultChar) {
        fetch("characters.json")
            .then((response) => response.json())
            .then((characters) => {
                charIcons.forEach((charIcon) => {
                    charIcon.addEventListener("click", function () {
                        const clothes1Div = document.getElementById("clothes1");
                        const charName = charIcon.getAttribute("data-card2");

                        if (characters[charName]) {
                            const charFiles = characters[charName]["Files"];
                            const colorBtnsDiv = document.getElementById("clothes1");
                            colorBtnsDiv.innerHTML = "";

                            colorBtns.forEach((btn, index) => {
                                const twoDigit = String(index + 1).padStart(2, '0');
                                if (charFiles.includes(`${selCharID}_${twoDigit}_00.png`)) {
                                    const img = document.createElement('img');
                                    img.classList.add("cursor-pointer", "poseBtn");
                                    img.setAttribute("data-pose", index);
                                    img.src = `./images/${btn}`;
                                    img.alt = "";
                                    colorBtnsDiv.appendChild(img);
                                }
                            });
                        }
                    });
                });

                // Set up the default character's color buttons
                if (characters[defaultChar]) {
                    const charFiles = characters[defaultChar]["Files"];
                    const colorBtnsDiv = document.getElementById("clothes1");
                    colorBtnsDiv.innerHTML = "";

                    colorBtns.forEach((btn, index) => {
                        const twoDigit = String(index + 1).padStart(2, '0');
                        if (charFiles.includes(`${selCharID}_${twoDigit}_00.png`)) {
                            const img = document.createElement('img');
                            img.classList.add("cursor-pointer", "poseBtn");
                            img.setAttribute("data-pose", index);
                            img.src = `./images/${btn}`;
                            img.alt = "";
                            colorBtnsDiv.appendChild(img);
                        }
                    });
                }
            })
            .catch((error) => console.error("Error loading characters.json:", error));
    }

    fetchCharID('Marc');
    fetchColors('Marc');

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('poseBtn')) {
            const button = event.target;
            const poseID = button.getAttribute("data-pose");
            currentPose = poseID;
            playAudio(btnSfx);
            setImageSrc(selChar, selCharID, poseID);
        }
    });

    document.addEventListener('mouseover', function (event) {
        if (event.target.classList.contains('poseBtn')) {
            const button = event.target;
            const poseID = button.getAttribute("data-pose");
            setImageSrc(selChar, selCharID, poseID);
        }
    });

    document.addEventListener('mouseout', function (event) {
        if (event.target.classList.contains('poseBtn')) {
            setImageSrc(selChar, selCharID, currentPose);
        }
    });
});