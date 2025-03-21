
let floorsData = [];

function nextStep() {
    const pgName = document.getElementById("pgName").value;
    const pgAddress = document.getElementById("pgAddress").value;
    const floors = parseInt(document.getElementById("floors").value);

    if (!pgName || !pgAddress || !floors) {
        alert("Please fill all fields.");
        return;
    }

    // Store PG basic data
    floorsData = Array.from({ length: floors }, () => ({
        rooms: []
    }));

    // Step 2: Show room configuration
    document.getElementById("pgForm").style.display = "none";
    document.getElementById("roomsSection").style.display = "block";

    const floorsContainer = document.getElementById("floorsContainer");
    floorsContainer.innerHTML = "";

    // Create fields for each floor
    floorsData.forEach((_, index) => {
        floorsContainer.innerHTML += `
            <label for="floor${index + 1}">Floor ${index + 1} - Number of Rooms:</label>
            <input type="number" id="floor${index + 1}" min="1" required />
        `;
    });
}

function submitRooms() {
    floorsData.forEach((floor, index) => {
        const rooms = parseInt(document.getElementById(`floor${index + 1}`).value);
        if (!rooms) {
            alert(`Enter number of rooms for Floor ${index + 1}`);
            return;
        }
        floorsData[index].rooms = Array.from({ length: rooms }, () => ({
            sharing: ""
        }));
    });

    // Step 3: Show sharing configuration
    document.getElementById("roomsSection").style.display = "none";
    document.getElementById("sharingSection").style.display = "block";

    const roomsContainer = document.getElementById("roomsContainer");
    roomsContainer.innerHTML = "";

    // Create fields for each room
    floorsData.forEach((floor, floorIndex) => {
        floor.rooms.forEach((_, roomIndex) => {
            roomsContainer.innerHTML += `
                <label>Floor ${floorIndex + 1} - Room ${roomIndex + 1}:</label>
                <select id="room${floorIndex}-${roomIndex}">
                    <option value="2 Sharing">2 Sharing</option>
                    <option value="3 Sharing">3 Sharing</option>
                    <option value="4 Sharing">4 Sharing</option>
                </select>
            `;
        });
    });
}

async function submitPG() {
    // Collect sharing data
    floorsData.forEach((floor, floorIndex) => {
        floor.rooms.forEach((_, roomIndex) => {
            const sharing = document.getElementById(`room${floorIndex}-${roomIndex}`).value;
            floorsData[floorIndex].rooms[roomIndex].sharing = sharing;
        });
    });

    // Create FormData object
    const formData = new FormData();
    formData.append("pgName", document.getElementById("pgName").value);
    formData.append("pgAddress", document.getElementById("pgAddress").value);
    formData.append("pgImage", document.getElementById("pgImage").files[0]);
    formData.append("floors", JSON.stringify(floorsData));

    try {
        const response = await fetch("/pg/register", {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        const messageBox = document.getElementById("responseMessage");

        if (response.ok) {
            messageBox.style.color = "green";
            messageBox.textContent = "PG Registered Successfully!";
        } else {
            messageBox.style.color = "red";
            messageBox.textContent = result.error || "Failed to register PG.";
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("responseMessage").style.color = "red";
        document.getElementById("responseMessage").textContent = "Server Error!";
    }
}
