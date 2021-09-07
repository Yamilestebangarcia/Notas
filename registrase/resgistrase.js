import {
  validateEmail,
  validatePass,
  validateName,
  err,
} from "../comun/funciones.js";

const $form = document.getElementById("form");
const $boton = document.getElementById("boton");
const $err = document.getElementById("err");
function resJwt(response) {
  if (response.status == 200) {
    let data = response.json();

    data.then((data) => {
      console.log(data);
      window.localStorage.setItem("jwt", JSON.stringify(data));
      window.location = "../private/index.html";
    });
  } else {
    let data = response.json();
    data.then((data) => {
      if (data.message === "email invalid") {
        err("email invalido, ya ha sido registardo ");
      } else if (data.message === "name incorrect") {
        err("Nombre incorrecto, debe de tener al menos dos caracteres");
      } else if (data.message === "email incorrect") {
        err("Email incorrecto, ponga un email valido");
      } else if (data.message === "password incorrect") {
        err("Password incorrecto, debe tener al menos 8 caracteres");
      }
    });
  }
}

$boton.addEventListener("click", (e) => {
  e.preventDefault();
  $err.classList.add("inactiva");
  $err.innerText = "";
  //valido y si es correcto mando peticion
  if (
    !validateName($form.name.value) |
    !validateEmail($form.email.value) |
    !validatePass($form.password.value)
  ) {
    if (!validateName($form.name.value)) {
      err("Nombre incorrecto, debe de tener al menos dos caracteres");
    }
    if (!validateEmail($form.email.value)) {
      err("Email incorrecto, ponga un email valido");
    }
    if (!validatePass($form.password.value)) {
      err("Password incorrecto, debe tener al menos 8 caracteres");
    }
  } else {
    //mando peticion
    fetch("https://notasyamil.herokuapp.com/register", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: $form.name.value,
        email: $form.email.value,
        password: $form.password.value,
      }),
    })
      .then((response) => {
        resJwt(response);
      })

      .catch((err) => {
        console.log(err);
      });
  }
});
