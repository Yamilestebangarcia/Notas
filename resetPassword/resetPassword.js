import { err, validateEmail } from "../comun/funciones.js";
const $btn = document.getElementById("boton");
const $email = document.getElementById("email");
const $err = document.getElementById("err");
$btn.addEventListener("click", (e) => {
  e.preventDefault();
  $err.innerText = "";
  if (!validateEmail($email.value)) return err("email invalido");
  fetch("https://notasyamil.herokuapp.com/resetPassword", {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: $email.value,
    }),
  })
    .then((response) => {
      if (response.status == 200) {
        const data = response.json();
        data.then((data) => {
          $err.classList.add("correct");
          $err.classList.remove("inactiva");
          err(
            "se ha enviado un email, si no lo encuentras mira en correo no deseado "
          );
        });
      } else {
        err("No se a podido recuperar password");
      }
    })

    .catch((error) => {
      err("No se a podido recuperar password");
      console.log(error);
    });
});
