'use strict';

let sendBtn = document.querySelector('.send');
let iframe = document.querySelector('iframe.loans');
sendBtn.addEventListener('click', onSendClicked);

function resizeIframe() {
  iframe.style.height =
      iframe.contentWindow.document.body.scrollHeight + 200 + 'px';
}

function onSendClicked(evt) {
  if (!currLoaner || !imageData) {
    return;
  }

  let main = document.querySelector('main');
  main.classList.add('deactivated');

  qwest.post('/loans', {loaner : currLoaner, image : imageData})
      .then(function(xhr, data) {
        showLive();
        resetFinder();
        main.classList.remove('deactivated');
        iframe.src = iframe.src;
      })
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
