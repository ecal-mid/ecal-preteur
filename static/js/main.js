'use strict';

let sendBtn = document.querySelector('.send');
sendBtn.addEventListener('click', onSendClicked);

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

setupCamera();
