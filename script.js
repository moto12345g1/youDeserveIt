const messages = [
    "If you ever forget how special you are, I hope this reminds you that your softness, your strength, and your way of caring for people leave a mark that lasts far longer than you realize.",
    "There is something deeply comforting about you, the kind of presence that makes people breathe easier, feel safer, and believe that tenderness still exists in the world.",
    "You carry light in such a quiet, beautiful way. Not loud, not performative, just real enough to make life feel warmer and hearts feel a little less alone.",
    "The love and steadiness in you make hard days gentler. You have this way of making things feel survivable simply by being exactly who you are.",
    "I hope you never become smaller to fit the world. The way you love, notice, and stay kind is rare, and it deserves to be protected for a very long time."
];

const videoAssets = [
    "assets/V1.mp4",
    "assets/V2.mp4",
    "assets/V3.mp4",
    "assets/V4.mp4",
    "assets/V5.mp4",
    "assets/V6.mp4",
    "assets/V7.mp4",
];

const cardPrompts = [
    {
        label: "Little reminder",
        title: "Open when you need something soft",
        subtitle: "A small piece of warmth is waiting inside."
    },
    {
        label: "For your heart",
        title: "Open when life feels heavy",
        subtitle: "Let this hold you for a moment."
    },
    {
        label: "A quiet truth",
        title: "Open when you need to feel seen",
        subtitle: "There is something gentle here for you."
    },
    {
        label: "Keep this close",
        title: "Open when you need a little light",
        subtitle: "Just one more reminder of who you are."
    },
    {
        label: "Always yours",
        title: "Open when you need reassurance",
        subtitle: "This one is here to stay with you a while."
    }
];

let videos = [];
let opened = [];

const container = document.getElementById("cardsContainer");
const dotsContainer = document.getElementById("dots");
const fullscreen = document.getElementById("fullscreen");
const fsVideo = document.getElementById("fsVideo");
const fsMessage = document.getElementById("fsMessage");
const actions = document.getElementById("actions");
const completion = document.getElementById("completion");
const final = document.getElementById("final");
const journeySection = document.getElementById("journeySection");
const introOverlay = document.getElementById("introOverlay");
const pullCord = document.getElementById("pullCord");
const journeyButton = document.querySelector(".journey-button");
const curtainClapAudio = document.getElementById("curtainClapAudio");

document.body.classList.add("intro-active");

initializeGallery();

async function initializeGallery() {
    videos = videoAssets.slice();
    opened = Array(videos.length).fill(false);

    if (videos.length === 0) {
        container.innerHTML = '<div class="card"><span class="card-title">No videos found</span><span class="card-subtitle">Add V1.mp4 through V5.mp4 inside the assets folder.</span></div>';
        return;
    }

    renderCards();
    renderDots();
    updateCurrentDot();
}

function renderCards() {
    container.innerHTML = "";

    videos.forEach((_, index) => {
        const prompt = cardPrompts[index % cardPrompts.length];
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <span class="card-label">${prompt.label}</span>
            <span class="card-title">${prompt.title}</span>
            <span class="card-subtitle">${prompt.subtitle}</span>
        `;
        card.onclick = () => openVideo(index);
        container.appendChild(card);
    });
}

function renderDots() {
    dotsContainer.innerHTML = "";

    videos.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.className = "dot";

        dot.onclick = () => {
            const card = container.children[index];

            if (!card) {
                return;
            }

            centerCard(card);
        };

        dotsContainer.appendChild(dot);
    });
}

function centerCard(card) {
    const scrollTo = card.offsetLeft - container.offsetWidth / 2 + card.offsetWidth / 2;

    container.scrollTo({
        left: scrollTo,
        behavior: "smooth"
    });
}

function openVideo(index) {
    const card = container.children[index];

    if (!card) {
        return;
    }

    fullscreen.classList.remove("hidden");
    fullscreen.classList.add("animate");

    fsMessage.style.display = "block";
    fsMessage.style.opacity = "1";
    fsMessage.innerText = messages[index % messages.length];

    fsVideo.src = videos[index];
    fsVideo.muted = false;
    fsVideo.volume = 1;
    fsVideo.style.opacity = "0";
    fsVideo.classList.remove("playing");
    fsVideo.currentTime = 0;

    setTimeout(() => {
        fsMessage.style.transition = "opacity 1s ease";
        fsMessage.style.opacity = "0";

        setTimeout(() => {
            fsMessage.style.display = "none";

            fsVideo.style.transition = "opacity 1s ease";
            fsVideo.style.opacity = "1";
            fsVideo.classList.add("playing");
            fsVideo.play().catch(() => {});
        }, 1000);
    }, 3500);

    fsVideo.onended = () => {
        fullscreen.classList.add("hidden");
        fullscreen.classList.remove("animate");

        opened[index] = true;
        card.classList.add("is-opened");
        card.innerHTML = `<video src="${videos[index]}" muted loop autoplay playsinline></video>`;

        const preview = card.querySelector("video");

        if (preview) {
            preview.play().catch(() => {});
        }

        checkCompletion();
        updateCurrentDot();
    };
}

function checkCompletion() {
    if (opened.length > 0 && opened.every((value) => value)) {
        completion.classList.remove("hidden");
        actions.classList.remove("hidden");
    }
}

function playFinal() {
    final.classList.remove("hidden");
}

function closeFinal() {
    final.classList.add("hidden");
}

function startJourney() {
    if (document.body.classList.contains("journey-open") || document.body.classList.contains("journey-opening")) {
        return;
    }

    if (journeyButton) {
        journeyButton.classList.add("is-hidden");
    }

    window.setTimeout(() => {
        playCurtainClap();
        document.body.classList.add("cord-pulling");
    }, 550);

    window.setTimeout(() => {
        document.body.classList.remove("cord-pulling");
        if (pullCord) {
            pullCord.style.transform = "";
        }
    }, 1250);

    window.setTimeout(() => {
        document.body.classList.add("journey-opening");
    }, 970);

    window.setTimeout(() => {
        document.body.classList.add("journey-open");
    }, 1930);

    window.setTimeout(() => {
        introOverlay.classList.add("hidden");
        document.body.classList.remove("journey-opening");
    }, 3070);
}

function playCurtainClap() {
    if (!curtainClapAudio) {
        return;
    }

    curtainClapAudio.currentTime = 0;
    curtainClapAudio.play().catch(() => {});
}

let isDown = false;
let startX;
let scrollLeft;
let hasDragged = false;

container.addEventListener("mousedown", (event) => {
    isDown = true;
    startX = event.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    hasDragged = false;
    container.classList.add("grabbing");
});

container.addEventListener("mouseleave", () => {
    isDown = false;
    container.classList.remove("grabbing");
});

container.addEventListener("mouseup", () => {
    isDown = false;
    container.classList.remove("grabbing");
    window.setTimeout(() => {
        hasDragged = false;
    }, 0);
});

container.addEventListener("mousemove", (event) => {
    if (!isDown) {
        return;
    }

    event.preventDefault();
    const x = event.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    hasDragged = true;
    container.scrollLeft = scrollLeft - walk;
});

let lastDistance = 0;

container.addEventListener("touchmove", (event) => {
    if (event.touches.length !== 2) {
        return;
    }

    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
    );

    if (lastDistance > 0) {
        const delta = distance - lastDistance;

        if (Math.abs(delta) > 5) {
            event.preventDefault();
        }
    }

    lastDistance = distance;
}, { passive: false });

container.addEventListener("touchend", () => {
    lastDistance = 0;
});

container.addEventListener("click", (event) => {
    if (!hasDragged) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();
    hasDragged = false;
}, true);

container.addEventListener("scroll", () => {
    updateCurrentDot();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !final.classList.contains("hidden")) {
        closeFinal();
    }
});

function updateCurrentDot() {
    const cards = document.querySelectorAll(".card");
    const dots = document.querySelectorAll(".dot");

    if (cards.length === 0 || dots.length === 0) {
        return;
    }

    const containerCenter = container.scrollLeft + container.offsetWidth / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(containerCenter - cardCenter);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === closestIndex);
    });
}
