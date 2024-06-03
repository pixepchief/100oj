document.addEventListener("DOMContentLoaded", function () {
    const charIcons = document.querySelectorAll(".character-icon");
    const currentChar = document.getElementById("currentChar");

    const changeCharBtn = document.getElementById("changeCharBtn");
    const btnSfx = "./audio/se_DECISION.WAV";

    const windowBtns = document.querySelectorAll(".windowBtn");

    const colorBtns = ['1_Icon.png', 'Orange_Icon.png', 'Blue_Icon.png', 'Green_Icon.png', 'Yellow_Icon.png', 
    'Pink_Icon.png', 'Purple_Icon.png', 'Teal_Icon.png', 'Black_Icon.png', 'Rad_Poppo_Icon.png', 'Halloween_Outfit_Icon.png', 
    'Silver_Icon.png', 'Red_and_Blue_Icon.png', 'Dapper_Poppo_Icon.png', 'Cyborg_Poppo_Icon.png',
    'Christmas_Outfit_Icon.png', 'Tuxedo_Poppo_Icon.png', 'Chocolate_Icon.png', 'School_Outfit_Icon.png', 'White_Chocolate_Icon.png',
    'Dark_Chocolate_Icon.png'];

    const musicBtn = document.getElementById("musicOption");
    const song = new Audio('./audio/mainMenu.mp3');
    song.volume = 0.5;
    song.loop = true;
    let musicOn = 0;

    const particlesBtn = document.getElementById("particlesBtn");
    let particlesOn = 0;

    const sfxBtn = document.getElementById("sfxBtn");
    let sfxOn = 0;

    sfxBtn.addEventListener("click", () => {
        if (sfxOn == 0) {
            sfxOn = 1;
            sfxBtn.textContent = "SFX Disabled";
        } else {
            sfxOn = 0;
            sfxBtn.textContent = "SFX Enabled";
        }
    });

    particlesBtn.addEventListener("click", () => {
        if (particlesOn == 0) {
            stopParticles();
            particlesOn = 1;

            particlesBtn.textContent = "Particles Disabled";
        } else {
            startParticles();
            particlesOn = 0;

            particlesBtn.textContent = "Particles Enabled";
        }
    });

    musicBtn.addEventListener("click", () => {
        if (musicOn == 0) {
            song.play();
            musicOn = 1;

            musicBtn.textContent = 'Music Enabled';
        } else {
            song.pause();
            musicOn = 0;

            musicBtn.textContent = 'Music Disabled';
        }
    });

    let selChar = 'Marc';
    let selCharID = 'marc';
    let currentPose = '00';
    let currentColorID = '00';

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
        if (sfxOn == 0) {
            new Audio(url).play();
        }
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

    function setImageSrc(charName, charId, pose, colorID) {
        console.log(colorID);
        const mainPath = `./characters/${charName}/${charId}_${colorID}_${pose}.png`;
        const fallbackPath = `./characters/${charName}/${charId}_00_${colorID}_${pose}.png`;
        
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
                        currentColorID = '00';
                        
                        if (charIds[charName]) {
                            selCharID = charIds[charName];
                            setImageSrc(selChar, selCharID, currentPose, currentColorID);
                        } else {
                            console.error(`Character name "${charName}" not found in charids.json`);
                        }
                    });
                });

                if (charIds[defaultChar]) {
                    selCharID = charIds[defaultChar];
                    setImageSrc(defaultChar, selCharID, currentPose, currentColorID);
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
                        const charName = charIcon.getAttribute("data-card2");

                        if (characters[charName]) {
                            const charFiles = characters[charName]["Files"];
                            const colorBtnsDiv = document.getElementById("clothes1");
                            colorBtnsDiv.innerHTML = "";

                            colorBtns.forEach((btn, index) => {
                                const twoDigit = String(index).padStart(2, '0');
                                if (charFiles.includes(`${selCharID}_${twoDigit}_00.png`) || charFiles.includes(`${selCharID}_00_${twoDigit}_00.png`)) {
                                    const img = document.createElement('img');
                                    img.classList.add("cursor-pointer", "colorBtn");
                                    img.setAttribute("data-color", twoDigit);
                                    img.src = `./images/${btn}`;
                                    img.alt = "";
                                    colorBtnsDiv.appendChild(img);
                                }
                            });
                        }
                    });
                });

                if (characters[defaultChar]) {
                    const charFiles = characters[defaultChar]["Files"];
                    const colorBtnsDiv = document.getElementById("clothes1");
                    colorBtnsDiv.innerHTML = "";

                    colorBtns.forEach((btn, index) => {
                        const twoDigit = String(index).padStart(2, '0');
                        if (charFiles.includes(`${selCharID}_${twoDigit}_00.png`) || charFiles.includes(`${selCharID}_00_${twoDigit}_00.png`)) {
                            const img = document.createElement('img');
                            img.classList.add("cursor-pointer", "colorBtn");
                            img.setAttribute("data-color", twoDigit);
                            img.src = `./images/${btn}`;
                            img.alt = "";
                            colorBtnsDiv.appendChild(img);
                        }
                    });
                }
            })
            .catch((error) => console.error("Error loading characters.json:", error));
    }

    function fetchAccessories(defaultChar) {
        fetch("characters.json")
            .then((response) => response.json())
            .then((characters) => {
                fetch("accessories.json")
                    .then((response) => response.json())
                    .then((accessories) => {
                        charIcons.forEach((charIcon) => {
                            charIcon.addEventListener("click", function () {
                                const charName = charIcon.getAttribute("data-card2");
    
                                if (charName) {
                                    const accessoriesBtnDiv = document.getElementById("accessories");
                                    accessoriesBtnDiv.innerHTML = "";
        
                                    console.log(characters[charName]);   
            
                                    const charFiles = characters[charName]["Subdirectories"]["Hats"]["Files"];
            
                                    accessories.forEach((accessory) => {
                                        const charId = selCharID;
                                        const accessoryFilename = accessory.filename;
                                        const accessoryIndex = String(accessory.index).padStart(2, '0');
                                        const accessoryCharacters = accessory.characters;
            
                                        if (charFiles.includes(`${charId}_${accessoryIndex}_00.png`) || charFiles.includes(`${charId}_00_${accessoryIndex}_00.png`)) {
                                            console.log(charId + "_" + accessoryIndex + "_00")
                                            if (accessoryCharacters === "*" || accessoryCharacters.includes(charName)) {
                                                const img = document.createElement('img');
                                                img.classList.add("cursor-pointer", "accessoryBtn");
                                                img.setAttribute("data-hat", accessoryIndex);
                                                img.src = `./images/${accessoryFilename}`;
                                                img.alt = "";
                                                accessoriesBtnDiv.appendChild(img);
                                            }
                                        }
                                    });
                                }
                            });
                        });
    
                        if (characters[defaultChar]) {
                            const accessoriesBtnDiv = document.getElementById("accessories");
                            accessoriesBtnDiv.innerHTML = "";

                            console.log(characters[defaultChar]);   
    
                            const charFiles = characters[defaultChar]["Subdirectories"]["Hats"]["Files"];
    
                            accessories.forEach((accessory) => {
                                const charId = selCharID;
                                const accessoryFilename = accessory.filename;
                                const accessoryIndex = String(accessory.index).padStart(2, '0');
                                const accessoryCharacters = accessory.characters;
    
                                if (charFiles.includes(`${charId}_${accessoryIndex}_00.png`) || charFiles.includes(`${charId}_00_${accessoryIndex}_00.png`)) {
                                    console.log(charId + "_" + accessoryIndex + "_00")
                                    if (accessoryCharacters === "*" || accessoryCharacters.includes(defaultChar)) {
                                        const img = document.createElement('img');
                                        img.classList.add("cursor-pointer", "accessoryBtn");
                                        img.setAttribute("data-hat", accessoryIndex);
                                        img.src = `./images/${accessoryFilename}`;
                                        img.alt = "";
                                        accessoriesBtnDiv.appendChild(img);
                                    }
                                }
                            });
                        }
                    })
                    .catch((error) => console.error("Error loading accessories.json:", error));
            })
            .catch((error) => console.error("Error loading characters.json:", error));
    }
    


    function fetchPoses(defaultChar) {
        fetch("characters.json")
            .then((response) => response.json())
            .then((characters) => {
                charIcons.forEach((charIcon) => {
                    charIcon.addEventListener("click", function () {
                        const charName = charIcon.getAttribute("data-card2");

                        if (characters[charName]) {
                            const charFiles = characters[charName]["Files"];
                            const colorBtnsDiv = document.getElementById("poses");
                            colorBtnsDiv.innerHTML = "";

                            colorBtns.forEach((btn, index) => {
                                const twoDigit = String(index).padStart(2, '0');
                                if (charFiles.includes(`${selCharID}_00_${twoDigit}.png`) || charFiles.includes(`${selCharID}_00_00_${twoDigit}.png`)) {
                                    const img = document.createElement('img');
                                    img.classList.add("cursor-pointer", "poseBtn");
                                    img.setAttribute("data-pose", twoDigit);
                                    img.src = `./images/${index + 1}_Icon.png`;
                                    img.alt = "";
                                    colorBtnsDiv.appendChild(img);
                                }
                            });
                        }
                    });
                });

                if (characters[defaultChar]) {
                    const charFiles = characters[defaultChar]["Files"];
                    const colorBtnsDiv = document.getElementById("poses");
                    colorBtnsDiv.innerHTML = "";

                    colorBtns.forEach((btn, index) => {
                        const twoDigit = String(index).padStart(2, '0');
                        if (charFiles.includes(`${selCharID}_00_${twoDigit}.png`) || charFiles.includes(`${selCharID}_00_00_${twoDigit}.png`)) {
                            const img = document.createElement('img');
                            img.classList.add("cursor-pointer", "poseBtn");
                            img.setAttribute("data-pose", twoDigit);
                            img.src = `./images/${index + 1}_Icon.png`;
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
    fetchPoses('Marc');
    fetchAccessories('Marc');

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('poseBtn')) {
            const button = event.target;
            const poseID = button.getAttribute("data-pose");
            currentPose = poseID;
            playAudio(btnSfx);
            setImageSrc(selChar, selCharID, poseID, currentColorID);
        }

        if (event.target.classList.contains('colorBtn')) {
            const button = event.target;
            const colorID = button.getAttribute("data-color");
            currentColorID = colorID;
            playAudio(btnSfx);
            setImageSrc(selChar, selCharID, currentPose, colorID);
        }
    });

    document.addEventListener('mouseover', function (event) {
        if (event.target.classList.contains('poseBtn')) {
            const button = event.target;
            const poseID = button.getAttribute("data-pose");
            setImageSrc(selChar, selCharID, poseID, currentColorID);
        }

        if (event.target.classList.contains('colorBtn')) {
            const button = event.target;
            const colorID = button.getAttribute("data-color");
            setImageSrc(selChar, selCharID, currentPose, colorID);
        }
    });

    document.addEventListener('mouseout', function (event) {
        if (event.target.classList.contains('poseBtn') || event.target.classList.contains('colorBtn')) {
            setImageSrc(selChar, selCharID, currentPose, currentColorID);
        }
    });

    startParticles();
});