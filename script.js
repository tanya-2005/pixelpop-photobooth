
const startscreen = document.querySelector(".startscreen");
const boothscreen = document.querySelector(".boothscreen");
const stripscreen = document.querySelector(".stripscreen");

const enterbtn = document.querySelector(".snap");

const video = document.querySelector(".video");

const message = document.querySelector(".msg");

enterbtn.addEventListener("click", async () => {
    startscreen.style.display = 'none';
    boothscreen.style.display = 'block';
    startCamera();
});

function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => {
            console.log("Error accessing webcam ", err);
            alert("Allow camera access");
        })
}

const filterbuttons = document.querySelectorAll(".filter-btn");

filterbuttons.forEach((btn) => {
    btn.addEventListener("click", () => {

        const selectedFilter = btn.dataset.filter;


        if (selectedFilter.includes("(")) {
            video.style.filter = selectedFilter;
        }

        else if (selectedFilter === "none") {
            video.style.filter = "none";
        }

    })
})

const countdown = document.querySelector(".countdown");
const capturebtn = document.querySelector(".capture");

let photocount = 1;

capturebtn.addEventListener("click", () => {
    photocount = 1;
    takePhoto(4);
})

function startCountdown(seconds, currentPhotoNumber) {
    countdown.style.display = "block";
    countdown.textContent = seconds;

    message.style.display = "block";
    message.style.visibility = "visible";
    message.textContent = `Get ready for photo ${currentPhotoNumber}✨`;

    const countdownInterval = setInterval(() => {
        seconds--;

        if (seconds === 0) {
            clearInterval(countdownInterval);
            countdown.textContent = "";

            setTimeout(() => {
                countdown.style.display = "block";
            }, 1000);
        } else {
            countdown.textContent = seconds;
        }

    }, 1000);
}

function takePhoto(timeLeft) {
    if (timeLeft === 0) {
        boothscreen.style.display = "none";
        stripscreen.style.display = "block";

        const timestamp = document.getElementById("timestamp");
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-GB');
        timestamp.textContent = `PixelPop • ${formattedDate}`;

        return;
    }

    startCountdown(3, photocount);

    setTimeout(() => {
        captureFrame();

        takePhoto(timeLeft - 1);
    }, 4500);
}

function captureFrame() {
    const canvas = document.querySelector(".canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    ctx.filter = getComputedStyle(video).filter;

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL("image/jpeg");

    const img = document.getElementById(`strip${photocount}`);
    if (img) {
        img.src = dataURL;
    }

    photocount++;
}

let draggedEmoji = null;


interact('.emoji').draggable({
    listeners: {
        start(event) {
            draggedEmoji = event.target.getAttribute('data-emoji');
        },
        end(event) {
              const dropzone = document.getElementById('stripcanvas');
              if (!dropzone) return;  // ✅ Safety check

              const rect = dropzone.getBoundingClientRect();
              const x = event.client.x - rect.left;
              const y = event.client.y - rect.top;

              if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
                const sticker = document.createElement('span');
                sticker.className = 'sticker';
                sticker.textContent = draggedEmoji;
                sticker.style.left = `${x}px`;
                sticker.style.top = `${y}px`;
                dropzone.appendChild(sticker);
              }

              draggedEmoji = null;

        }
    }
});

const downloadbtn = document.querySelector(".download");

downloadbtn.addEventListener("click", () => {
    
    const strip = document.getElementById("stripcanvas");

    html2canvas(strip, {useCORS:true}).then((canvas) => {
        const link = document.createElement("a");
        link.download = "PixelPop Photostrip.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});

const retake = document.querySelector(".retake");

retake.addEventListener("click", () => {
   location.reload();
})





