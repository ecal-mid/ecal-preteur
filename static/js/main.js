'use strict';

let mainContainer;
let sendBtn;
let currentGeneric;
let genericContainer;
let iframe;
let item;

function setItem(itemData) {
  item = itemData;
  update();
}

function resizeIframe() {
  if (!iframe.contentWindow) {
    return;
  }
  iframe.style.height =
      iframe.contentWindow.document.body.scrollHeight + 200 + 'px';
}

function onEntrySaved(xhr, data) {
  if (isCameraShowing()) {
    closeCamera();
  }
  clearGeneric();
  resetFinder();
  mainContainer.classList.remove('deactivated');
  iframe.src = iframe.src;
}

function onSendClicked(evt) {
  if (!loaner || !item) {
    throw 'loaner or item has not been set';
  }

  mainContainer.classList.add('deactivated');

  qwest.post('/loans', {loaner : loaner, item : item})
      .then(onEntrySaved)
      .catch(function(e) { console.error(e); });
}

function hideGeneric() {
  clearGeneric();
  genericContainer.style.display = 'none';
  setItem(null);
}

function showGeneric() { genericContainer.style.display = ''; }

function clearGeneric() {
  if (currentGeneric) {
    currentGeneric.classList.remove('selected');
  }
}

function onGenericBtnClicked(ev) {
  clearGeneric();
  currentGeneric = ev.currentTarget;
  currentGeneric.classList.add('selected');
  setItem(currentGeneric.dataset['id']);
}

function setupGeneric() {
  let btns = genericContainer.querySelectorAll('.btn');
  for (let btn of btns) {
    btn.addEventListener('click', onGenericBtnClicked);
  }
}

function update() {
  if (loaner && item) {
    sendBtn.style.display = '';
  } else {
    sendBtn.style.display = 'none';
  }
}

function setup() {
  mainContainer = document.querySelector('main');
  sendBtn = document.querySelector('.send');
  iframe = document.querySelector('iframe.loans');
  genericContainer = document.querySelector('.generic');
  sendBtn.addEventListener('click', onSendClicked);
  document.addEventListener('resize', setTimeout(resizeIframe, 1000));
  setupCamera();
  setupGeneric();
}

setup();
