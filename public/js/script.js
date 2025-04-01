document.getElementById("togglePassword").addEventListener("click", function() {
    const passwordField = document.getElementById("password");
    if (passwordField.type === "password") {
        passwordField.type = "text";
        this.textContent = "Hide"; // Change to hide icon
    } else {
        passwordField.type = "password";
        this.textContent = "Show"; // Change to show icon
    }
});