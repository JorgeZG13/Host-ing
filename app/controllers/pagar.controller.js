// En tu controlador del lado del servidor
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

async function pagar(req, res) {
  try {
    // Verificar si el usuario está autenticado
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

    const userId = decodedToken.id;
    const cartItems = req.body.cartItems;

    // Iterar sobre los productos del carrito y guárdalos en la base de datos
    for (const item of cartItems) {
      await prisma.productoCarrito.create({
        data: {
          nombre: item.name,
          descripcion: item.desc,
          imagen: item.img,
          precio: parseFloat(item.precio),
          cantidad: item.quantity,
          usuarioId: userId,
        },
      });
    }

    res.status(200).json({ message: "Pedido realizado con éxito" });
  } catch (error) {
    console.error("Error durante el pago:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export const methods = {
  pagar,
};
