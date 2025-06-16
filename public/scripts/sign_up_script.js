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

    // Send data to the server
    fetch("http://localhost:3000/save_user_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Sign-up data saved successfully!");
        } else {
          console.error(
            "Failed to save sign-up data. Status:",
            response.status
          );
        }
      })
      .catch((error) => {
        console.error("Error during fetch:", error);
      });
  }

  console.log("Sign-up function called.");
  if (validateSignUpForm()) {
    console.log("Sign-up successful!");
    updateSignUpPage();
    saveSignUpData();
  }
}
