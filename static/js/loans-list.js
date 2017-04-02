var loaners;
let template = document.getElementById('loan-meta-tpl').innerHTML;

qwest.get('/static/data/students.json')
    .then(function(xhr, data) {
      loaners = data;
      setup();
    })
    .catch(function(e) { console.error(e); });

function validate(id, callback) {
  qwest.post('/loans/validate/' + id)
      .then(function(xhr, data) { callback() })
      .catch(function(e) { console.error(e); });
}

function onValidateBtnClicked(evt) {
  let id = evt.currentTarget.dataset['id'];
  let el = document.getElementById('l' + id);
  validate(id, () => el.remove());
}

function setup() {
  let loanersPerEmail = {};
  for (let loaner of loaners) {
    loanersPerEmail[loaner.email] = loaner;
  }
  // setup autocomplete list
  listEls = document.querySelectorAll('ul.loans-list li');
  for (let li of listEls) {
    let container = li.querySelector('.meta');
    let loaner = loanersPerEmail[li.dataset['loaner']];
    let loan = {
      id : li.id.substring(1),
      dateIn : li.dataset['datein'],
    };
    let output = ejs.render(template, {loaner : loaner, loan : loan});
    container.innerHTML = output;
    let btn = container.querySelector('.validate');
    btn.addEventListener('click', onValidateBtnClicked);
  }
}
