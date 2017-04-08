'use strict';

if (window.location.href.indexOf('localhost') == 1 &&
    window.location.protocol != 'https:') {
  window.location.href =
      'https:' +
      window.location.href.substring(window.location.protocol.length);
}

let mainContainer = document.querySelector('main');
let sendBtn = document.querySelector('.send');
let iframe = document.querySelector('iframe.loans');
sendBtn.addEventListener('click', onSendClicked);

function resizeIframe() {
  if (!iframe.contentWindow) {
    return;
  }
  iframe.style.height =
      iframe.contentWindow.document.body.scrollHeight + 200 + 'px';
}

function onEntrySaved(xhr, data) {
  closeLive();
  resetFinder();
  mainContainer.classList.remove('deactivated');
  iframe.src = iframe.src;
}

function onSendClicked(evt) {
  if (!currLoaner || !imageData) {
    return;
  }

  mainContainer.classList.add('deactivated');

  qwest.post('/loans', {loaner : currLoaner, image : imageData})
      .then(onEntrySaved)
      .catch(function(e) { console.error(e); });
}

function update() {
  if (currLoaner && imageData) {
    sendBtn.classList.remove('disable');
  } else {
    sendBtn.classList.add('disable');
  }
}

document.addEventListener('resize', setTimeout(resizeIframe, 1000));

setupCamera();
