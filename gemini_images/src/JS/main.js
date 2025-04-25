const GEMINI_API_KEY = "AIzaSyBpbLLD_vsv36NCRwCXC71iC8Cce5QPuo4";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`;

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
};

// Function to handle empty prompt error
function showError(message) {
  const errorContainer = document.getElementById("errorContainer");
  const errorMessage = document.getElementById("errorMessage");

  errorMessage.textContent = message;
  errorContainer.classList.remove("hidden");

  // Hide the error message after 3 seconds
  setTimeout(() => {
    errorContainer.classList.add("hidden");
  }, 3000); // Duration to show the error message
}

// Function to clear error message
function clearError() {
  const errorContainer = document.getElementById("errorContainer");
  errorContainer.classList.add("hidden");
}

function getPaddingBottom(aspectRatio) {
  const [width, height] = aspectRatio.split(":").map(Number);
  return `${(height / width) * 100}%`;
}

// Generating Images With Gemini API
async function generateImages() {
  const promptInput = document.getElementById("promptInput").value.trim();
  const aspectRatio = document.getElementById("aspectRatio").value;
  const imageCount = parseInt(document.getElementById("imageCount").value, 10);
  const loader = document.getElementById("loader");
  console.log("CLASSES DO LOADER:", loader.classList);
  const outputContainer = document.getElementById("output");

  // Clear previous error message
  clearError();

  // Error handling for empty prompt
  if (!promptInput) {
    showError("Please enter a prompt.");
    return;
  }

  loader.classList.remove("hidden");
  outputContainer.innerHTML = ""; // Clear previous images
  outputContainer.classList.add("hidden"); // Show output container

  const body = {
    contents: [
      {
        parts: [
          {
            text: `${promptInput}. Please generate image with aspect ratio ${aspectRatio}.`,
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  };

  try {
    for (let i = 0; i < imageCount; i++) {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      const base64Image = data?.candidates?.[0].content?.parts?.find(
        (p) => p.inlineData
      )?.inlineData?.data;

      if (!base64Image) {
        showError("No image data found in the response from API.");
        return;
      }

      // Create a container with selected aspect ratio
      const imageContainer = document.createElement("div");
      imageContainer.className = "image-container";
      imageContainer.style.paddingBottom = getPaddingBottom(aspectRatio); // Set the aspect ratio

      // Create an image element
      const imageElement = document.createElement("img");
      imageElement.src = `data:image/png;base64,${base64Image}`;
      imageElement.alt = "Generated Image";
      imageElement.loading = "lazy"; // Lazy load the image
      imageElement.className = "generated-image"; // Add class for styling

      // Create a download link
      const downloadLink = document.createElement("a");
      downloadLink.href = imageElement.src;
      downloadLink.download = `generated_image_${i + 1}.png`; // Set the download filename
      downloadLink.className = "download-link"; // Add class for styling
      downloadLink.title = "Download Image"; // Link text
      downloadLink.innerHTML = `<i class="ri-arrow-down-line"></i>`; // Font Awesome icon for download

      // Assemble the image container
      imageContainer.appendChild(imageElement);
      imageContainer.appendChild(downloadLink); // Append the download link to the image container
      outputContainer.appendChild(imageContainer);
    }

    outputContainer.classList.remove("hidden"); // Show output container
  } catch (error) {
    console.error("Error:", error);
    showError(
      `An error occurred while generating images. Please try agai. ${error.message}`
    );
  } finally {
    loader.classList.add("hidden");
  }
}
