let timerOn = false;
let interval;
let seconds = 0;
let minutes = 0;
let hours = 0;
let hour = 0;
let second = 0;
let minute = 0;
const txtHour = document.querySelector(".swch-hour");
const txtMin = document.querySelector(".swch-minute");
const txtSec = document.querySelector(".swch-second");
const txtInput = document.querySelector(".work-input");

// Audios
const audstart = document.getElementById("audio-start");
const audend = document.getElementById("audio-end");

function startTimer() {
    if (!timerOn)
    {
        timerOn = true;
        audstart.play();
        // Update time, show on screen
        interval = setInterval(function() {
            seconds++;

            if (seconds >= 60){ // When 60 seconds pass, add a minute
                seconds = 0;
                minutes++;

                if (minutes >= 60){ // When 60 minutes pass, add an hour
                    minutes = 0;
                    hours++;
                }
            }

            // Show timer values
            hour = hours < 10 ? `0${hours}` : hours;
            second = seconds < 10 ? `0${seconds}` : seconds;
            minute = minutes < 10 ? `0${minutes}` : minutes;
            txtHour.innerHTML = hour;
            txtMin.innerHTML = minute;
            txtSec.innerHTML = second;

        }, 1000);
    }
}
function pauseTimer() {
    if (timerOn) {
        // Stop timer
        clearInterval(interval);
        timerOn = false;
        audend.play();
    }
}
function stopTimer() {
    if (timerOn) {
        // Stop timer
        clearInterval(interval);
        audend.play();
        const duration = `${hour}:${minute}:${second}`;
        //Reset values
        timerOn = false;
        seconds = 0;
        minutes = 0;
        hours = 0;

        // Save new entry to DB
        const timedata = {
            action: "WRITE",
            text: txtInput.value, // Value of work input
            time: duration
        };

        fetch("/stopwatch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // Content type to send
            },
            body: JSON.stringify(timedata) // Send the word "WRITE"
        })
        .then(response => response.json())
        .then(data => {
            // Update data table
            updateData(data.timerdata)
        })
        .catch(error => {
            // Handle network errors or request failure
            console.error("Error:", error);
        });
    }

}

function editEntry(button) {
    document.getElementById("work-input").style.display = "none";
    document.getElementById("edit-group").style.display = "block";
    document.getElementById("btn-set").value = button.value;
    button.style.display = "none";

}
function validateTimeFormat(button) {
    let timePattern = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/; // Regular expression for hh:mm:ss format
    let input = document.getElementById("set-dur")
    if (!timePattern.test(input.value)) {
        alert("Please enter time in the format hh:mm:ss");
      input.value = ''; // Clear the input field if format is incorrect
    }
    else {
        updateEntry(button);
    }
}
function updateEntry(button) {
    const data = {
        action: "EDIT",
        id: button.value,
        task: document.getElementById("set-task").value,
        duration: document.getElementById("set-dur").value

    };
    document.getElementById("work-input").style.display = "block";
    document.getElementById("edit-group").style.display = "none";
    fetch("/stopwatch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Content type to send
        },
        body: JSON.stringify(data) // Send the word "WRITE"
    })
    .then(response => response.json())
    .then(data => {
        // Update data table
        updateData(data.timerdata)
    })
    .catch(error => {
        // Handle network errors or request failure
        console.error("Error:", error);
    });
}

function deleteEntry(id) {
    const data = {
        action: "DELETE",
        id: id
    };
    fetch("/stopwatch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Content type to send
        },
        body: JSON.stringify(data) // Send the word "WRITE"
    })
    .then(response => response.json())
    .then(data => {
        // Update data table
        updateData(data.timerdata)
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
                <td>${work.task}</td>
                <td>${work.duration}</td>
                <td>${work.date}</td>
                <td>${work.time}</td>
                <td><button class="btn btn-outline-light" onclick="deleteEntry(${work.id})">Delete</button>
                <button class="btn btn-outline-light" onclick="updateEntry(this.value)" value="{{work['id']}}">Edit</button></td>
            `;
            tableBody.appendChild(newRow);
        });
}
