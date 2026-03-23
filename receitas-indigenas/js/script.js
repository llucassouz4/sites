(function () {
  var bar = document.getElementById('sticky-bar');
  if (!bar) return;

  // Seleciona todos os botões de compra, excluindo o próprio flutuante
  var btns = Array.prototype.slice.call(document.querySelectorAll('.btn-main'));
  if (!btns.length) return;

  var visible = new Set();

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        visible.add(entry.target);
      } else {
        visible.delete(entry.target);
      }
    });
    if (visible.size > 0) {
      bar.classList.add('hidden');
    } else {
      bar.classList.remove('hidden');
    }
  }, { threshold: 0.1 });

  btns.forEach(function (btn) { observer.observe(btn); });
})();
