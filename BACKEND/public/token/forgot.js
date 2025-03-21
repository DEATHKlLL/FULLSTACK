

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

function forgot() {
    event.preventDefault();
    const newpass = document.getElementById("Newpassword").value;
    const conpass = document.getElementById("Confirmpassword").value;
    const urlParams = new URLSearchParams(window.location.search);
    const verify = urlParams.get("verify");
    
    fetch(`http://192.168.29.81:3000/forgot?verify=${verify}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ newpass, conpass }),
    }).then(response => {
        response.json() 
    .then(data => {
        if(data.mssg == "Password changed"){
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


