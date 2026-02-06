// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const personName = urlParams.get('name') || null;
const customMessage = urlParams.get('message') || "I'm so happy you said yes! You've made me the happiest person in the world! 💕 Can't wait to spend this Valentine's Day with you!";

// Elements
const questionContent = document.getElementById('questionContent');
const successContent = document.getElementById('successContent');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const shareBtn = document.getElementById('shareBtn');
const messageElement = document.getElementById('customMessage');
const mainTitle = document.getElementById('mainTitle');

// Personalize the title if a name is provided
if (personName) {
    mainTitle.textContent = `${personName}, Will You Be My Valentine? 💕`;
    document.title = `${personName}, Will You Be My Valentine? 💕`;
}

// No button hover effect - moves away from cursor
let lastMoveTime = 0;
const moveDelay = 300; // Minimum time between moves in milliseconds

// Track mouse movement near the No button
document.addEventListener('mousemove', (e) => {
    const btnRect = noBtn.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Calculate distance from mouse to button center
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;
    const distance = Math.sqrt(
        Math.pow(mouseX - btnCenterX, 2) +
        Math.pow(mouseY - btnCenterY, 2)
    );

    // If mouse is within 100px of the button, move it away
    const now = Date.now();
    if (distance < 100 && now - lastMoveTime > moveDelay) {
        lastMoveTime = now;
        moveNoButton();
    }
});

noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
});

function moveNoButton() {
    const container = document.querySelector('.buttons-container');
    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const yesBtnRect = yesBtn.getBoundingClientRect();

    // Calculate Yes button position relative to container
    const yesX = yesBtnRect.left - containerRect.left;
    const yesY = yesBtnRect.top - containerRect.top;
    const yesWidth = yesBtnRect.width;
    const yesHeight = yesBtnRect.height;

    // Calculate maximum movement boundaries
    const maxX = containerRect.width - btnRect.width - 20;
    const maxY = containerRect.height - btnRect.height - 20;

    let newX, newY;
    let attempts = 0;
    const maxAttempts = 50;
    const minDistance = 150; // Minimum distance from Yes button

    // Keep trying until we find a position that doesn't overlap with Yes button
    do {
        newX = Math.random() * maxX;
        newY = Math.random() * maxY;
        attempts++;

        // Calculate distance from Yes button center
        const yesCenterX = yesX + yesWidth / 2;
        const yesCenterY = yesY + yesHeight / 2;
        const noCenterX = newX + btnRect.width / 2;
        const noCenterY = newY + btnRect.height / 2;

        const distance = Math.sqrt(
            Math.pow(noCenterX - yesCenterX, 2) +
            Math.pow(noCenterY - yesCenterY, 2)
        );

        // Check if position is safe (far enough from Yes button)
        if (distance >= minDistance) {
            break;
        }

        // If we've tried too many times, force it to a corner far from Yes button
        if (attempts >= maxAttempts) {
            if (yesCenterX < containerRect.width / 2) {
                newX = maxX; // Move to right
            } else {
                newX = 0; // Move to left
            }
            if (yesCenterY < containerRect.height / 2) {
                newY = maxY; // Move to bottom
            } else {
                newY = 0; // Move to top
            }
            break;
        }
    } while (attempts < maxAttempts);

    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;

    // Change emoji to show sadness
    const sadEmojis = ['😢', '😭', '🥺', '😔', '💔', '😿'];
    const randomEmoji = sadEmojis[Math.floor(Math.random() * sadEmojis.length)];
    noBtn.textContent = `No ${randomEmoji}`;
}

// Yes button click - show success message
yesBtn.addEventListener('click', () => {
    questionContent.classList.add('hidden');
    successContent.classList.remove('hidden');
    messageElement.textContent = customMessage;

    // Add confetti effect
    createConfetti();
});

// Share button - WhatsApp share
shareBtn.addEventListener('click', () => {
    const shareMessage = encodeURIComponent("I said YES! 💕 Will you be my Valentine? Click here to answer:");
    let shareUrl = window.location.origin + window.location.pathname + `?message=${encodeURIComponent(customMessage)}`;
    if (personName) {
        shareUrl += `&name=${encodeURIComponent(personName)}`;
    }
    const whatsappUrl = `https://wa.me/?text=${shareMessage}%20${encodeURIComponent(shareUrl)}`;

    window.open(whatsappUrl, '_blank');
});

// Confetti effect
function createConfetti() {
    const colors = ['#f093fb', '#f5576c', '#e91e63', '#ff6b9d', '#c471ed'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '1000';
            confetti.style.pointerEvents = 'none';
            confetti.style.animation = `fall ${2 + Math.random() * 2}s linear`;

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }, i * 30);
    }
}

// Add fall animation for confetti
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
