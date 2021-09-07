import { validateEmail, validatePass, err } from "../comun/funciones.js";

const $form = document.getElementById("form");
const $boton = document.getElementById("boton");
const $err = document.getElementById("err");

function resJwt(response) {
  if (response.status == 200) {
    let data = response.json();

    data.then((data) => {
      window.localStorage.setItem("jwt", JSON.stringify(data));
      window.location = "./private/index.html";
    });
  } else {
    let data = response.json();
    data.then((data) => {
      if (data.message === "email incorrect") {
        err("Email incorrecto");
      } else if (data.message === "password incorrect") {
        err("Passwor incorrecto, minimo 8 caracteres");
      } else if (data.message === "user not found or password invalid") {
        err("Email o contraseña incorrecta");
      }
    });
  }
}

$boton.addEventListener("click", async (e) => {
  e.preventDefault();

  $err.classList.add("inactiva");
  $err.innerText = "";
  if (!validateEmail($form.email.value) | !validatePass($form.password.value)) {
    if (!validatePass($form.password.value)) {
      err("Passwor incorrecto, minimo 8 caracteres");
    }
    if (!validateEmail($form.email.value)) {
      err("Email incorrecto");
    }
  } else {
    fetch("https://notasyamil.herokuapp.com/login", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: $form.email.value,
        password: $form.password.value,
      }),
    })
      .then((response) => {
        resJwt(response);
      })

      .catch((err) => {
        console.log(err);
        window.location = "/";
      });
  }
});
