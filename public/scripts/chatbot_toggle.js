function chatbotToggle() {
    const chatbot_container = document.getElementById("chat-card");
    chatbot_container.style.opacity = "1";
    chatbot_container.style.zIndex = "999";
}
function chatbotClose() {
    const chatbot_container = document.getElementById("chat-card");
    chatbot_container.style.opacity = "0";
    chatbot_container.style.zIndex = "-1";
}