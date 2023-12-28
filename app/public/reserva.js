document.addEventListener("DOMContentLoaded", function () {
  const mensajeErrorReserva = document.getElementsByClassName("error-reserva")[0];
  console.log("mensajeErrorReserva:", mensajeErrorReserva);

  const formularioReserva = document.getElementById("reserva-form");

  formularioReserva.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Accede a los valores del formulario utilizando getElementById o querySelector
    const nombreValue = document.getElementById("nombre").value;
    const correoValue = document.getElementById("correo").value;
    const telefonoValue = document.getElementById("telefono").value;
    const fechaReservacionValue = document.getElementById("fechaReservacion").value;
    const timeValue = document.getElementById("horaReservacion").value;
    const mensajeValue = document.getElementById("mensaje").value;

    // Verificar campos vacíos
    if (!nombreValue || !correoValue || !telefonoValue || !fechaReservacionValue || !timeValue || !mensajeValue) {
      mensajeErrorReserva.textContent = "Todos los campos son obligatorios";
      mensajeErrorReserva.classList.toggle("escondido", false);
      return;
    }

    const formattedFechaReservacion = new Date(`${fechaReservacionValue}T${timeValue}:00`).toISOString();

    // Obtener el token almacenado en las cookies (o desde donde lo estés manejando)
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*=\s*([^;]*).*$)|^.*$/, "$1");

    try {
      const res = await fetch("http://localhost:4000/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Incluir el token en el encabezado
        },
        body: JSON.stringify({
          nombre: nombreValue,
          correo: correoValue,
          telefono: telefonoValue,
          fechaReservacion: formattedFechaReservacion,
          time: timeValue,
          mensaje: mensajeValue,
        }),
      });

      const resJson = await res.json();

      if (!res.ok) {
        // En caso de errores, puedes manejarlos de acuerdo a tus necesidades
        // Por ejemplo, mostrar un mensaje específico de error
        mensajeErrorReserva.textContent = resJson.message || "Error durante la reserva";
        mensajeErrorReserva.classList.toggle("escondido", false);
        return;
      }

      // Mostrar mensaje de éxito en una alerta
      window.alert("Reserva creada con éxito");

      // Restablecer el formulario
      formularioReserva.reset();

    } catch (error) {
      console.error("Error durante la reserva:", error);
      mensajeErrorReserva.textContent = "Error durante la reserva";
      mensajeErrorReserva.classList.toggle("escondido", false);
    }
  });
});
