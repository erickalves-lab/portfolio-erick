(function () {
  var cfg = window.SITE_CONFIG || {};

  /* ---------- Faixa de agenda ---------- */
  var faixa = document.getElementById("agenda");
  if (faixa) {
    var a = cfg.agenda || {};
    var expirou = false;
    if (a.ate) {
      var fim = new Date(a.ate + "T23:59:59");
      expirou = !isNaN(fim) && new Date() > fim;
    }
    if (a.mostrar === false || expirou) {
      faixa.hidden = true;
    } else {
      faixa.setAttribute("data-estado", a.estado === "fechada" ? "fechada" : "aberta");
      var msg = faixa.querySelector(".agenda-texto");
      if (msg && a.mensagem) msg.textContent = a.mensagem;
      faixa.hidden = false;
    }
  }

  /* ---------- Vídeos ---------- */
  var lista = document.getElementById("lista-videos");
  if (lista) {
    var itens = cfg.videos || [];
    var haModelo = false;

    itens.forEach(function (v) {
      var li = document.createElement("li");
      var quadro = document.createElement("div");
      quadro.className = "video-quadro";

      if (v.modelo) {
        haModelo = true;
        quadro.className += " video-quadro--vazio";
        quadro.innerHTML = '<span class="video-play" aria-hidden="true"></span>';
      } else if (v.youtube) {
        var img = document.createElement("img");
        img.src = "https://i.ytimg.com/vi/" + v.youtube + "/hqdefault.jpg";
        img.alt = "";
        img.loading = "lazy";
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "video-play";
        btn.setAttribute("aria-label", "Reproduzir: " + v.titulo);
        btn.addEventListener("click", function () {
          var f = document.createElement("iframe");
          f.src = "https://www.youtube-nocookie.com/embed/" + v.youtube + "?autoplay=1&rel=0";
          f.title = v.titulo;
          f.allow = "autoplay; encrypted-media; picture-in-picture";
          f.allowFullscreen = true;
          quadro.innerHTML = "";
          quadro.appendChild(f);
        });
        quadro.appendChild(img);
        quadro.appendChild(btn);
      } else if (v.url) {
        var link = document.createElement("a");
        link.href = v.url;
        link.className = "video-play";
        link.target = "_blank";
        link.rel = "noopener";
        link.setAttribute("aria-label", "Assistir: " + v.titulo);
        quadro.appendChild(link);
      }

      var info = document.createElement("div");
      info.className = "video-info";
      var h = document.createElement("h3");
      h.textContent = v.titulo;
      var p = document.createElement("p");
      p.textContent = v.cliente + (v.papel ? " — " + v.papel : "");
      info.appendChild(h);
      info.appendChild(p);
      if (v.perfil) {
        var pl = document.createElement("a");
        pl.href = v.perfil;
        pl.target = "_blank";
        pl.rel = "noopener";
        pl.textContent = "Ver perfil do cliente";
        info.appendChild(pl);
      }

      li.appendChild(quadro);
      li.appendChild(info);
      lista.appendChild(li);
    });

    var nota = document.getElementById("nota-modelo");
    if (nota) nota.hidden = !haModelo;
  }
})();
