import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();

export const usuarios = [
  {
    user: "admin",
    email: "admin@adm.com",
    password: "$2a$05$amMjyHPrMMJAzu2Mzf.B7OHUgJUEARW05JZ8ZCG6ZbDB0yo0x6p/a",
  },
];

async function login(req, res) {
  console.log(req.body);
  const user = req.body.user;
  const password = req.body.password;

  if (!user || !password) {
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }

  try {
    const usuarioAResvisar = await prisma.user.findFirst({
      where: { user: user },
    });

    if (!usuarioAResvisar) {
      return res.status(400).send({ status: "Error", message: "Error durante login" });
    }

    const loginCorrecto = await bcryptjs.compare(password, usuarioAResvisar.password);

    if (!loginCorrecto) {
      return res.status(400).send({ status: "Error", message: "Error durante login" });
    }

    // Imprimir el token en la consola antes de firmarlo
    console.log("Token a firmar:", { id: usuarioAResvisar.id, user: usuarioAResvisar.user });

    const token = jsonwebtoken.sign(
      { id: usuarioAResvisar.id, user: usuarioAResvisar.user },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    const cookieOption = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      path: "/",
    };

    // Agregar manejo de errores al establecer la cookie
    res.cookie("jwt", token, cookieOption, (err) => {
      if (err) {
        console.error("Error al establecer la cookie:", err);
        return res.status(500).send({ status: "Error", message: "Error interno del servidor" });
      }
    });

    res.send({
      status: "ok",
      message: "Usuario loggeado",
      user: {
        id: usuarioAResvisar.id,
        user: usuarioAResvisar.user,
        email: usuarioAResvisar.email,
      },
      redirect: "/admin",
    });
  } catch (error) {
    console.error("Error durante el login:", error);
    res.status(500).send({ status: "Error", message: "Error interno del servidor" });
  }
}


async function register(req, res) {
  const user = req.body.user;
  const password = req.body.password;
  const email = req.body.email;

  if (!user || !password || !email) {
    return res.status(400).send({
      status: "Error",
      message: "Los campos están incompletos",
      error: "Campos faltantes: user, password, email",
    });
  }

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ user }, { email }] },
  });

  if (existingUser) {
    return res.status(400).send({ status: "Error", message: "Este usuario o correo electrónico ya existe" });
  }

  const salt = await bcryptjs.genSalt(5);
  const hashPassword = await bcryptjs.hash(password, salt);

  const nuevoUsuario = await prisma.user.create({
    data: {
      user,
      email,
      password: hashPassword,
    },
  });

  console.log("Usuario agregado a la base de datos");
  return res.status(201).send({ status: "ok", message: `Usuario ${user} agregado`, redirect: "login" });
}

export const methods = {
  login,
  register,
};