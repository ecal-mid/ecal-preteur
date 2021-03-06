
'use strict';

/**
 * Marks an entry as returned.
 * @param  {String}   id       The appengine id of the loan.
 * @param  {Function} callback A function called when the request is complete.
 */
function validate(id, callback) {
  qwest.post('/loans/validate/' + id)
      .then(function(xhr, data) {
        callback();
      })
      .catch(function(e) {
        console.error(e);
      });
}

/**
 * Event handler for click on validate button.
 * @param  {MouseEvent} evt the MouseEvent.
 */
function onValidateBtnClicked(evt) {
  let id = evt.currentTarget.getAttribute('data-id');
  let el = document.getElementById('l' + id);
  validate(id, () => el.remove());
}

/**
 * Setup the loans list.
 * @param {Array.<Object>} users The json list of users.
 */
function setupLoansList(users) {
  let usersPerEmail = {};
  for (let loaner of users) {
    usersPerEmail[loaner.email] = loaner;
  }
  // setup autocomplete list
  let listEls = document.querySelectorAll('ul.loans-list li');
  let template = document.getElementById('loan-meta-tpl').innerHTML;
  for (let li of listEls) {
    let container = li.querySelector('.meta');
    let loaner = usersPerEmail[li.dataset['loaner']];
    let loan = {
      id: li.id.substring(1),
      dateIn: li.dataset['datein'],
    };
    let output = ejs.render(template, {loaner: loaner, loan: loan});
    container.innerHTML = output;
    let btn = container.querySelector('.validate');
    btn.addEventListener('click', onValidateBtnClicked);
  }
}

/**
 * Filter loans.
 * @param {String} user The user to filter.
 */
function filterLoans(user) {
  let listEls = document.querySelectorAll('ul.loans-list li');
  for (let li of listEls) {
    if (li.dataset['loaner'] != user) {
      li.style.display = 'none';
    }
  }
}

/**
 * Clear loans filter.
 */
function clearLoansFilter() {
  let listEls = document.querySelectorAll('ul.loans-list li');
  for (let li of listEls) {
    li.style.display = null;
  }
}

// Request the students file upon loading.
qwest.get('/static/data/' + year + '/students.json')
    .then(function(xhr, data) {
      setupLoansList(data);
    })
    .catch(function(e) {
      console.error(e);
    });
