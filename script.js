async function fetchElementsFromJSON() {
    const response = await fetch('Data.json');
    const data = await response.json();
    return data.elements;
}

async function fetchRoomNumbersFromJSON() {
    const response = await fetch('rooms.json');
    const data = await response.json();
    return data.rooms.sort((a, b) => a.roomNumber - b.roomNumber); // Sort room numbers
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function displayElements() {
    const mainDiv = document.getElementById('app');
    mainDiv.className = 'main-content';

    const elementsArray = await fetchElementsFromJSON();
    const roomNumbersArray = await fetchRoomNumbersFromJSON();
    const letters = ['A', 'B', 'C'];
    const numColumns = 6;

    function createDivWithElements(roomNumber, shuffledArray) {
        const groupedDiv = document.createElement('div');
        groupedDiv.className = 'grouped-div';

        const roomNumberElement = document.createElement('p');
        roomNumberElement.textContent = `Room ${roomNumber}`;
        roomNumberElement.className = 'room-number';
        groupedDiv.appendChild(roomNumberElement);

        const myTable = document.createElement('table');

        for (let i = 0; i < shuffledArray.length; i++) {
            const row = document.createElement('tr');
            const index = i + 1;
            const cellLetter = document.createElement('td');
            cellLetter.textContent = letters[i];
            cellLetter.className = 'letter-cell';
            const cellNumber = document.createElement('td');
            cellNumber.textContent = index.toString();
            cellNumber.className = 'number-cell';
            const cellElement = document.createElement('td');
            cellElement.textContent = shuffledArray[i];
            row.appendChild(cellLetter);
            row.appendChild(cellNumber);
            row.appendChild(cellElement);
            myTable.appendChild(row);
        }

        groupedDiv.appendChild(myTable);
        mainDiv.appendChild(groupedDiv);
    }

    function shuffleAndDisplayElements() {
        mainDiv.innerHTML = '';
        const shuffledArray = [...elementsArray];
        shuffleArray(shuffledArray);

        const displayInterval = 500;

        for (let i = 0; i < roomNumbersArray.length; i++) {
            const roomNumber = roomNumbersArray[i].roomNumber;
            const groupElements = shuffledArray.slice(i * 3, (i + 1) * 3);
            setTimeout(() => createDivWithElements(roomNumber, groupElements), i * displayInterval);
        }
    }

    shuffleAndDisplayElements();

    const shuffleButton = document.getElementById('shuffleButton');
    shuffleButton.addEventListener('click', shuffleAndDisplayElements);

    const downloadButton = document.getElementById('downloadButton');
    downloadButton.addEventListener('click', downloadImage);

    // Hide the loading bar after elements are displayed
    const loadingBar = document.getElementById('loading-bar');
    loadingBar.style.display = 'none';
}

async function downloadImage() {
    const mainDiv = document.getElementById('app');

    const canvas = await html2canvas(mainDiv);

    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/jpeg', 1.0);
    a.download = 'groups.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

displayElements();
