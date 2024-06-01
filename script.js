document.addEventListener("DOMContentLoaded", function () {
  const charIcons = document.querySelectorAll(".character-icon");
  const currentChar = document.getElementById("currentChar");

  fetch('charids.json')
    .then(response => response.json())
      .then(charIds => {
          charIcons.forEach(charIcon => {
              charIcon.addEventListener('click', function () {
                  const charName = charIcon.getAttribute('data-card2');
                  if (charIds[charName]) {
                      const charId = charIds[charName];
                      currentChar.src = `./characters/${charName}/${charId}_00_00.png`;
                  } else {
                      console.error(`Character name "${charName}" not found in charids.json`);
                  }
              });
          });
      })
      .catch(error => console.error('Error loading charids.json:', error));
});
