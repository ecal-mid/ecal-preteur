'use strict';

let mainContainer;
let sendBtn;
let currentGeneric;
let genericContainer;
let iframe;
let item;
let loaner;

/**
 * Set current item that's being loan. Either an image data raw buffer or the id
 * of a generic item. The id of generic item must be a string starting with 'g-'
 * @param {string} itemData The item data.
 */
function setItem(itemData) {
  item = itemData;
  update();
}

/**
 * Helper to resize the loans list iframe.
 */
// function resizeIframe() {
//   if (!iframe.contentWindow) {
//     return;
//   }
//   iframe.style.height =
//       iframe.contentWindow.document.body.scrollHeight + 200 + 'px';
// }

/**
 * Callback for success of new entry.
 * @param  {XMLHttpRequest} xhr  The request object.
 * @param  {Object} data Response data.
 */
function onEntrySaved(xhr, data) {
  if (isCameraShowing()) {
    closeCamera();
  }
  clearGeneric();
  resetFinder();
  mainContainer.classList.remove('deactivated');
  window.location.href = window.location.href;
  // iframe.src = iframe.src;
}

/**
 * Event handler for click on Send button.
 * @param  {MouseEvent} evt The MouseEvent object.
 */
function onSendClicked(evt) {
  if (!loaner || !item) {
    throw new Error('loaner or item has not been set');
  }

  mainContainer.classList.add('deactivated');

  qwest.post('/loans', {loaner: loaner, item: item})
      .then(onEntrySaved)
      .catch(function(e) {
        console.error(e);
      });
}

/**
 * Hides the generic items buttons.
 */
function hideGeneric() {
  clearGeneric();
  genericContainer.style.display = 'none';
  setItem(null);
}

/**
 * Shows the generic items buttons.
 */
function showGeneric() {
  genericContainer.style.display = '';
}

/**
 * Clears current selection of generic items button.
 */
function clearGeneric() {
  if (currentGeneric) {
    currentGeneric.classList.remove('selected');
  }
}

/**
 * Handler for click on a generic item button.
 * @param  {MouseEvent} evt The MouseEvent object.
 */
function onGenericBtnClicked(evt) {
  clearGeneric();
  currentGeneric = evt.currentTarget;
  currentGeneric.classList.add('selected');
  setItem(currentGeneric.dataset['id']);
}

/**
 * Setup the generic items buttons.
 */
function setupGeneric() {
  let btns = genericContainer.querySelectorAll('.btn');
  for (let btn of btns) {
    btn.addEventListener('click', onGenericBtnClicked);
  }
}

/**
 * Update the validity to send the current selection and show send button
 * accordingly.
 */
function update() {
  if (loaner && item) {
    sendBtn.style.display = '';
  } else {
    sendBtn.style.display = 'none';
  }
}


/**
 * Setup the application.
 */
function setup() {
  mainContainer = document.querySelector('main');
  sendBtn = document.querySelector('.send');
  iframe = document.querySelector('iframe.loans');
  genericContainer = document.querySelector('.generic');
  sendBtn.addEventListener('click', onSendClicked);
  // document.addEventListener('resize', setTimeout(resizeIframe, 1000));
  setupCamera();
  setupGeneric();
}

setup();
