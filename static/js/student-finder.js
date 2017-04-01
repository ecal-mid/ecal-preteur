'use strict';

let students = null;
let template = document.getElementById('user-card-tpl').innerHTML;
let inputEl = document.querySelector('input.student-input');
let studentImg = document.querySelector('.student-finder img');
let clearBtn = document.querySelector('.clear-img');
let listEl;
let currLoaner;

qwest.get('/static/data/students.json')
    .then(function(xhr, data) {
      students = data;
      setupFinder();
    })
    .catch(function(e) { console.error(e); });

function onLiClicked(evt) {
  const name = evt.currentTarget.dataset['name'];
  const email = evt.currentTarget.dataset['email'];
  studentImg.src = evt.currentTarget.querySelector('img').src;
  inputEl.value = name;
  clearBtn.style.opacity = 1;
  hideList();
  currLoaner = email;
  update();
}

function resetFinder() {
  currLoaner = null;
  studentImg.src = '/static/res/user.svg';
  inputEl.value = '';
  clearBtn.style.opacity = 0;
  update();
}

function onInputFocus() {
  resetFinder();
  showList();
}

function onInputBlur() { hideList(); }

function onInputChange() {
  const val = inputEl.value;
  filterList(val);
}

function showList() {
  listEl.style.display = "block";
  filterList(inputEl.value);
}

function hideList() { listEl.style.display = "none"; }

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

function setupFinder() {
  // setup autocomplete list
  listEl = document.querySelector('ul.student-list');

  clearBtn.addEventListener('click', resetFinder);
  // setup input text
  inputEl.addEventListener('focus', onInputFocus);
  inputEl.addEventListener('blur', onInputBlur);
  inputEl.addEventListener('input', onInputChange);
}
