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

app.get('/', (req, res) => {
  db.query('SELECT * FROM register2', (err, results) => {
    if (err) {
      console.error('Error al seleccionar registros de la tabla register2:', err);
      res.status(500).send('Error interno del servidor');
      return;
    }

    let table = '<h1>Registros de la tabla register2</h1><table><tr><th>ID</th><th>Nombre completo</th><th>Código estudiantil</th></tr>';
    results.forEach(row => {
      table += `<tr><td>${row.id}</td><td>${row.nombre_completo}</td><td>${row.codigo_estudiantil}</td></tr>`;
    });
    table += '</table>';

    res.send(table);
  });
});


app.post('/pedido', (req, res) => {
  const sqlCreateTable = `
    CREATE TABLE IF NOT EXISTS Solicitudes (
      Número_de_solicitud INT AUTO_INCREMENT NOT NULL,
      Solicitud TEXT NOT NULL,
      PRIMARY KEY (Número_de_solicitud)
    ) COMMENT 'Contabilidad de los kits';
  `;

  db.query(sqlCreateTable, (err, results) => {
    if (err) {
      console.error('Error creating table:', err.message);
      return res.status(500).send('Error creating table');
    }
    console.log('Table checked/created successfully');

    // Procesamos el pedido si la tabla está lista
    const nuevoPedido = req.body.nuevoPedido; // Asegúrate de que 'nuevoPedido' se envíe como parte del cuerpo de la solicitud
    if (!nuevoPedido) {
      return res.status(400).send("No se proporcionó 'nuevoPedido'.");
    }

    const valores = [[nuevoPedido]]; // Formateamos para la consulta, cada entrada debe ser un array

    const sqlInsert = `INSERT INTO Solicitudes (Solicitud) VALUES (?)`; // Solo insertamos la solicitud; el número de solicitud es autoincremental
    db.query(sqlInsert, [valores], (err, results) => {
      if (err) {
        console.error('Error inserting values:', err.message);
        return res.status(500).send('Error inserting values');
      }
      res.status(200).send(`Values inserted successfully, ID de la solicitud: ${results.insertId}`);
    });
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
