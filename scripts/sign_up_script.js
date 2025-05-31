function signUp() {
  function validateSignUpForm() {
    const checker_newsletter =
      document.getElementById("checker_newsletter").checked;
    const checker_AGB = document.getElementById("checker_AGB").checked;
    const email_input = document.getElementById("email-input").value;

    if (
      !checker_newsletter ||
      !checker_AGB ||
      email_input === "" ||
      email_input === null ||
      !format_checker(email_input)
    ) {
      alert(
        "All fields are required and must be valid. Check the format of your email address."
      );
      return false;
    }
    console.log("Sign-up form validation passed.");
    return true;
  }

  function format_checker(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  function updateSignUpPage() {
    const loginContainer = document.getElementById("login__container");
    loginContainer.style.transform = "translate(0, -63vh)";
    loginContainer.style.opacity = "1";
    console.log("Updating sign-up page...");
  }

  function saveSignUpData() {
    const userData = {
      email: document.getElementById("email-input").value,
      newsletter: document.getElementById("checker_newsletter").checked,
      agb: document.getElementById("checker_AGB").checked,
    };

    console.log("Preparing to send user data:", userData);

    const fs = require('fs');

    // Convert the object to a JSON string
    const jsonString = JSON.stringify(userData, null, 2);
    
    // Write the JSON string to a file
    fs.writeFile('save_user_data.json', jsonString, (err) => {
      if (err) {
        console.log('Error writing file', err);
      } else {
        console.log('JSON data is saved to data.json');
      }
    });
  }

  console.log("Sign-up function called.");
  if (validateSignUpForm()) {
    console.log("Sign-up successful!");
    updateSignUpPage();
    saveSignUpData();
  }
}
