function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("main-content");
    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-300px";
        mainContent.style.marginLeft = "0";
    } else {
        sidebar.style.left = "0px";
        mainContent.style.marginLeft = "300px";
    }
}
async function profile() {
    console.log("meow");
    fetch("/api/profile", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include'
    }).then(response => {
        response.json()  // Ensure this is handled properly as a promise
    .then(data => {
        if(data.mssg == "INVALID"){
        window.location.href = '/auth';
    }else{
        
        const div = document.querySelector(".content-box");
        div.innerHTML = `<strong> EMAIL:-</strong>&nbsp${data.email} <br> <strong>ROLE</strong>:-&nbsp${data.role} `;
        testDiv.innerHTML = "";
    }

    })
});

}
function PGList() {
fetch('/pg/register')
.then(response => response.text())
.then(data => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data;
    const headerContent = tempDiv.querySelector('#content-box'); 
    const link = document.createElement('link');
link.rel = 'stylesheet';       
link.href = '/pg/style.css';
document.head.appendChild(link);
const script = document.createElement('script');
script.src = '/pg/script.js'; 
script.async = true; 
document.body.appendChild(script);
document.getElementById('box').innerHTML = headerContent.innerHTML;
});
}

function showResponse(message, color) {
    const responseBox = document.getElementById("response-box");
    responseBox.textContent = message;
    responseBox.style.backgroundColor = color;
    responseBox.style.display = "block";
    setTimeout(() => {
        responseBox.style.display = "none";
    }, 2000);
    
}
function logout(){
    showResponse("you are being Logged Out","red")
    setTimeout(() => {
        window.location.href = '/logout';
    }, 500);
}

async function fetchPGs() {
    console.log("test")
    const response = await fetch(`/pg/approval`,{
        method: "GET",
        credentials: "include"
    });
    const pgData = await response.json();
    if(response.status == 200){
        displayPGs(pgData);
    }
    
}

// Function to Display PGs
function displayPGs(pgData) {
    const pgList = document.getElementById("pgList");
    pgList.innerHTML = "";
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
}
fetchPGs();