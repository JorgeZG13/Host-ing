document.addEventListener("DOMContentLoaded", function() {
  const mensajeError = document.getElementsByClassName("error")[0];
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Accede a los valores del formulario utilizando e.target y los nombres de los campos
      const user = e.target.children.user.value;
      const password = e.target.children.password.value;

      console.log(user, password);

      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user,
          password,
        }),
      });

      console.log(JSON.stringify({
        user,
        password,
      }));

      if (!res.ok) {
        mensajeError.classList.toggle("escondido", false);
        return;
      }

      const resJson = await res.json();
      if (resJson.redirect) {
        window.location.href = resJson.redirect;
      }
    });
  } else {
    console.error("El formulario de inicio de sesión no fue encontrado.");
  }
});
