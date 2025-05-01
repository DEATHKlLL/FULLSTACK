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
function showResponse(message, color) {
    const responseBox = document.getElementById("response-box");
    responseBox.textContent = message;
    responseBox.style.backgroundColor = color;
    responseBox.style.display = "block";

    // Hide the box after 3 seconds
    setTimeout(() => {
        responseBox.style.display = "none";
    }, 3000);
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
            showResponse("You are not Logged In", 'red');
            setTimeout(() => {
        window.location.href = '/auth';
    }, 1000); 
    }else{
        const div = document.querySelector(".content-box");
        div.innerHTML = `<strong> EMAIL:-</strong>&nbsp${data.email} <br> <strong>ROLE</strong>:-&nbsp${data.role} `;
        testDiv.innerHTML = "";
    }

    })
});
}

function logout(){
    showResponse("you are being Logged Out","red")
    setTimeout(() => {
        window.location.href = '/logout';
    }, 500);
}

async function fetchPGs() {
    const searchQuery = document.getElementById("searchBar").value.trim();
    
    // Get all selected amenities
    const selectedAmenities = Array.from(document.querySelectorAll(".amenity-filter:checked"))
        .map(checkbox => checkbox.value);

    // Convert the amenities to a JSON string for backend query
    const amenityQuery = encodeURIComponent(JSON.stringify(selectedAmenities));

    // Construct API URL with parameters
    const response = await fetch(`/pg/find?search=${encodeURIComponent(searchQuery)}&amenity=${amenityQuery}`);
    const pgData = await response.json();

    displayPGs(pgData);
}

// Function to Display PGs
function displayPGs(pgData) {
    const pgList = document.getElementById("pgList");
    pgList.innerHTML = "";

    if (pgData.length === 0) {
        pgList.innerHTML = "<p>No PGs found.</p>";
        return;
    }

    pgData.forEach(pg => {
        const pgCard = document.createElement("div");
        pgCard.classList.add("pg-card");

        pgCard.innerHTML = `
            <img src="/uploads/${pg.img_path}" alt="${pg.name}">
            <h3>${pg.name}</h3>
            <p>${pg.address}</p>
            <p><strong>Price:</strong> ₹${pg.Price}</p>
            <p><strong>Amenities:</strong> ${pg.emenities.join(", ")}</p>
        `;
        pgList.appendChild(pgCard);
    });
}

// Event listeners for dynamic filtering
document.getElementById("searchBar").addEventListener("input", fetchPGs);
document.querySelectorAll(".amenity-filter").forEach(checkbox => {
    checkbox.addEventListener("change", fetchPGs);
});
fetchPGs();