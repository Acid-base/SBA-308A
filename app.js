import { fetchImageData } from './api.js';
import { createGalleryItem, createDockerCommands } from './utils.js';

const imageNameInput = document.getElementById('imageName');
const getImageBtn = document.getElementById('getImageBtn');
const galleryContainer = document.getElementById('gallery');
const dockerCommandsContainer = document.getElementById('dockerCommands');
const errorContainer = document.getElementById('error');

const clearContainers = () => {
  galleryContainer.innerHTML = '';
  dockerCommandsContainer.innerHTML = '';
  errorContainer.innerHTML = '';
};

getImageBtn.addEventListener('click', async () => {
  const imageName = imageNameInput.value;

  try {
    clearContainers();
    const imageData = await fetchImageData(imageName);

    const galleryItem = createGalleryItem(imageData);
    galleryContainer.appendChild(galleryItem);

    const dockerCommands = createDockerCommands(imageData);
    dockerCommandsContainer.appendChild(dockerCommands);
  } catch (error) {
    errorContainer.innerHTML = `<p class="has-text-danger">${error.message}</p>`;
  }
});