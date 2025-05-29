function signUp() {
  function validateSignUpForm() {
    const checker_newsletter =
      document.getElementById("checker_newsletter").checked;
    const checker_AGB = document.getElementById("checker_AGB").checked;
    const email_input = document.getElementById("email-input").value;

    if (
      checker_newsletter === false ||
      checker_AGB === false ||
      email_input === "" ||
      email_input === null ||
      format_checker(email_input) === false
    ) {
      alert(
        "All fields are required and must be valid. Check the format of your email address."
      );
      return false;
    }
    return true;
  }
  function format_checker(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  function updateSignUpPage() {
    console.log("Updating sign-up page...");
  }
  function saveSignUpData() {
    const userData = {
      email: document.getElementById("email-input").value,
      newsletter: document.getElementById("checker_newsletter").checked,
      agb: document.getElementById("checker_AGB").checked,
    };

    // Send data to the server
    fetch("/save_user_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }).then((response) => {
      if (response.ok) {
        console.log("Sign-up data saved successfully!");
      } else {
        console.error("Failed to save sign-up data.");
      }
    });
    console.log("Sign-up data saved.");
  }
  if (validateSignUpForm()) {
    console.log("Sign-up successful!");
    saveSignUpData();
    updateSignUpPage();
  }
}
