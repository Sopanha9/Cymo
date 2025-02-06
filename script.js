// Replace with your Unsplash API key
const UNSPLASH_API_KEY = '2fYRKJFATrZ77wpCGGUGIItIUrlgXpj-KQs6lD0mZ7o';
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const scanBtn = document.getElementById('scanBtn');
const imageGrid = document.getElementById('imageGrid');
const modal = document.getElementById('captureModal');
const closeBtn = document.querySelector('.close');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('captureBtn');
const capturedImage = document.getElementById('capturedImage');

// Event Listeners
searchBtn.addEventListener('click', searchImages);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchImages();
});
scanBtn.addEventListener('click', openCamera);
closeBtn.addEventListener('click', closeModal);
captureBtn.addEventListener('click', captureImage);

// Search Images Function
async function searchImages() {
    const query = searchInput.value.trim();
    if (!query) return;

    try {
        const response = await fetch(`${UNSPLASH_API_URL}?query=${query}&per_page=30`, {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
            }
        });
        const data = await response.json();
        displayImages(data.results);
    } catch (error) {
        console.error('Error fetching images:', error);
        alert('Error fetching images. Please try again.');
    }
}

// Display Images Function
function displayImages(images) {
    imageGrid.innerHTML = '';
    images.forEach(image => {
        const pin = document.createElement('div');
        pin.className = 'pin';
        
        const img = document.createElement('img');
        img.src = image.urls.regular;
        img.alt = image.alt_description || 'Unsplash Image';
        img.loading = 'lazy';
        
        pin.appendChild(img);
        imageGrid.appendChild(pin);
    });
}

// Camera Functions
function openCamera() {
    modal.style.display = 'block';
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error('Error accessing camera:', err);
            alert('Error accessing camera. Please make sure you have granted camera permissions.');
        });
}

function closeModal() {
    modal.style.display = 'none';
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
}

function captureImage() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = canvas.toDataURL('image/png');
    capturedImage.innerHTML = `<img src="${imageData}" alt="Captured image">`;
    
    // Stop the video stream
    video.srcObject.getTracks().forEach(track => track.stop());
    video.style.display = 'none';
    captureBtn.style.display = 'none';
    
    // Here you could add functionality to analyze the captured image
    // For example, using a machine learning model or image recognition API
}

// Close modal when clicking outside
window.onclick = (event) => {
    if (event.target === modal) {
        closeModal();
    }
}

// Initial load with some default images
async function loadDefaultImages() {
    try {
        const response = await fetch(`${UNSPLASH_API_URL}?query=inspiration&per_page=30`, {
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
            }
        });
        const data = await response.json();
        displayImages(data.results);
    } catch (error) {
        console.error('Error fetching default images:', error);
    }
}

// Load default images when the page loads
loadDefaultImages();