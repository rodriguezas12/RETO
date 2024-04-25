const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const db = mysql.createConnection({
  host: 'db-retorfid.cdsc040qszy0.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'usuario123',
  database: 'RETORFID'
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    process.exit(1);
  }
  console.log('Conexión a la base de datos establecida');
  console.log('El servidor de base de datos está corriendo en el puerto:', db.config.port);
});

app.post('/register', (req, res) => {
  const { nombre_completo, codigo_estudiantil } = req.body;
  db.query('INSERT INTO register2 (nombre_completo, codigo_estudiantil) VALUES (?, ?)', [nombre_completo, codigo_estudiantil], (err, results) => {
    if (err) {
      console.error('Error al insertar el registro:', err);
      res.status(500).send('Error interno del servidor');
      return;
    }
    console.log('Registro insertado correctamente');
    res.status(201).send('Registro insertado correctamente');
  });
});

app.post('/verificarUsuario', (req, res) => {
  const { codigoEstudiantil } = req.body;

  db.query('SELECT * FROM register2 WHERE codigo_estudiantil = ?', [codigoEstudiantil], (err, results) => {
    if (err) {
      console.error('Error al verificar el usuario:', err);
      res.status(500).send('Error interno del servidor');
      return;
    }

    if (results.length > 0) {
      res.status(200).json({ mensaje: 'Usuario encontrado' });
    } else {
      res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
