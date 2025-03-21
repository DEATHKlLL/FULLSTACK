


async function fetchUsers() {
    const searchQuery = document.getElementById("search").value + "";
    const response = await fetch(`/admin/user?search=${searchQuery}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const users = await response.json();
    const userTable = document.getElementById("userTable");
    userTable.innerHTML = "";
    users.forEach(user => {
        userTable.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
                    <button class="block-btn" onclick="blockUser(${user.id})">Block</button>
                </td>
            </tr>
        `;
    })
}
n
async function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        const responsed = await fetch(`/admin/user?id=${userId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log(responsed.status);
        fetchUsers();
    }
    
}

// Block user function
async function blockUser(userId) {
    const blockTime = prompt("Enter block duration in hours:");
    if (blockTime && !isNaN(blockTime)) {
        await fetch(`${API_URL}/block-user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, duration: blockTime })
        });
        alert(`User blocked for ${blockTime} hours`);
        fetchUsers();
    }
}

// Load users initially
fetchUsers();
