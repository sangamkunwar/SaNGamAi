const generateForm = document.querySelector(".generate-form");
const generateBtn = generateForm.querySelector(".generate-btn");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "YOUR-OPENAI-API-KEY-HERE"; // Your OpenAI API key here
let isImageGenerating = false;

const updateImageCard = (imgDataArray) => {
  imgDataArray.forEach((imgObject, index) => {
    const imgCard = imageGallery.querySelectorAll(".img-card")[index];
    const imgElement = imgCard.querySelector("img");
    const downloadBtn = imgCard.querySelector(".download-btn");
    
    // Set the image source to the AI-generated image data
    const aiGeneratedImage = `data:image/jpeg;base64,${imgObject.b64_json}`;
    imgElement.src = aiGeneratedImage;
    
    // When the image is loaded, remove the loading class and set download attributes
    imgElement.onload = () => {
      imgCard.classList.remove("loading");
      downloadBtn.setAttribute("href", aiGeneratedImage);
      downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
    }
  });
}

const generateAiImages = async (userPrompt, userImgQuantity) => {
  try {
    // Send a request to the OpenAI API to generate images based on user inputs
    const response = await fetch("https://api.openai.com/v1/files", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: userPrompt,
        n: userImgQuantity,
        size: "512x512",
        response_format: "b64_json"
      }),
    });

    // Throw an error message if the API response is unsuccessful
    if(!response.ok) throw new Error("Failed to generate AI images. Make sure your API key is valid.");

    const { data } = await response.json(); // Get data from the response
    updateImageCard([...data]);
  } catch (error) {
    alert(error.message);
  } finally {
    generateBtn.removeAttribute("disabled");
    generateBtn.innerText = "Generate";
    isImageGenerating = false;
  }
}

const handleImageGeneration = (e) => {
  e.preventDefault();
  if(isImageGenerating) return;

  // Get user input and image quantity values
  const userPrompt = e.srcElement[0].value;
  const userImgQuantity = parseInt(e.srcElement[1].value);
  
  // Disable the generate button, update its text, and set the flag
  generateBtn.setAttribute("disabled", true);
  generateBtn.innerText = "Generating";
  isImageGenerating = true;
  
  // Creating HTML markup for image cards with loading state
  const imgCardMarkup = Array.from({ length: userImgQuantity }, () => 
      `<div class="img-card loading">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAb1BMVEX///8rKj0mJTlKSVcAACIgHzUAACUkIzjT09UDACYAAB3p6eoQDivExMfY2Nr6+vrw8PE6OUmYmJ4VFC5YWGMAABbe3uB8fIS3t7tFRFK9vcA0M0SLipEZFy+TkpdTUl6rq7BhYWxubXehoaYNCyUMWP+BAAAEWElEQVRoge1a6bajIAwuFHeUulRrN1t73/8ZB6uoLC7x3s6Zc+Z+/6rwGUISktDdbj1YkmUJA0yA4JJinMaf4X5RxEFfHyHf44Yc7/918ihaS66PXEB48bzYXUPuxp53CSHc+ZETYZIvk+d+M/Ioj5xHYTU8TrZMnjnNQ6sGkJdvHkSk5ZrIQ/IeiEsAeW0Z5pjIOylAkodvf1E8xkCeiHGgHW1VyWcd5sgPaTtK2ZwlBHY77VbMkbf7jpAdgMh311s3b/AQjTzyOgmuMO7dodPLaKs0cqE752BimMOpUww5T5GfWzNE3gnKzaN3a2X4Ih48LXkpYgDExgXczsxSYY6u3/z0RcS5d7viuVMMc3g6imQn4nmk18EW/xkQCJ0OhhYOziKMla7Yzbwoa3V997RVuvFMZq3K6V157tZlocTI8Ghhy85kZ2Co2UIvMYuTNFZuxfKXg8zmREcpGnRiWCSRFhnEPtFEGxZGib+XxDlcbUu2sAbC11CKZaN1wxmVslBe/wl3BoTo+EVPzp2m2mRaXI6K9CSedKzGuH/h0BoYhxoENXV6CixnTiGx+leN6oFJG7vL85XwnmdkEB7RGCR8ENNhLiaZflyf43T0cVDqsx+JTcuzcUxCh0E+IFnI/UEoOuEV3E4LW+yKqrY5hMJMHLuYCwZRZePVIaOXqdU4thet+MwdCWFv0i9NuHt8yg2Zla0Mjf14UnNmJHzKSnFYAK5NNkz5xS9UvKr9GDW0fuoQ1RJN1aQ7LKYOHsPyN6Rn/IzzLYnGofzsfo1CsQhaW8iJRsMrhwxrT21QndAitDUanO2qHyL3dPJql6Ta0x9SS5rwfCjFn9hQnDZpIEskE9JTxpXgSaJE9LG2zy/+I2zJcleOe5W0fMCoH3zKmpZgeGmSIgJKXBKeIXOPXApJed1l0ikgnWNteMKknsteWdHnuT4gCPSJqEWvkz7/cm59SIOQR0MKfXPMqnfL0ZlkgfrBpZT862IFT390aqQIVrag0aGA/acyOf8afdzxr8D2DLv644LrS97YeFTnUfXLq4SvvVG1KSk1H9RN0dbD4jIiMVbQ6m4HwYyCDoG8xIclrE2qoBl6r8khcsEUVP4xnfTVJD0elcZCQd7qxUgy96Yl4tBMzuRY3OwSeZi5HwTpLZEo4/mb0hJ5H69PtWBqm6l4wuRjczPn/Fx1xHcVICLmNhTR3kIgWtH9yk+UECqSGhZ/p4HmimaqWHgbQnyxL6/OK+0tpluJZqq8Eucpfov3FZz71OmUPsQTtd3aN2TB6R/Dmlxao1isDUMTN5H8jpqpeou7E33az8wQ/c6xLUw354Hm+OymLVwrdJ5gga4VXNOCTRciW8xR858J8k2eJC6hpGhjuic6b7iEanfKWnN91o4sduvhQi/+QCEgRLaHlKg8cWWJPFsduQTmRqrfTVy2ssj9gdLqb9xBb7m5WUbrMdBAshbvPxWYr0e+j0NSVQkk0fsDpn40o1BX9pQAAAAASUVORK5CYII=" alt="AI generated image">
        <a class="download-btn" href="">
          <img src="images/download.svg" alt="download icon">
        </a>
      </div>`
  ).join("");

  imageGallery.innerHTML = imgCardMarkup;
  generateAiImages(userPrompt, userImgQuantity);
}

generateForm.addEventListener("submit", handleImageGeneration);