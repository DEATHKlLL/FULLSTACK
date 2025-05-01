

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


function sendOTP() {
    const email = document.getElementById("email").value;
    
    fetch("/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.mssg === "OTP sent") {
            showResponse("OTP sent to your email", "green");
            document.getElementById("email-step").style.display = "none";
            document.getElementById("otp-step").style.display = "block";
            
        } else {
            showResponse(data.error || "Failed to send OTP", "red");
        }
    })
    .catch(error => {
        showResponse("Error: " + error, "red");
    });
}

function changePassword() {
    const otp = document.getElementById("otp").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (newPassword != confirmPassword) {
        showResponse("Both should conatin same password", "red");
        return;
    }
    fetch("/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, newPassword, confirmPassword })
    })
    .then(response => response.json())
    .then(data => {
        if (data.mssg === "Password changed") {
            showResponse("Password changed successfully", "green");
            setTimeout(() => {
                window.location.href = "/auth";
            }, 1000);
        } else {
            showResponse(data.error || "Failed to reset password", "red");
        }
    })
    .catch(error => {
        showResponse("Error: " + error, "red");
    });
}


