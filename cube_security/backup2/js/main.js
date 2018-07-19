$(document).ready(() => {
  let main = $('*[data-page=main]');
  let pw = main.find('*[data-name=pw]');


  function change_page(i) {
    let pages = ['./index.html', './o.html', './x.html'];
    window.location = pages[i];
  }


  let btn = main.find('*[data-name=btn]');

  let password = $('*[data-password=true]');

  let back_btns = [
    $('*[data-page=o]').find('*[data-name=btn]'),
    $('*[data-page=x]').find('*[data-name=btn]'),
  ];


  pw.focus()

  btn.click(() => {
    let password_ = password.text();
    let pw_ = pw.val();
    pw.val('');
    if (pw_ != '') {
      if (pw_ == password_) {change_page(1);} else {change_page(2);}
    }
  });

  pw.keypress((e) => {if (e.keyCode == 13) {btn.click();}});

  $.each(back_btns, (i, v) => {v.click(() => {change_page(0);});});

  $(window).keydown((e) => {
    if (e.keyCode == 8) {if (password.length == 0) {change_page(0);}}
  });
});
