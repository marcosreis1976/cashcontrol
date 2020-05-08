const $ = document.querySelector.bind(document);

function toggleMenu() {
  $('.container-navigation').classList.toggle('open');
  $('#hamburger').classList.toggle('open');
}

$('#hamburger').onclick = toggleMenu;

console.log('teste');