function addTask() {
    task = document.getElementById("taskInput");

    const data = {
        action: "WRITE",
        text: task.value,
        status: ""
    }
    task.value="";
    fetch("/todo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Content type to send
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        updateData(data.tododata)
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
    fetch("/todo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Content type to send
        },
        body: JSON.stringify(data) // Send the data
    })
    .then(response => response.json())
    .then(data => {
        // Update data table
        updateData(data.tododata)
    })
    .catch(error => {
        // Handle network errors or request failure
        console.error("Error:", error);
    });
}

function checkTask(id, done) {
    const data = {
        action: "EDIT",
        id: id,
        status: done
    };

    fetch("/todo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Content type to send
        },
        body: JSON.stringify(data) // Send the word "WRITE"
    })
    .then(response => response.json())
    .then(data => {
        // Update data table
        updateData(data.tododata)
    })
    .catch(error => {
        // Handle network errors or request failure
        console.error("Error:", error);
    });
}

function updateData(data) {
    const tableBody = document.querySelector(".table-todo tbody");
        tableBody.innerHTML = ""; // Clear the existing table content

        // Populate the table with updated data
        data.forEach(work => {
            let done = work["status"] == "DONE";
            const newRow = document.createElement("tr");
            if (done) {
                newRow.innerHTML = `
                    <td><button  onclick="checkTask(${work.id},false)" class="btn btn-undo btn-outline-light">Undo</button></td>
                    <td style="text-decoration: line-through; color:#5A5A5A;">${work.task}</td>
                    <td><button class="btn btn-delete btn-outline-light" onclick="deleteEntry(${work.id})">Delete</button></td>
            `;
            } else {
                newRow.innerHTML = `
                    <td><button  onclick="checkTask(${work.id},true)" class="btn btn-done btn-light"> Done </button></td>
                    <td style="text-decoration: none;">${work.task}</td>
                    <td><button class="btn btn-delete btn-outline-light" onclick="deleteEntry(${work.id})">Delete</button></td>
            `;
            }
            tableBody.appendChild(newRow);
        });
}
