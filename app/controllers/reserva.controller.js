import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

async function reserva(req, res) {
  try {
    console.log('Solicitud de reserva recibida:', req.body);

    const { nombre, correo, telefono, fechaReservacion, time, mensaje } = req.body;

    // Verificar campos vacíos
    if (!nombre || !correo || !telefono || !fechaReservacion || !time || !mensaje) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Obtener el token del encabezado de la solicitud
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: 'Acceso no autorizado' });
    }

    let decodedToken;

    try {
      // Verificar y decodificar el token para obtener el ID del usuario
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decodificado:', decodedToken);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Guardar la reserva en la base de datos con el ID del usuario
    const reserva = await prisma.reserva.create({
      data: {
        nombre,
        correo,
        telefono,
        fechaReservacion,
        horaReservacion: time,
        mensaje,
        user: {
          connect: { id: decodedToken.id }, // Conectar con el usuario existente usando su ID
        },
      },
    });

    console.log('Reserva creada:', reserva);

    res.status(201).json({ message: 'Reserva creada con éxito' });
  } catch (error) {
    console.error('Error al crear la reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export const methods = {
  reserva,
};