import { err, validateName, validateTitulo } from "../comun/funciones.js";
let $notas;
let $modal;
let $err;

let $form;
function cargarDatos() {
  fetch("https://notasyamil.herokuapp.com/usuario", {
    method: "Get",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: JSON.parse(local).token,
    },
  })
    .then((response) => {
      if (response.status == 200) {
        const data = response.json();
        data.then((data) => {
          if (data.allNotas.length == 0) {
            $notas.innerHTML = "<p class='noNotas'>No existen notas</p>";
          }
          presentarDatos(data);
        });
      } else {
        window.location = "../index.html";
      }
    })

    .catch((err) => {
      window.location = "../index.html";
    });
}
function crearNota() {
  fetch("https://notasyamil.herokuapp.com/crearnota", {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: JSON.parse(window.localStorage.getItem("jwt")).token,
    },
    body: JSON.stringify({
      title: $form.title.value,
      description: $form.description.value,
      state: $form.state.value,
    }),
  })
    .then((response) => {
      if (response.status == 200) {
        const data = response.json();
        data.then((data) => {
          const { title, description } = presentarNota(data);
          title.addEventListener("change", (e) => {
            actualizarDatos(e);
          });
          description.addEventListener("change", (e) => {
            actualizarDatos(e);
          });
          $modal.classList.add("inactiva");
          $err.classList.add("inactiva");
          $form.reset();
        });
      } else {
        err("No se a podido guardar la nota");
      }
    })

    .catch((err) => {
      err("No se a podido guardar la nota");
    });
}
function presentarDatos(data) {
  document.getElementsByTagName("title")[0].innerText = `hola ${data.user}`;
  document.getElementById("h2").innerText = data.user;

  presentarNotas(data.allNotas);
}
function presentarNotas(data) {
  data.forEach((element) => {
    presentarNota(element);
  });
  ponerLisener();
}
function presentarNota(element) {
  const frament = document.createDocumentFragment();
  const $nota = document.createElement("article");
  $nota.classList.add("nota");
  $nota.classList.add(element.state);
  $nota.id = element._id;
  const $img = document.createElement("img");
  $img.classList.add("notaCerrar");
  $img.src = "./cerrar.svg";
  $img.id = "cerraNota";
  const $title = document.createElement("h3");
  $title.classList.add("nota_titulo");
  $title.innerText = element.title;
  const $textareaTitulo = document.createElement("textarea");
  $textareaTitulo.classList.add("form_textarea_titulo_nota");
  $textareaTitulo.innerText = element.title;
  const $description = document.createElement("p");
  const $textareaDescripcion = document.createElement("textarea");
  $textareaDescripcion.classList.add("form_textarea_descripcion_nota");
  $textareaDescripcion.innerText = element.description;
  $description.classList.add("nota_descripcion");
  $description.innerText = element.description;
  $nota.appendChild($img);
  $nota.appendChild($title);
  $nota.appendChild($textareaTitulo);
  $nota.appendChild($description);
  $nota.appendChild($textareaDescripcion);
  frament.appendChild($nota);
  $notas.appendChild(frament);
  return { title: $textareaTitulo, description: $textareaDescripcion };
}
function ponerLisener() {
  const listTitule = document.querySelectorAll(
    ".form_textarea_titulo_nota, .form_textarea_descripcion_nota "
  );

  listTitule.forEach((element) => {
    element.addEventListener("change", (e) => {
      actualizarDatos(e);
    });
  });
}
function actualizarDatos(e) {
  const valor = e.target.value;
  e.target.previousSibling.innerText = valor;
  let datajson;
  if (e.target.className.indexOf("titulo") !== -1) {
    datajson = {
      title: valor,
    };
  } else {
    datajson = {
      description: valor,
    };
  }
  actualizarNota(e.target.parentNode.id, datajson);
}

function actualizarNota(id, datajson) {
  fetch(`https://notasyamil.herokuapp.com/actualizarnota/${id}`, {
    method: "PUT",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      authorization: JSON.parse(window.localStorage.getItem("jwt")).token,
    },
    body: JSON.stringify(datajson),
  })
    .then((response) => {
      if (response.status == 200) {
      } else {
        err("No se a podido guardar la nota");
      }
    })

    .catch((err) => {
      err("no se a podido guardar la nota");
    });
}
function borrarNota(e) {
  fetch(
    `https://notasyamil.herokuapp.com/borrarnota/${e.target.parentNode.id}`,
    {
      method: "DELETE",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: JSON.parse(local).token,
      },
    }
  )
    .then((response) => {
      if (response.status == 200) {
        e.target.parentNode.parentNode.removeChild(
          document.getElementById(e.target.parentNode.id)
        );
      } else {
        err("No se ha podido borrar la nota");
      }
    })

    .catch((err) => {
      err("No se ha podido borrar la nota");
    });
}

const local = window.localStorage.getItem("jwt");
console.log(local);
if (!local) {
  window.location = "../index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  $notas = document.getElementById("notas");
  $modal = document.getElementById("modal");
  $form = document.getElementById("form");
  $err = document.getElementById("err");
  cargarDatos();
});

document.addEventListener("click", (e) => {
  if (e.target.dataset.nota === "new-nota") {
    $modal.classList.remove("inactiva");
  }
  if (e.target.id === "cerrar") {
    window.localStorage.removeItem("jwt");
    window.location = "../index.html";
  }
  if (e.target.id === "enviar") {
    e.preventDefault();
    $err.innerText = "";
    $err.classList.add("inactivo");
    if (
      !validateTitulo($form.title.value) ||
      !validateName($form.description.value)
    ) {
      if (!validateTitulo($form.title.value)) {
        err("El campo titulo debe tener de 1 a 15 caracteres");
      }
      if (!validateName($form.description.value)) {
        err("El campo descrpcion debe tener de  1 a 120 caracteres");
      }
    } else {
      crearNota();
    }
  }
  if (e.target.dataset.cerrar === "cerrar") {
    $modal.classList.add("inactiva");
    $err.classList.add("inactiva");
    err.innerText = "";
    $form.reset();
  }
  if (e.target.id === "cerraNota") {
    borrarNota(e);
  }
});
