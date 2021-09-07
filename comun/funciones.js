export function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
export function validatePass(pass) {
  const re = /(?=.[a-zA-Z0-9])(?=.{8,})/;
  return re.test(pass);
}
export function validateName(name) {
  const re = /(?=.[a-zA-Z0-9])(?=.{1,120})/;
  return re.test(name);
}
export function validateTitulo(name) {
  const re = /(?=.[a-zA-Z0-9])(?=.{1,15})/;
  return re.test(name);
}
export function resJwt(response) {
  if (response.status == 200) {
    let data = response.json();

    data.then((data) => {
      window.localStorage.setItem("jwt", JSON.stringify(data));
      window.location = "private/index.html";
    });
  } else {
    let data = response.json();
    data.then((data) => {
      if (data.message === "email invalid") {
        console.log("email ya registrado"); //reflejar es esto
      } else if (data.message === "name incorrect") {
        console.log("name incorrecto"); //reflejar es esto
      } else if (data.message === "email incorrect") {
        console.log("email incorrecto"); //reflejar es esto
      } else if (data.message === "password incorrect") {
        console.log("password incorrecto"); //reflejar es esto
      }
    });
  }
}
export function err(textErr) {
  const $err = document.getElementById("err");
  $err.classList.remove("inactiva");
  const $p = document.createElement("p");
  $p.innerText = textErr;
  $err.appendChild($p);
}
