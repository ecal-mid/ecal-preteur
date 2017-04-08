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

navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

/**
 *  show video feed
 */
function showLive() {
  if (video.parentNode) {
    return;
  }
  video.play();
  cameraEl.appendChild(video);
  if (preview.parentNode) {
    cameraEl.removeChild(preview);
  }
  liveViewBtn.style.display = 'none';
  takePhotoBtn.style.display = 'block';
  update();
}

/**
 *  generates a still frame image from the stream in the <video>
 */
function takeSnapshot() {
  if (preview.parentNode) {
    return;
  }
  const width = video.offsetWidth;
  const height = video.offsetHeight;
  canvas = canvas || document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, width, height);

  preview.src = canvas.toDataURL('image/png');

  cameraEl.appendChild(preview);
  cameraEl.removeChild(video);

  liveViewBtn.style.display = 'block';
  takePhotoBtn.style.display = 'none';

  setItem(preview.src);
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
        showLive();
      },
      function(error) {
        document.body.textContent =
            'Could not access the camera. Error: ' + error.name;
      });
  // hide generic buttons
  hideGeneric();
}

function closeCamera() {
  // get back to live mode if current snapshot
  if (!video.parentNode) {
    showLive();
  }
  // stop video stream
  currentStream.getTracks()[0].stop();
  // hide video container and show photo button
  startPhotoBtn.style.display = '';
  photoContainer.style.display = 'none';
  // clear current item
  setItem(null);
  // show generic buttons
  showGeneric();
}

/**
* Setup camera module
*/
function isCameraShowing() { return photoContainer.style.display != 'none'; }

/**
* Setup camera module
*/
function setupCamera() {
  photoContainer = document.querySelector('.photo');

  startPhotoBtn = document.querySelector('.start-photo');
  startPhotoBtn.addEventListener('click', startLive);

  stopCameraBtn = document.querySelector('.stop-camera');
  stopCameraBtn.addEventListener('click', closeCamera);

  takePhotoBtn = document.querySelector('.take-photo');
  takePhotoBtn.addEventListener('click', takeSnapshot);
  takePhotoBtn.style.display = 'none';

  liveViewBtn = document.querySelector('.live-view');
  liveViewBtn.addEventListener('click', showLive);
  liveViewBtn.style.display = 'none';

  cameraEl = document.querySelector('.camera');
  video = document.querySelector('video');
  preview = document.createElement('img');

  cameraEl.removeChild(video);
}
