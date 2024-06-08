document.addEventListener("DOMContentLoaded", function () {
    const charIcons = document.querySelectorAll(".character-icon");
    const currentChar = document.getElementById("currentChar");
    const alphamask = document.getElementById("alphamask");
    const accessory = document.getElementById("accessory");
    const changeCharBtn = document.getElementById("changeCharBtn");
    const windowBtns = document.querySelectorAll(".windowBtn");
    const musicBtn = document.getElementById("musicOption");
    const particlesBtn = document.getElementById("particlesBtn");
    const sfxBtn = document.getElementById("sfxBtn");
    const colorBtnsDiv = document.getElementById("clothes1");
    const accessoriesBtnDiv = document.getElementById("accessories");
    const glassesDiv = document.getElementById("glasses");
    const glass = document.getElementById("glassOverlay");
    const posesBtnDiv = document.getElementById("poses");

    const btnSfx = "./audio/se_DECISION.WAV";
    const song = new Audio('./audio/mainMenu.mp3');
    song.volume = 0.5;
    song.loop = true;

    let musicOn = false;
    let particlesOn = false;
    let sfxOn = false;

    let selChar = 'Marc';
    let selCharID = 'marc';
    let currentPose = '0';
    let currentColorID = '00';
    let currentAccessory = '69';
    let currentGlass = '00';

    const colorBtns = [
        '1_Icon.png', 'Orange_Icon.png', 'Blue_Icon.png', 'Green_Icon.png', 'Yellow_Icon.png',
        'Pink_Icon.png', 'Purple_Icon.png', 'Teal_Icon.png', 'Black_Icon.png', 'Rad_Poppo_Icon.png', 'Halloween_Outfit_Icon.png',
        'Silver_Icon.png', 'Red_and_Blue_Icon.png', 'Dapper_Poppo_Icon.png', 'Cyborg_Poppo_Icon.png',
        'Christmas_Outfit_Icon.png', 'Tuxedo_Poppo_Icon.png', 'Chocolate_Icon.png', 'School_Outfit_Icon.png', 'White_Chocolate_Icon.png',
        'Dark_Chocolate_Icon.png'
    ];

    async function fetchData() {
        const [charIds, characters, accessories] = await Promise.all([
            fetch("charids.json").then(res => res.json()),
            fetch("characters.json").then(res => res.json()),
            fetch("accessories.json").then(res => res.json())
        ]);
        return { charIds, characters, accessories };
    }

    fetchData().then(({ charIds, characters, accessories }) => {
        init(charIds, characters, accessories);
    });

    function init(charIds, characters, accessories) {
        setupButtons();
        setupCharacterSelection(charIds, characters, accessories);
        setupColorButtons(characters, accessories);
        updateAccessoryButtons(characters, accessories);
        updatePoseButtons(characters, accessories);
        updateGlassesButtons(characters, accessories);
        setInitialCharacter(charIds, characters, accessories);
    }

    function setupButtons() {
        musicBtn.addEventListener("click", toggleMusic);
        particlesBtn.addEventListener("click", toggleParticles);
        sfxBtn.addEventListener("click", toggleSfx);
        changeCharBtn.addEventListener("click", () => playAudio(btnSfx));
        windowBtns.forEach(button => button.addEventListener("click", toggleWindow));
    }

    function setupCharacterSelection(charIds, characters, accessories) {
        charIcons.forEach(charIcon => {
            charIcon.addEventListener("click", function () {
                const charName = charIcon.getAttribute("data-card2");
                selChar = charName;
                selCharID = charIds[charName];
                currentPose = '0';
                currentColorID = '00';
                currentAccessory = '69';
                currentGlass = '00';

                playAudio(btnSfx);
                setImageSrc(selChar, selCharID, currentPose, currentColorID);
                setAccessory(selChar, selCharID, currentPose, currentAccessory, accessories);
                setGlass(selChar, selCharID, currentPose, currentGlass, accessories);
                setupColorButtons(characters, accessories);
                updateAccessoryButtons(characters, accessories);
                updatePoseButtons(characters, accessories);
                updateGlassesButtons(characters, accessories);
            });
        });
    }

    function setupColorButtons(characters, accessories) {
        const charFiles = characters[selChar]["Files"];
        colorBtnsDiv.innerHTML = "";
        colorBtns.forEach((btn, index) => {
            const twoDigit = String(index).padStart(2, '0');
            if (charFiles.includes(`${selCharID}_${twoDigit}_00.png`) || charFiles.includes(`${selCharID}_00_${twoDigit}_00.png`)) {
                const img = document.createElement('img');
                img.classList.add("cursor-pointer", "colorBtn");
                img.setAttribute("data-color", twoDigit);
                img.src = `./images/${btn}`;

                img.addEventListener('mouseenter', () => {
                    const colorID = img.getAttribute("data-color");
                    setImageSrc(selChar, selCharID, currentPose, colorID);
                    setAccessory(selChar, selCharID, currentPose, currentAccessory, accessories);
                });
    
                img.addEventListener('mouseleave', () => {
                    setImageSrc(selChar, selCharID, currentPose, currentColorID);
                    setAccessory(selChar, selCharID, currentPose, currentAccessory, accessories);
                });
    
                img.addEventListener('click', () => {
                    const colorID = img.getAttribute("data-color");
                    currentColorID = colorID;
                    playAudio(btnSfx);
                    setImageSrc(selChar, selCharID, currentPose, colorID);
                    setAccessory(selChar, selCharID, currentPose, currentAccessory);
                });
    
                colorBtnsDiv.appendChild(img);
            }
        });
    }

    function setInitialCharacter(charIds, characters, accessories) {
        selCharID = charIds[selChar];
        setImageSrc(selChar, selCharID, currentPose, currentColorID);
        setAccessory(selChar, selCharID, currentPose, currentAccessory, accessories);
        setGlass(selChar, selCharID, currentPose, currentGlass, accessories);
        setupColorButtons(characters, accessories);
        updateAccessoryButtons(characters, accessories);
        updatePoseButtons(characters, accessories);
        updateGlassesButtons(characters, accessories);
    }

    function toggleMusic() {
        musicOn = !musicOn;
        musicOn ? song.play() : song.pause();
        musicBtn.textContent = musicOn ? 'Music Enabled' : 'Music Disabled';
    }

    function toggleParticles() {
        particlesOn = !particlesOn;
        particlesOn ? stopParticles() : startParticles();
        particlesBtn.textContent = particlesOn ? 'Particles Disabled' : 'Particles Enabled';
    }

    function toggleSfx() {
        sfxOn = !sfxOn;
        sfxBtn.textContent = sfxOn ? 'SFX Disabled' : 'SFX Enabled';
    }

    function toggleWindow(event) {
        playAudio(btnSfx);
        const targetWindow = document.getElementById(event.target.getAttribute("data-window"));
        const isTargetWindowOpen = targetWindow.classList.contains("flex");

        windowBtns.forEach(button => {
            const window = document.getElementById(button.getAttribute("data-window"));
            window.classList.add("hidden");
            window.classList.remove("flex");
        });

        if (!isTargetWindowOpen) {
            targetWindow.classList.remove("hidden");
            targetWindow.classList.add("flex");
        }
    }

    function playAudio(url) {
        if (!sfxOn) new Audio(url).play();
        console.trace();
    }

    function setImageSrc(charName, charId, pose, colorID) {
        const mainPath = `./characters/${charName}/${charId}_${colorID}_0${pose}.png`;
        const fallbackPath = `./characters/${charName}/${charId}_00_${colorID}_0${pose}.png`;
    
        imageExists(mainPath, exists => {
            currentChar.src = exists ? mainPath : fallbackPath;
        });
    }    

    function setAccessory(charName, charId, pose, accessoryID, accessories) {
        pose = String(pose).padStart(2, '0');
        if (accessoryID !== '69') {
            const accessoryNew = accessories.find(acc => acc.index == accessoryID && acc.characters.includes(charName) || acc.index == accessoryID && acc.characters == '*');
            const alphamaskPath = `./characters/${charName}/Alpha Masks/${charId}_${String(accessoryNew.alphamask).padStart(2, '0')}_${pose}.png`;
            console.log(accessoryNew);

            imageExists(alphamaskPath, exists => {
                alphamask.src = exists ? alphamaskPath : '';
            });

            const accessoryPath = `./characters/${charName}/Hats/${charId}_${accessoryID}_${pose}.png`;
            const accessoryFall = `./characters/${charName}/Hats/${charId}_00_${accessoryID}_${pose}.png`;

            imageExists(accessoryPath, exists => {
                accessory.src = exists ? accessoryPath : accessoryFall;
            });
        } else {
            alphamask.src = '';
            accessory.src = '';
        }
    }

    function setGlass(selChar, selCharID, pose, accessoryID, accessories) {
        pose = String(pose).padStart(2, '0');
        if (accessoryID !== '00') {
            const glassPath = `./characters/${selChar}/Hats/${selCharID}_${accessoryID}_${pose}.png`;
            const glassFall = `./characters/${selChar}/Hats/${selCharID}_00_${accessoryID}_${pose}.png`;

            imageExists(glassPath, exists => {
                glass.src = exists ? glassPath : glassFall;
            });
        } else {
            console.log('removed glasses');
            glass.src = '';
        }
    }

    function imageExists(imageUrl, callback) {
        const img = new Image();
        img.onload = () => callback(true);
        img.onerror = () => callback(false);
        img.src = imageUrl;
    }

    function updateAccessoryButtons(characters, accessories) {
        accessoriesBtnDiv.innerHTML = "";
    
        const characterHatFiles = characters[selChar]["Subdirectories"]["Hats"]["Files"];
    
        const characterAccessories = accessories.filter(acc => {
            return (acc.characters.includes(selChar) || acc.characters.includes("*")) && acc.index !== 7 && acc.index !== 8;
        });

        const noAcc = document.createElement('img');
        noAcc.classList.add("cursor-pointer", "accessoryBtn");
        noAcc.setAttribute("data-hat", '69');
        noAcc.src = './images/1_Icon.png';

        noAcc.addEventListener('mouseenter', () => {
            setAccessory(selChar, selCharID, currentPose, '69', accessories);
        });

        noAcc.addEventListener('mouseleave', () => {
            setAccessory(selChar, selCharID, currentPose, '69', accessories);
        });

        noAcc.addEventListener('click', () => {
            playAudio(btnSfx);
            currentAccessory = '69';
            setAccessory(selChar, selCharID, currentPose, currentAccessory, accessories);
        });

        accessoriesBtnDiv.appendChild(noAcc);
    
        characterAccessories.forEach(acc => {
            const twoDigit = String(acc.index).padStart(2, '0');
            const currentDigit = String(currentPose).padStart(2, '0');
    
            if (characterHatFiles.includes(`${selCharID}_${twoDigit}_${currentDigit}.png`)) {
                const img = document.createElement('img');
                img.classList.add("cursor-pointer", "accessoryBtn");
                img.setAttribute("data-hat", twoDigit);
                img.src = `./images/${acc.filename}`;
    
                img.addEventListener('mouseenter', () => {
                    setAccessory(selChar, selCharID, currentPose, twoDigit, accessories);
                });
    
                img.addEventListener('mouseleave', () => {
                    setAccessory(selChar, selCharID, currentPose, currentAccessory, accessories);
                });
    
                img.addEventListener('click', () => {
                    playAudio(btnSfx);
                    currentAccessory = twoDigit;
                    setAccessory(selChar, selCharID, currentPose, currentAccessory, accessories);
                });
    
                accessoriesBtnDiv.appendChild(img);
            }
        });
    }

    function updatePoseButtons(characters, accessories) {
        const charFiles = characters[selChar]["Files"];
        posesBtnDiv.innerHTML = "";
        charFiles.filter(file => file.includes(`_${currentColorID}_`)).forEach(file => {
            let pose = file.split('_')[2];
            pose = pose.slice(pose, -4);
            pose = pose.substring(1);
            pose = parseInt(pose);
            const img = document.createElement('img');
            img.classList.add("cursor-pointer", "poseBtn");
            img.setAttribute("data-pose", pose);
            img.src = `./images/${pose + 1}_Icon.png`;

            img.addEventListener('mouseenter', () => {
                setImageSrc(selChar, selCharID, pose, currentColorID);
                setAccessory(selChar, selCharID, pose, currentAccessory, accessories);
                setGlass(selChar, selCharID, pose, currentGlass, accessories);
            });
    
            img.addEventListener('mouseleave', () => {
                setImageSrc(selChar, selCharID, currentPose, currentColorID);
                setAccessory(selChar, selCharID, currentPose, currentAccessory, accessories);
                setGlass(selChar, selCharID, currentPose, currentGlass, accessories);
            });
    
            img.addEventListener('click', () => {
                playAudio(btnSfx);
                currentPose = pose;
                setImageSrc(selChar, selCharID, currentPose, currentColorID);
                setAccessory(selChar, selCharID, currentPose, currentAccessory, accessories);
                setGlass(selChar, selCharID, currentPose, currentGlass, accessories);
            });
    
            posesBtnDiv.appendChild(img);
        });
    }    

    function updateGlassesButtons(characters, accessories) {
        glassesDiv.innerHTML = '';
        const glassesHatFiles = characters[selChar]["Subdirectories"]["Hats"]["Files"];

        appendGlass(0);

        if (glassesHatFiles.includes(`${selCharID}_07_00.png`)) {
            appendGlass(7);
        }

        if (glassesHatFiles.includes(`${selCharID}_08_00.png`)) {
            appendGlass(8);
        }
    }

    function appendGlass(accessoryId, accessories) {
        if (accessoryId !== 0) {
            const img = document.createElement('img');
            const twoDigit = String(accessoryId).padStart(2, '0');
            img.classList.add("cursor-pointer", "glassBtn");
            img.setAttribute("data-glass", twoDigit);
            
            if (accessoryId == 8) {
                img.src = `./images/Sunglasses_Icon.png`;
            } else {
                img.src = `./images/Eyeglasses_Icon.png`;
            }
    
            img.addEventListener('mouseenter', () => {
                setGlass(selChar, selCharID, currentPose, twoDigit, accessories);
            });
    
            img.addEventListener('mouseleave', () => {
                setGlass(selChar, selCharID, currentPose, currentGlass, accessories);
            });
    
            img.addEventListener('click', () => {
                playAudio(btnSfx);
                currentGlass = twoDigit;
                setGlass(selChar, selCharID, currentPose, currentGlass, accessories);
            });
    
            glassesDiv.appendChild(img);
        } else {
            const noAcc = document.createElement('img');
            noAcc.classList.add("cursor-pointer", "accessoryBtn");
            noAcc.setAttribute("data-glass", '00');
            noAcc.src = './images/1_Icon.png';
    
            noAcc.addEventListener('mouseenter', () => {
                setGlass(selChar, selCharID, currentPose, '00', accessories);
            });
    
            noAcc.addEventListener('mouseleave', () => {
                console.log("haha back to how you were");
                setGlass(selChar, selCharID, currentPose, currentGlass, accessories);
            });
    
            noAcc.addEventListener('click', () => {
                playAudio(btnSfx);
                currentGlass = '00';
                setGlass(selChar, selCharID, currentPose, currentGlass, accessories);
            });

            glassesDiv.appendChild(noAcc);
        }
    }

    startParticles();
});
