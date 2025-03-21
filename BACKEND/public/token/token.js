

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

function login() {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const urlParams = new URLSearchParams(window.location.search);
    const verify = urlParams.get("verify");
    
    fetch(`/token?verify=${verify}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
    }).then(response => {
        response.json()  // Ensure this is handled properly as a promise
    .then(data => {
        if(data.mssg == "Your Email is Verified"){
        showResponse(data.mssg,"green")
        setTimeout(() => {
            window.location.href = '/auth';
        }, 1000);}
        else if(data.mssg){
            showResponse(data.mssg,"green")
        }
        else{
            showResponse(data.error,"red")}
        }
        
    )})
    .catch(error => {
        showResponse("Error: " + error, 'red');
    });
}


