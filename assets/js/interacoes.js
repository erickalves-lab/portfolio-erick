(function () {
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var temMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Aspas da abertura seguem o mouse de leve ---------- */
  var abertura = document.querySelector(".abertura");
  var arte = document.querySelector(".abertura-arte");
  if (abertura && arte && temMouse && !reduz) {
    abertura.addEventListener("pointermove", function (e) {
      var r = abertura.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      arte.style.setProperty("--px", (-x * 38).toFixed(1));
      arte.style.setProperty("--py", (-y * 26).toFixed(1));
    });
    abertura.addEventListener("pointerleave", function () {
      arte.style.setProperty("--px", 0);
      arte.style.setProperty("--py", 0);
    });
  }

  /* ---------- Etiqueta que acompanha o cursor nos projetos ---------- */
  var chip = document.querySelector(".cursor-chip");
  if (chip && temMouse) {
    document.addEventListener("pointermove", function (e) {
      var sobre = e.target.closest && e.target.closest(".proj");
      if (sobre) {
        chip.classList.add("on");
        chip.style.transform = "translate(" + (e.clientX + 18) + "px," + (e.clientY + 18) + "px) scale(1)";
      } else {
        chip.classList.remove("on");
      }
    });
    document.addEventListener("pointerleave", function () { chip.classList.remove("on"); });
  }

  /* ---------- Rastro de giz no bloco escuro ---------- */
  document.querySelectorAll(".fecho").forEach(function (secao) {
    var cv = secao.querySelector(".giz");
    if (!cv || !temMouse || reduz) return;
    var ctx = cv.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var ultimo = null, ativo = false, parar = 0;

    function medir() {
      var r = secao.getBoundingClientRect();
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    medir();
    window.addEventListener("resize", medir);

    function ciclo() {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.035)";
      ctx.fillRect(0, 0, cv.width / dpr, cv.height / dpr);
      ctx.globalCompositeOperation = "source-over";
      if (performance.now() < parar) requestAnimationFrame(ciclo);
      else { ativo = false; ctx.clearRect(0, 0, cv.width / dpr, cv.height / dpr); }
    }

    secao.addEventListener("pointermove", function (e) {
      var r = secao.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      if (ultimo) {
        ctx.strokeStyle = "rgba(242,241,237,0.55)";
        ctx.lineCap = "round";
        ctx.lineWidth = 1.2 + Math.random() * 1.6;
        ctx.beginPath();
        ctx.moveTo(ultimo.x + (Math.random() - .5) * 1.5, ultimo.y + (Math.random() - .5) * 1.5);
        ctx.lineTo(x, y);
        ctx.stroke();
        for (var i = 0; i < 2; i++) {
          ctx.fillStyle = "rgba(242,241,237,0.35)";
          ctx.fillRect(x + (Math.random() - .5) * 9, y + (Math.random() - .5) * 9, 1.2, 1.2);
        }
      }
      ultimo = { x: x, y: y };
      parar = performance.now() + 2800;
      if (!ativo) { ativo = true; requestAnimationFrame(ciclo); }
    });
    secao.addEventListener("pointerleave", function () { ultimo = null; });
  });

  /* ---------- Filtro de projetos ---------- */
  var grade = document.getElementById("grade-projetos");
  if (grade) {
    var itens = Array.prototype.slice.call(grade.children);
    var botoes = Array.prototype.slice.call(document.querySelectorAll(".filtro"));
    var conta = document.getElementById("filtro-conta");

    function contar() {
      var n = itens.filter(function (li) { return !li.hidden; }).length;
      // durante a transição, conta pelo que vai ficar
      return n;
    }
    function aplicar(f) {
      var ficam = 0;
      itens.forEach(function (li) {
        var cats = (li.getAttribute("data-cat") || "").split(" ");
        var ok = f === "todos" || cats.indexOf(f) > -1;
        if (ok) ficam++;
        li.classList.remove("entra", "sai");
        if (ok && li.hidden) {
          li.hidden = false;
          if (!reduz) { void li.offsetWidth; li.classList.add("entra"); }
        } else if (!ok && !li.hidden) {
          if (reduz) { li.hidden = true; }
          else {
            li.classList.add("sai");
            setTimeout(function () { li.hidden = true; li.classList.remove("sai"); }, 190);
          }
        }
      });
      if (conta) conta.textContent = ficam + (ficam === 1 ? " projeto" : " projetos");
    }
    botoes.forEach(function (b) {
      b.addEventListener("click", function () {
        botoes.forEach(function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
        aplicar(b.getAttribute("data-filtro"));
      });
    });
    if (conta) conta.textContent = itens.length + " projetos";
  }

  /* ---------- Barra de leitura ---------- */
  var barra = document.querySelector(".progresso span");
  if (barra) {
    var pend = false;
    function atualizar() {
      var alto = document.documentElement.scrollHeight - window.innerHeight;
      var p = alto > 0 ? Math.min(1, Math.max(0, window.scrollY / alto)) : 0;
      barra.style.transform = "scaleX(" + p + ")";
      pend = false;
    }
    window.addEventListener("scroll", function () {
      if (!pend) { pend = true; requestAnimationFrame(atualizar); }
    }, { passive: true });
    atualizar();
  }

  /* ---------- Galeria horizontal ---------- */
  document.querySelectorAll(".galeria").forEach(function (g) {
    var pista = g.querySelector(".galeria-pista");
    var ant = g.querySelector(".seta--ant"), prox = g.querySelector(".seta--prox");
    if (!pista) return;
    function passo() {
      var it = pista.querySelector(".galeria-item");
      return it ? it.getBoundingClientRect().width + parseFloat(getComputedStyle(pista).columnGap || 16) : 300;
    }
    function atualizar() {
      var max = pista.scrollWidth - pista.clientWidth - 2;
      ant.disabled = pista.scrollLeft <= 2;
      prox.disabled = pista.scrollLeft >= max;
    }
    ant.addEventListener("click", function () { pista.scrollBy({ left: -passo(), behavior: reduz ? "auto" : "smooth" }); });
    prox.addEventListener("click", function () { pista.scrollBy({ left: passo(), behavior: reduz ? "auto" : "smooth" }); });
    pista.addEventListener("scroll", atualizar, { passive: true });
    window.addEventListener("resize", atualizar);
    pista.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); prox.click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); ant.click(); }
    });
    /* arrastar com o mouse */
    var ini = null, x0 = 0, s0 = 0;
    pista.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;
      ini = true; x0 = e.clientX; s0 = pista.scrollLeft;
    });
    window.addEventListener("pointermove", function (e) {
      if (!ini) return;
      var dx = e.clientX - x0;
      if (Math.abs(dx) > 4) pista.classList.add("arrastando");
      pista.scrollLeft = s0 - dx;
    });
    window.addEventListener("pointerup", function () {
      if (!ini) return;
      ini = null;
      if (pista.classList.contains("arrastando")) {
        pista.classList.remove("arrastando");
        var p = passo(), alvo = Math.round(pista.scrollLeft / p) * p;
        pista.scrollTo({ left: alvo, behavior: "smooth" });
      }
    });
    atualizar();
  });
})();

/* Cards de serviços: brilho que segue o cursor; toque alterna */
(function () {
  var cards = document.querySelectorAll(".serv-card");
  if (!cards.length) return;
  cards.forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", (e.clientX - r.left) + "px");
      c.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
    c.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") {
        var ligado = c.classList.contains("on");
        cards.forEach(function (o) { o.classList.remove("on"); });
        if (!ligado) c.classList.add("on");
      }
    });
  });
})();

/* Com quem eu trabalho: abas com mouse, toque e teclado */
(function () {
  var raiz = document.querySelector("[data-com]");
  if (!raiz) return;
  var abas = Array.prototype.slice.call(raiz.querySelectorAll('[role="tab"]'));
  var paineis = Array.prototype.slice.call(raiz.querySelectorAll('[role="tabpanel"]'));
  function ativa(i, foco) {
    abas.forEach(function (a, k) {
      a.setAttribute("aria-selected", k === i ? "true" : "false");
      a.tabIndex = k === i ? 0 : -1;
      if (paineis[k]) paineis[k].hidden = k !== i;
    });
    if (foco) abas[i].focus();
  }
  abas.forEach(function (a, i) {
    a.addEventListener("click", function () { ativa(i); });
    a.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") ativa(i); });
    a.addEventListener("keydown", function (e) {
      var d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (d) { e.preventDefault(); ativa((i + d + abas.length) % abas.length, true); }
    });
  });
})();

/* Contato: brilho que segue o cursor e botão de copiar */
(function () {
  document.querySelectorAll(".cont-card").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", (e.clientX - r.left) + "px");
      c.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });
  document.querySelectorAll(".copiar").forEach(function (b) {
    var original = b.textContent;
    b.addEventListener("click", function () {
      var txt = b.getAttribute("data-copiar");
      function feito() {
        b.textContent = "Copiado";
        b.classList.add("ok");
        setTimeout(function () { b.textContent = original; b.classList.remove("ok"); }, 1600);
      }
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(txt).then(feito, feito); return; }
      } catch (err) {}
      feito();
    });
  });
})();
