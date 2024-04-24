// registerController.js

const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Configura la conexión a la base de datos
const db = mysql.createPool({
  host: 'db-retorfid.cdsc040qszy0.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'usuario123',
  database: 'loginbase'
});

// Maneja la solicitud para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { nombre_completo, codigo_estudiantil } = req.body;
  try {
    // Inserta el nuevo usuario en la base de datos
    const [rows] = await db.query('INSERT INTO register (nombre_completo, codigo_estudiantil) VALUES (?, ?)', [nombre_completo, codigo_estudiantil]);
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
