import { err, validatePass } from "../comun/funciones.js";
const $btn = document.getElementById("boton");
const $form = document.getElementById("form");
const $err = document.getElementById("err");

$btn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("click");
  $err.innerText = "";
  if (
    !validatePass($form.password_1.value) ||
    $form.password_1.value !== $form.password_2.value
  ) {
    console.log("bb");
    if (!validatePass($form.password_1.value)) err("password invalido");
    if ($form.password_1.value !== $form.password_2.value)
      err("los password no coinciden");
  } else {
    console.log("aa");
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    peticion(token, $form.password_1.value);
  }
});

function peticion(token, pass) {
  fetch("https://notasyamil.herokuapp.com/password", {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: pass,
      token: token,
    }),
  })
    .then((response) => {
      if (response.status == 200) {
        const data = response.json().then((data) => {
          if (data.message === "changed password") {
            window.location = "../index.html";
          } else {
            err("No se a podido recuperar password, intentelo de nuevo");
          }
        });
      } else {
        err("No se a podido recuperar password, intentelo de nuevo");
      }
    })

    .catch((error) => {
      err("No se a podido recuperar password");
    });
}
