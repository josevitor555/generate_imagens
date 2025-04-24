
// Inject Example prompts
const userExamplePrompt = (promptText) => {
    const promptInput = document.getElementById("promptInput");
    promptInput.value = promptText;
    promptInput.focus();

    // Add a subtle highlight effect
    promptInput.classList.add("prompt-highlight");
    setTimeout(() => {
        promptInput.classList.remove("prompt-highlight");
    }, 2000); // Duration of the highlight effect
}