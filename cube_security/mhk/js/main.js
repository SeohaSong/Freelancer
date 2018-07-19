$(document).ready(() => {

  let win = $(window);
  let main = $('[data-page=main]');
  let pw = $('[data-name=pw]');
  let background = $('[data-name=background]');
  let back_btn = $('[data-name=back-btn]');
  let btn = main.find('*[data-name=btn]');
  let password = $('*[data-password=true]');

  function change_page(i) {
    let pages = ['./index.html', './o.html', './x.html'];
    window.location = pages[i];
  }

  btn.click(() => {
    let password_ = password.text().toLowerCase();
    let pw_ = pw.val().toLowerCase();
    pw.val('');
    if (pw_ != '') {
      if (pw_ == password_) {change_page(1)} else {change_page(2)}
    }
  });

  background.click(() => {pw.focusout()});

  win.keydown((e) => {if (e.keyCode == 13) {btn.click()}});

  back_btn.click(() => {change_page(0)});

});
