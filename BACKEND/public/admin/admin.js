

function showResponse(message, color) {
    const responseBox = document.getElementById("response-box");
    responseBox.textContent = message;
    responseBox.style.backgroundColor = color;
    responseBox.style.display = "block";
    setTimeout(() => {
        responseBox.style.display = "none";
    }, 2000);
}


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

async function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        const responsed = await fetch(`/admin/user?id=${userId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const res = await responsed.json();
        if(responsed.status==200){
            showResponse(res.mssg,"red")
            fetchUsers()
        }else{
            showResponse(res.mssg,"red")
            fetchUsers()
        }
    }
}




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
fetchUsers();

function logout(){
        showResponse("you are being Logged Out","red")
        setTimeout(() => {
            window.location.href = '/logout';
        }, 500);
}

async function fetchPGs() {
    const response = await fetch(`/pg/approval`,{
        method: "GET",
        credentials: "include"
    });
    const pgData = await response.json();
    if(response.status == 200){
        displayPGs(pgData);
    }  
}


function displayPGs(pgData) {
    const container = document.querySelector(".containermanage")
    const pgList = document.createElement("div");
    pgList.id ="pgList";
    pgList.className="pg-list";
    
    if (pgData.length === 0) {
        return;
    }
    
    document.getElementById("pgres").innerHTML="<h2>PG Registered</h2>";
    pgData.forEach(pg => {
        const pgCard = document.createElement("div");
        pgCard.classList.add("pg-card");
        pgCard.innerHTML = `
            <h3>${pg.name}</h3>
            <img src="/uploads/${pg.img_path[0]}" alt="${pg.name}">
            <p>${pg.address}</p>
            <p><strong>Price:</strong> ₹${pg.Price}</p>
            <p><strong>Amenities:</strong> ${pg.emenities.join(", ")}</p>
            <strong style="color:${pg.Approved == 1 ? 'green' : 'red'}">${pg.Approved == 1 ? 'APPROVED' : 'PENDING'}</strong>
        `;
        pgList.appendChild(pgCard);
    });
    container.replaceWith(pgList);
}










