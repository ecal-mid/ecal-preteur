'use strict';

let students = null;
let template = document.getElementById('user-card-tpl').innerHTML;
let inputEl = document.querySelector('input.student-input');
let studentImg = document.querySelector('.student-finder img');
let clearBtn = document.querySelector('.clear-img');
let listEl;

/**
 * Event handler for click on list item
 * @param  {MouseEvent} evt The MouseEvent object.
 */
function onLiClicked(evt) {
  const name = evt.currentTarget.dataset['name'];
  const email = evt.currentTarget.dataset['email'];
  const img = evt.currentTarget.querySelector('img');
  if (studentImg && img) {
    studentImg.src = img.src;
  }
  inputEl.value = name;
  clearBtn.style.opacity = 1;
  hideList();
  loaner = email;
  filterLoans(loaner);
  update();
}

/**
 * Resets the the current selected user.
 */
function resetFinder() {
  loaner = null;
  studentImg.src = '/static/res/user.svg';
  inputEl.value = '';
  clearBtn.style.opacity = 0;
  clearLoansFilter();
  update();
}

/**
 * Event Handler for focus on input item.
 * @param  {Event} evt The Event object.
 */
function onInputFocus(evt) {
  resetFinder();
  showList();
}

/**
 * Event Handler for blur of input item.
 * @param  {Event} evt The Event object.
 */
function onInputBlur(evt) {
  hideList();
}

/**
 * Event Handler for change of input value.
 * @param  {Event} evt The Event object.
 */
function onInputChange(evt) {
  const val = inputEl.value;
  filterList(val);
}

/**
 * Shows the list of filtered users according to current input.
 */
function showList() {
  listEl.style.display = 'block';
  filterList(inputEl.value);
}

/**
 * Shows the list of filtered users.
 */
function hideList() {
  listEl.style.display = 'none';
}

/**
 * Performs filtering of the list according to current input.
 * @param {String} text Part of the name text to filter users with.
 */
function filterList(text) {
  text = text.toLowerCase();
  let i = 0;
  while (listEl.hasChildNodes()) {
    listEl.removeChild(listEl.lastChild);
  }

  for (let st of students) {
    const name = st.name.toLowerCase();
    if (i < 5 && name.indexOf(text) != -1) {
      let output = ejs.render(template, st);
      let li = document.createElement('li');
      li.classList.add('user');
      li.addEventListener('mousedown', onLiClicked, false);
      li.innerHTML = output;
      li.dataset['email'] = st.email;
      li.dataset['name'] = st.name;
      listEl.appendChild(li);
      i++;
    }
  }
}

/**
 * Setup the user finder input item.
 */
function setupFinder() {
  // setup autocomplete list
  listEl = document.querySelector('ul.student-list');

  clearBtn.addEventListener('click', resetFinder);
  // setup input text
  inputEl.addEventListener('focus', onInputFocus);
  inputEl.addEventListener('blur', onInputBlur);
  inputEl.addEventListener('input', onInputChange);
}

// request the users list then setup the finder.
qwest.get('/static/data/students.json')
    .then(function(xhr, data) {
      students = data;
      setupFinder();
    })
    .catch(function(e) {
      console.error(e);
    });
