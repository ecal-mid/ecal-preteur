'use strict';

let takePhotoBtn = document.querySelector('.take-photo');
takePhotoBtn.style.display = 'none';
let liveViewBtn = document.querySelector('.live-view');
liveViewBtn.style.display = 'none';

let cameraEl = document.querySelector('.camera');
let video = document.querySelector('video');
let preview;
let canvas;

let imageData = null;

var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                   navigator.mozGetUserMedia;

/**
 *  show video
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
  // access the web cam
  getUserMedia.call(navigator, {video : {facingMode : {exact : "environment"}}},
                    function(stream) {
                      if (window.webkitURL) {
                        video.src = window.webkitURL.createObjectURL(stream);
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

function setupCamera() {
  startLive();
  takePhotoBtn.addEventListener('click', takeSnapshot);
  liveViewBtn.addEventListener('click', showLive);
}
