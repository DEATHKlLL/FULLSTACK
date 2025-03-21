function toggleForm() {
            const loginContainer = document.getElementById("login-container");
            const registerContainer = document.getElementById("register-container");
            if (loginContainer.style.display === "none") {
                loginContainer.style.display = "block";
                registerContainer.style.display = "none";
            } else {
                loginContainer.style.display = "none";
                registerContainer.style.display = "block";
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

        function login() {
            event.preventDefault();
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;
            
            fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            }).then(response => {
                response.json()  // Ensure this is handled properly as a promise
            .then(data => {
        if (response.status == 200 && data.mssg=="You are Logged In" ) {
            showResponse("You are Logged in", 'green');
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);   
        }
        else{
            if(response.status == 500){
                showResponse(data.error,'red');
                document.getElementById("forgot-password").style.display = "none";
            }
            else{
                if (data.mssg == "Wrong password") {
                            document.getElementById("forgot-password").style.display = "block";
                            showResponse(data.mssg ,'red');
                } 
                else if (data.mssg == "Plz register first"){
                    showResponse(data.mssg ,'red');
                    setTimeout(() => {
                        toggleForm();
                    }, 1000); 
                }
            }
        }
                
            })})
            .catch(error => {
                showResponse("Error: " + error, 'red');
            });
            // .then(response => {
            //     if (response.status === 200) {
            //         showResponse("Login successful!", 'green');
            //     } else if (response.status === 500) {
            //         showResponse("Wrong Password", 'red');
            //     }
            //     return response.json();
            // })
            // .then(data => {
            //     if (data.error === "Wrong password") {
            //         document.getElementById("forgot-password").style.display = "block";
            //     } else {
            //         document.getElementById("forgot-password").style.display = "none";
            //     }
            // })
            // .catch(error => {
            //     showResponse("Error: " + error, 'red');
            // });
        }

        function forgotPassword() {
            alert("Redirecting to forgot password page...");
            
        }

        function register() {
            event.preventDefault();
            const username = document.getElementById("register-username").value;
            const email = document.getElementById("register-email").value;
            const password = document.getElementById("register-password").value;
            const role = document.getElementById("register-role").value;
            
            fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password, role }),
                credentials: 'include'
            })
            .then(response => {
                response.json()  
            .then(data => {
        if (response.status === 200) {
            showResponse(JSON.stringify(data.mssg), 'green'); 
            setTimeout(() => {
                toggleForm();
            }, 1000); 
        } else{
            if(data.error  == "unique_email must be unique"){
                showResponse("Email is Already Registered Plz Login", 'red');
                setTimeout(() => {
                    toggleForm();
                }, 1000); 

            }else{
                showResponse(JSON.stringify(data.error), 'red');
            }
            

        }
                
            })})
            .catch(error => {
                showResponse("Error: " + error, 'red');
            });
        }


// Detect scroll position and show/hide header and footer
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    // If at the top of the page, show the header
    if (window.scrollY === 0) {
        header.classList.remove('hidden');
        footer.classList.remove('hidden');
    } else {
        // If not at the top, hide the header and footer
        header.classList.add('hidden');
        footer.classList.add('hidden');
    }

    // If at the bottom of the page, show the footer
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
        footer.classList.remove('hidden');
    }
});
