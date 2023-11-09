// Select elements
const imageBox = document.querySelector('.image-box');
const image = document.querySelector('.image');
const imageClear = document.querySelector('.image-clear');
const uploadButton = document.querySelector('.upload-button');
const browse = document.querySelector('.browse');
const imageInput =  document.querySelector('.image-input');
const progressBox = document.querySelector('.progress-box');
const progress = document.querySelector('.progress');
const progressPercentage = document.querySelector('.progress-percentage');
const alertBox = document.querySelector('.alert-box');
const alertMesssage = document.querySelector('.alert-message');
const alertImage = document.querySelector('.alert-image');
const alertClose = document.querySelector('.alert-close');

// Functions
function showAlert(success, message) {
    alertBox.style.display = 'flex';
    alertMesssage.innerHTML = message
    alertImage.src = success ? 'images/success.png' : 'images/error.png'
    alertBox.style.borderColor = success ? '#ebf3fb' : '#f8cfc9'
    alertBox.style.color = success ? '#9fb9d7' : '#eb9486'
}

function showImage(file) {
    if (file.type != 'image/jpeg' && file.type != 'image/png') {
        showAlert(false, 'Please select a .png, .jpg, .jpeg file.');

        return
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = function() {
        image.style.backgroundImage = `url("${reader.result}")`

        imageClear.style.display = 'block';
        uploadButton.disabled = false;
    }
};

function clearImage() {
    imageInput.value = '';
    imageClear.style.display = 'none';
    image.style.backgroundImage = 'url(images/image.png)';
    uploadButton.disabled = true;
}

function clearProgress() {
    progressBox.style.display = 'none'; 
    progress.style.width = '0%';
    progressPercentage.textContent = 0; 
}

// Listeners
imageBox.addEventListener('dragover', (e) => {
    e.preventDefault();

    imageBox.style.background = '#d3e2f3';
    imageBox.style.borderColor = '#3c8be2';
});

imageBox.addEventListener('dragleave', () => {
    imageBox.style.background = null;
    imageBox.style.borderColor = '#c0d5e7'; 
});

imageBox.addEventListener('drop', (e) => {
    e.preventDefault();

    imageBox.style.background = null;
    imageBox.style.borderColor = '#c0d5e7';

    imageInput.files = e.dataTransfer.files;
    imageInput.dispatchEvent(new Event('change'));
});

imageClear.addEventListener('click', () => {
    clearImage();
});

browse.addEventListener('click', (e) => {
    e.preventDefault();
    imageInput.click();
});

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];

    showImage(file);
});

alertClose.addEventListener('click', () => {
    alertBox.style.display = 'none';
});

uploadButton.addEventListener('click', () => {
    uploadButton.disabled = true;
    progressBox.style.display = 'flex'; 
    
    const file = imageInput.files[0];

    const data = new FormData();
    data.append('image', file);

    const request = new XMLHttpRequest();
    request.responseType = 'json';

    request.upload.addEventListener('progress', (e) => {
        const percent = (e.loaded / e.total) * 100;
        progress.style.width = `${percent}%`;
        progressPercentage.textContent = Math.floor(percent);
    });

    request.addEventListener('load', (e) => {    
        clearImage();
        clearProgress();

        console.log(request)

        showAlert(
            request.response ? request.response.success : false, 
            request.response ? request.response.message : `Error: ${request.status} - ${request.statusText}`);
    })

    request.open('POST', '/upload');
    request.send(data);
});