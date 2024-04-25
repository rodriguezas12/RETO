const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors'); // Importa el middleware de CORS

const app = express();

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configura el middleware de CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Configura la conexión a la base de datos
const db = mysql.createConnection({
  host: 'db-retorfid.cdsc040qszy0.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'usuario123',
  database: 'RETORFID'
});

// Conecta a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    process.exit(1);
  }
  console.log('Conexión a la base de datos establecida');
  console.log('El servidor de base de datos está corriendo en el puerto:', db.config.port);
});

// Ruta para manejar la solicitud de registro
app.post('/register', (req, res) => {
  const { nombre_completo, codigo_estudiantil } = req.body;
  // Inserta los datos en la tabla 'register2'
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

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
