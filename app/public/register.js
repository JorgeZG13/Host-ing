const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Accede a los valores del formulario utilizando getElementById o querySelector
  const userValue = document.getElementById("user").value;
  const emailValue = document.getElementById("email").value;
  const passwordValue = document.getElementById("password").value;

  const res = await fetch("http://localhost:4000/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: userValue,
      email: emailValue,
      password: passwordValue,
    }),
  });

  const resJson = await res.json();

  if (!res.ok) {
    // Muestra la alerta de error en el caso de que el usuario o correo ya exista
    if (resJson && resJson.status === "Error" && resJson.message === "Este usuario o correo electrónico ya existe") {
      mensajeError.textContent = "Este usuario o correo electrónico ya existe";
      mensajeError.classList.toggle("escondido", false);
    } else {
      // En caso de otros errores, puedes manejarlos de acuerdo a tus necesidades
      // Por ejemplo, mostrar un mensaje genérico de error
      mensajeError.textContent = "Error durante el registro";
      mensajeError.classList.toggle("escondido", false);
    }

    // Puedes añadir un retun para salir de la función o manejar el error de otra manera
    return;
  }

  if (resJson.redirect) {
    window.location.href = resJson.redirect;
  }
});
