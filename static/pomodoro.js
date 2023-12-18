let timerOn = false;
let onBreak = false;
let interval;
let remainingTime = 0;
let duration = 0;

// Title
const title = document.getElementById("pom-title");

// Buttons
const startbutton = document.getElementById("toggleButton");
const stopbutton = document.querySelector(".btn-stop");
const breakbutton = document.querySelector(".btn-break");

// Clock hands
const minhand = document.querySelector(".minute-hand");
const sechand = document.querySelector(".second-hand");

// Remaining time text
const remMin = document.querySelector(".rem-minute");
const remSec = document.querySelector(".rem-second");

// Audios
const audstart = document.getElementById("audio-start");
const audend = document.getElementById("audio-end");
const audtick = document.getElementById("audio-tick");


function togglePomodoro(time) {
    duration = time;

    if (timerOn) {

        clearInterval(interval); // Pause the timer
        timerOn = false;
        timerPauseUI();

    } else {
        timerOn = true;
        timerOnUI();

        remainingTime = remainingTime > 0 ? remainingTime : duration * 60;

        // Update remaining time, animate hands, show remaining time
        interval = setInterval(function() {
            let minutes = Math.floor(remainingTime / 60);
            let seconds = remainingTime % 60;
            // Format minutes and seconds for display (01:30 instead of 1.:30)
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            // Animate clock hands
            minhand.style.transform = `rotate(${minutes * 6}deg)`;
            sechand.style.transform = `rotate(${seconds * 6}deg)`;
            // Show remaining time
            remMin.innerHTML = minutes;
            remSec.innerHTML = seconds;

            if (remainingTime < 10) { // Play ticking in last 10 seconds

                if (audtick.paused) {
                    audtick.play();
                }
            }
            // Alert when time runs out
            if (--remainingTime < 0) {

                if (!audtick.paused){
                    audtick.pause();
                }
                title.textContent = "Done!";

                clearInterval(interval);
                timerOn = false;
                if (audend.paused) {
                    audend.play();
                }
                startbutton.textContent = "Start New";
                startbutton.style.backgroundColor = "#AEFF8B";
                stopbutton.style.display = "none";

                // Don't save a session or show break button again, if break is done.
                if (onBreak) {
                    onBreak = false;
                    return;
                }

                breakbutton.style.display = "inline-block";

                // Save session to appdata.db
                fetch("/pomodoro", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json" // Content type to send
                    },
                    body: JSON.stringify({
                        action: "WRITE"
                    }) // Send the word "WRITE"
                })
                .then(response => response.json())
                .then(data => {
                    updateData(data.past)
                })
                .catch(error => {
                    // Handle network errors or request failure
                    console.error("Error:", error);
                });
                alert("Work session is complete!")
            }
        }, 1000);
    }
}

function stopPomodoro() {
    clearInterval(interval); // Stop the timer
    timerOn = false;
    remainingTime = 0;

    // Adjust start button and hide stop button
    startbutton.textContent = "Restart";
    startbutton.style.backgroundColor = "#AEFF8B";
    stopbutton.style.display = "none";
    title.textContent = "Stopped";
}


function startBreak() {
    togglePomodoro(0.15); // TODO: CHANGE TEST VALUES
    breakbutton.style.display = "none";
    onBreak = true;
    title.textContent = "On break . . .";
}


function timerOnUI() {
    // Set title for work or break
    if(onBreak) {
        title.textContent = "On break . . .";
    } else {
        title.textContent = "Working . . .";

    }
    // Check if audio is paused, play if not playing
    if (audstart.paused) {
        audstart.play();
    }
    // Adjust start toggle button properties
    startbutton.textContent = "Pause";
    startbutton.style.backgroundColor = "#FDFF5E";

    // Show stop button
    stopbutton.style.display = "inline-block";
}

function timerPauseUI() {
    // Adjust start toggle button properties
    startbutton.textContent = "Continue";
    startbutton.style.backgroundColor = "#AEFF8B";

    stopbutton.style.display = "none";

    title.textContent = "Paused . . .";
}


function deleteEntry(itemId) {
    fetch("/pomodoro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Content type to send
        },
        body: JSON.stringify({
            action: itemId
        }) // Send the word "WRITE"
    })
    .then(response => response.json())
    .then(data => {
        // Update data table
        updateData(data.past)
    })
    .catch(error => {
        // Handle network errors or request failure
        console.error("Error:", error);
    });
}


function updateData(data) {
    const tableBody = document.querySelector(".table-data tbody");
        tableBody.innerHTML = ""; // Clear the existing table content

        // Populate the table with updated data
        data.forEach(work => {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${work.date}</td>
                <td>${work.time}</td>
                <td><button class="btn btn-outline-light" onclick="deleteEntry(${work.id})">Delete</button></td>
            `;
            tableBody.appendChild(newRow);
        });
}
