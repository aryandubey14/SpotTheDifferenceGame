const gameDataUrl = 'gameData.json'; // URL to your JSON file

let score = 0;
let timer = 0;
let interval;

// Initialize canvas
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');

const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');

// Load game data
fetch(gameDataUrl)
  .then(response => response.json())
  .then(data => initializeGame(data))
  .catch(err => console.error('Error loading JSON:', err));

function initializeGame(data) {
  document.getElementById('game-title').textContent = data.gameTitle;

  // Load images
  const img1 = new Image();
  const img2 = new Image();
  img1.src = data.images.image1;
  img2.src = data.images.image2;

  img1.onload = () => {
    canvas1.width = img1.width;
    canvas1.height = img1.height;
    ctx1.drawImage(img1, 0, 0);
  };

  img2.onload = () => {
    canvas2.width = img2.width;
    canvas2.height = img2.height;
    ctx2.drawImage(img2, 0, 0);
  };

  const differences = data.differences;

  canvas1.addEventListener('click', (e) => checkDifference(e, canvas1, differences, ctx1));
  canvas2.addEventListener('click', (e) => checkDifference(e, canvas2, differences, ctx2));

  // Start timer
  interval = setInterval(() => {
    timer++;
    timerElement.textContent = `Time: ${timer}s`;
  }, 1000);
}

function checkDifference(event, canvas, differences, ctx) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    for (let i = 0; i < differences.length; i++) 
    {
        const { x: diffX, y: diffY, width, height } = differences[i];

        console.log(x,y);

        //console.log(width, height);
        if (x >= diffX && x <= diffX + width && y >= diffY && y <= diffY + height)
        {
            // Draw bounding box
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(diffX, diffY, width, height);

            // Increment score and remove this difference
            score++;
            scoreElement.textContent = `Score: ${score}`;
            differences.splice(i, 1);

            if (differences.length === 0) 
            {
                clearInterval(interval);
                alert(`Congratulations! You found all differences in ${timer}s!`);
            }
            break;
        }
    }
}
