(function () {
    // ======================================================
    //  FOTOS: edita esta lista.
    //  "src" es la ruta de la imagen dentro de la carpeta fotos.
    //  "texto" es la frase que aparece sobre la foto.
    // ======================================================
    var fotos = [
      { src: "fotos/foto1.jpg", texto: "Tu sonrisa, mi lugar favorito" },
      { src: "fotos/foto2.jpg", texto: "Mi Crespa hermosa" },
      { src: "fotos/foto3.jpg", texto: "Así de linda te veo siempre" },
      { src: "fotos/foto4.jpg", texto: "Mi vida entera en una foto" },
      { src: "fotos/foto5.jpg", texto: "Amorcito, qué bonita eres" },
      { src: "fotos/foto6.jpg", texto: "Falta poco para abrazarte" }
    ];
  
    // ---------- Utilidades de guardado y fechas ----------
    function leer(clave) {
      try { return localStorage.getItem(clave); } catch (e) { return null; }
    }
    function guardar(clave, valor) {
      try { localStorage.setItem(clave, valor); } catch (e) {}
    }
    function aFecha(texto) {
      var p = texto.split("-");
      return new Date(+p[0], +p[1] - 1, +p[2]);
    }
  
    // ---------- Cuenta regresiva al reencuentro ----------
    var reenc = document.getElementById("reencuentro");
    var cuenta = document.getElementById("cuenta");
  
    function pintarCuenta() {
      if (!reenc.value) {
        cuenta.innerHTML = "—<small>para nuestro primer abrazo</small>";
        return;
      }
      var ms = aFecha(reenc.value) - new Date();
      if (ms <= 0) {
        cuenta.innerHTML = "¡Ya llegó!<small>nuestro primer abrazo</small>";
        return;
      }
      var d = Math.floor(ms / 86400000);
      var h = Math.floor((ms % 86400000) / 3600000);
      var m = Math.floor((ms % 3600000) / 60000);
      cuenta.innerHTML =
        d + (d === 1 ? " día" : " días") +
        "<small>" + h + " h " + m + " min para nuestro primer abrazo</small>";
    }
  
    var g1 = leer("kimmy-reencuentro");
    if (g1) reenc.value = g1;
    reenc.addEventListener("change", function () {
      guardar("kimmy-reencuentro", reenc.value);
      pintarCuenta();
    });
    pintarCuenta();
    setInterval(pintarCuenta, 60000);
  
    // ---------- Días juntos ----------
    var fecha = document.getElementById("fecha");
    var dias = document.getElementById("dias");
  
    function pintarDias() {
      if (!fecha.value) {
        dias.innerHTML = "—<small>días contigo</small>";
        return;
      }
      var hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      var n = Math.max(0, Math.round((hoy - aFecha(fecha.value)) / 86400000));
      dias.innerHTML =
        n.toLocaleString("es") +
        "<small>" + (n === 1 ? "día" : "días") + " contigo, y los que faltan</small>";
    }
  
    var g2 = leer("kimmy-fecha");
    if (g2) fecha.value = g2;
    fecha.addEventListener("change", function () {
      guardar("kimmy-fecha", fecha.value);
      pintarDias();
    });
    pintarDias();
  
    // ---------- Razones (cámbialas por las tuyas) ----------
    var razones = [
      "Porque contigo puedo ser yo, sin filtros.",
      "Porque tu risa me arregla cualquier día, aunque estemos a kilómetros.",
      "Porque te encanta mi cabello rizado y por eso eres mi Crespa.",
      "Porque me haces querer ser mejor persona, amor.",
      "Porque hasta tus celos de mentira me hacen reír.",
      "Porque confías en mí para contarme todo, y eso vale oro.",
      "Porque en cada videollamada me haces sentir que estás aquí, mi vida.",
      "Porque eres tierna y tímida cuando menos lo esperas, amorcito.",
      "Porque cada día contigo hace más corta la distancia, mi crespita."
    ];
  
    var ultima = -1;
    var razon = document.getElementById("razon");
  
    document.getElementById("otra").addEventListener("click", function () {
      var n;
      do { n = Math.floor(Math.random() * razones.length); } while (n === ultima);
      ultima = n;
      razon.textContent = razones[n];
    });
  
    // ---------- Sorteo de la ropa ----------
    var veredictos = [
      "Hoy te toca a ti, Crespa. Y que no te hagas la dormida.",
      "Hoy me toca a mí. Pero tú supervisas, amor.",
      "Empate. Lavamos juntos cuando nos veamos.",
      "Te toca a ti, mi crespita, pero con un beso de premio.",
      "Me toca a mí. Cuando llegue a Iquitos, me pongo a trabajar, mi vida."
    ];
    var ultimoV = -1;
    var veredicto = document.getElementById("veredicto");
  
    document.getElementById("sorteo").addEventListener("click", function () {
      var n;
      do { n = Math.floor(Math.random() * veredictos.length); } while (n === ultimoV);
      ultimoV = n;
      veredicto.textContent = veredictos[n];
    });
  
    // ---------- Fotos: retrato y galería (protegido para no romper lo demás) ----------
    try {
      // Retrato de portada
      var retrato = document.getElementById("retrato");
      var letra = document.getElementById("retratoLetra");
      var sinRetrato = function () { retrato.hidden = true; letra.hidden = false; };
      retrato.addEventListener("error", sinRetrato);
      if (retrato.complete && retrato.naturalWidth === 0) sinRetrato();
  
      // Visor de fotos (lightbox)
      var lb = document.getElementById("lb");
      var lbImg = document.getElementById("lbImg");
      var lbCap = document.getElementById("lbCap");
      var lista = [];
      var actual = 0;
      var ultimoFoco = null;
  
      var mostrar = function () {
        var it = lista[actual];
        lbImg.src = it.src;
        lbImg.alt = it.texto;
        lbCap.textContent = it.texto;
        var varias = lista.length > 1;
        document.getElementById("lbP").style.visibility = varias ? "visible" : "hidden";
        document.getElementById("lbN").style.visibility = varias ? "visible" : "hidden";
      };
      var abrir = function (item) {
        lista = fotos.filter(function (x) { return x.ok; });
        actual = Math.max(0, lista.indexOf(item));
        ultimoFoco = document.activeElement;
        mostrar();
        lb.hidden = false;
        document.body.style.overflow = "hidden";
        document.getElementById("lbX").focus();
      };
      var cerrar = function () {
        lb.hidden = true;
        document.body.style.overflow = "";
        if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
      };
      var mover = function (d) {
        actual = (actual + d + lista.length) % lista.length;
        mostrar();
      };
  
      document.getElementById("lbX").addEventListener("click", cerrar);
      document.getElementById("lbP").addEventListener("click", function () { mover(-1); });
      document.getElementById("lbN").addEventListener("click", function () { mover(1); });
      lb.addEventListener("click", function (e) { if (e.target === lb) cerrar(); });
      document.addEventListener("keydown", function (e) {
        if (lb.hidden) return;
        if (e.key === "Escape") cerrar();
        if (e.key === "ArrowLeft") mover(-1);
        if (e.key === "ArrowRight") mover(1);
      });
  
      var x0 = null;
      lb.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener("touchend", function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 50) mover(dx < 0 ? 1 : -1);
        x0 = null;
      });
  
      // Construir la galería
      var cont = document.getElementById("galeria");
      fotos.forEach(function (it) {
        it.ok = false;
  
        var boton = document.createElement("button");
        boton.type = "button";
        boton.className = "foto";
        boton.setAttribute("aria-label", "Ver foto: " + it.texto);
        boton.hidden = true;
  
        var vacio = document.createElement("div");
        vacio.className = "vacia";
        vacio.hidden = true;
        vacio.innerHTML = "<b>♡</b><span>Aquí va una foto</span><code></code>";
        vacio.querySelector("code").textContent = it.src;
  
        var img = new Image();
        img.alt = it.texto;
        img.addEventListener("load", function () {
          it.ok = true;
          boton.hidden = false;
          vacio.hidden = true;
        });
        img.addEventListener("error", function () {
          vacio.hidden = false;
        });
        img.src = it.src;
  
        var pie = document.createElement("span");
        pie.className = "pie";
        pie.textContent = it.texto;
  
        boton.appendChild(img);
        boton.appendChild(pie);
        boton.addEventListener("click", function () { abrir(it); });
  
        cont.appendChild(boton);
        cont.appendChild(vacio);
      });
    } catch (err) {
      if (window.console) console.error("Error en las fotos:", err);
    }
  })();