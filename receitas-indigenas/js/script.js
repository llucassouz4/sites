// Countdown sincronizado (ambos contadores)
(function () {
  var els = [document.getElementById('countdown'), document.getElementById('countdown2')];
  var total = 10 * 60 - 1;

  function fmt(n) { return (n < 10 ? '0' : '') + n; }

  var t = setInterval(function () {
    if (total <= 0) { clearInterval(t); els.forEach(function(e){ if(e) e.textContent = '00:00'; }); return; }
    total--;
    var str = fmt(Math.floor(total / 60)) + ':' + fmt(total % 60);
    els.forEach(function(e){ if(e) e.textContent = str; });
  }, 1000);
})();

// Oculta sticky quando o bloco #comprar estiver visível
(function () {
  var bar = document.getElementById('sticky-bar');
  var target = document.getElementById('comprar');
  if (!bar || !target || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(function (entries) {
    bar.style.display = entries[0].isIntersecting ? 'none' : '';
  }, { threshold: 0.3 }).observe(target);
})();
