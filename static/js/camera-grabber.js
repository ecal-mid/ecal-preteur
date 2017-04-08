'use strict';

let photoContainer;
let stopCameraBtn;
let startPhotoBtn;
let takePhotoBtn;
let liveViewBtn;
let cameraEl;
let currentStream;
let video;
let preview;
let canvas;
let imageData;

navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

/**
 *  show video feed
 */
function showLive() {
  if (!preview.parentNode) {
    return;
  }
  video.play();
  cameraEl.appendChild(video);
  cameraEl.removeChild(preview);
  liveViewBtn.style.display = 'none';
  takePhotoBtn.style.display = 'block';
  imageData = null;
  update();
}

/**
 *  generates a still frame image from the stream in the <video>
 */
function takeSnapshot() {
  if (!video.parentNode) {
    return;
  }
  const width = video.offsetWidth;
  const height = video.offsetHeight;
  canvas = canvas || document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, width, height);

  preview = preview || document.createElement('img');
  preview.src = canvas.toDataURL('image/png');

  cameraEl.appendChild(preview);
  cameraEl.removeChild(video);

  liveViewBtn.style.display = 'block';
  takePhotoBtn.style.display = 'none';

  imageData = preview.src;
  update();
}

/**
* Start live view from device camera
*/
function startLive() {
  startPhotoBtn.style.display = 'none';
  photoContainer.style.display = '';
  // access the web cam
  navigator.getUserMedia.call(
      navigator, {video : {facingMode : {exact : "environment"}}},
      function(stream) {
        currentStream = stream;
        if (window.URL) {
          video.srcObject = stream;
        } else {
          video.src = stream;
        }
        takePhotoBtn.style.display = 'block';
      },
      function(error) {
        document.body.textContent =
            'Could not access the camera. Error: ' + error.name;
      });
}

function closeLive() {
  // get back to live mode if current snapshot
  if (!video.parentNode) {
    showLive();
  }
  // stop video stream
  currentStream.getTracks()[0].stop();
  // hide video container and show photo button
  startPhotoBtn.style.display = '';
  photoContainer.style.display = 'none';
}

/**
* Setup camera module
*/
function setupCamera() {
  photoContainer = document.querySelector('.photo');

  startPhotoBtn = document.querySelector('.start-photo');
  startPhotoBtn.addEventListener('click', startLive);

  stopCameraBtn = document.querySelector('.stop-camera');
  stopCameraBtn.addEventListener('click', closeLive);

  takePhotoBtn = document.querySelector('.take-photo');
  takePhotoBtn.addEventListener('click', takeSnapshot);
  takePhotoBtn.style.display = 'none';

  liveViewBtn = document.querySelector('.live-view');
  liveViewBtn.addEventListener('click', showLive);
  liveViewBtn.style.display = 'none';

  cameraEl = document.querySelector('.camera');
  video = document.querySelector('video');
}
