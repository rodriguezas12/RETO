const express = require('express');
const router = express.Router();

// Ejemplo de controlador para manejar las solicitudes de registro
router.post('/register', (req, res) => {
  // Aquí puedes agregar la lógica para manejar la solicitud de registro
  const { nombre_completo, codigo_estudiantil } = req.body;

  // Por ejemplo, podrías insertar los datos en una base de datos
  // Aquí simularemos una respuesta exitosa
  res.status(201).json({ message: 'Usuario registrado correctamente', data: { nombre_completo, codigo_estudiantil } });
});

module.exports = router;
