const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const db = mysql.createConnection({
  host: "db-retorfid.cdsc040qszy0.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "usuario123",
  database: "RETORFID",
});

db.connect((err) => {
  if (err) {
    console.error("Error de conexión a la base de datos:", err);
    process.exit(1);
  }
  console.log("Conexión a la base de datos establecida");
  console.log(
    "El servidor de base de datos está corriendo en el puerto:",
    db.config.port
  );
});

app.post("/register", (req, res) => {
  const { nombre, codigoEstudiantil, nrc } = req.body;

  // Verificar si el nombre completo o el código estudiantil ya existen en la base de datos
  db.query(
    "SELECT * FROM register2 WHERE nombre_completo = ? OR codigo_estudiantil = ?",
    [nombre, codigoEstudiantil],
    (err, results) => {
      if (err) {
        console.error("Error al verificar el usuario:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }

      if (results.length > 0) {
        // Si el usuario ya está registrado, enviar un mensaje de error
        console.log("El usuario ya está registrado");
        res.status(400).send("El usuario ya está registrado");
      } else {
        // Si el usuario no está registrado, proceder con el registro
        db.query(
          "INSERT INTO register2 (nombre_completo, codigo_estudiantil, nrc) VALUES (?, ?, ?)",
          [nombre, codigoEstudiantil, nrc],
          (err, results) => {
            if (err) {
              console.error("Error al registrar el usuario:", err);
              res.status(500).send("Error interno del servidor");
              return;
            }

            console.log("Usuario registrado correctamente");
            res.status(201).send("Usuario registrado correctamente");
          }
        );
      }
    }
  );
});

// Endpoint para verificar la existencia de un usuario
app.post("/verificarUsuario", (req, res) => {
  const { codigoEstudiantil } = req.body;

  db.query(
    "SELECT * FROM register2 WHERE codigo_estudiantil = ?",
    [codigoEstudiantil],
    (err, results) => {
      if (err) {
        console.error("Error al verificar el usuario:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }

      if (results.length > 0) {
        res.status(200).json({ mensaje: "Usuario encontrado" });
      } else {
        res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
    }
  );
});

app.get("/", (req, res) => {
  db.query("SELECT * FROM register2", (err, results) => {
    if (err) {
      console.error(
        "Error al seleccionar registros de la tabla register2:",
        err
      );
      res.status(500).send("Error interno del servidor");
      return;
    }

    let table =
      "<h1>Registros de la tabla register2</h1><table><tr><th>ID</th><th>Nombre completo</th><th>Código estudiantil</th></tr>";
    results.forEach((row) => {
      table += `<tr><td>${row.id}</td><td>${row.nombre_completo}</td><td>${row.codigo_estudiantil}</td></tr>`;
    });
    table += "</table>";

    res.send(table);
  });
});

app.post("/solicitar", (req, res) => {
  const { nuevoPedido } = req.body;

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Solicitud (
      Pedido VARCHAR(45)
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error al crear la tabla Solicitud:", err);
      res.status(500).send("Error al crear la tabla");
      return;
    }

    const insertQuery = "INSERT INTO Solicitud (Pedido) VALUES (?)";
    db.query(insertQuery, [nuevoPedido], (err, results) => {
      if (err) {
        console.error("Error al insertar el registro:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }
      res.status(201).send("Registro insertado correctamente");
    });
  });
});


app.post("/posicion", (req, res) => {
  const {
    "Col 1": col1,
    "Col 2": col2,
    "Col 3": col3,
    "Col 4": col4,
    "Col 5": col5,
    "Col 6": col6,
    "Col 7": col7,
    "Col 8": col8,
    "Col 9": col9,
    "Col 10": col10,
  } = req.body;

  // Crear la tabla si no existe
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS M1 (
      \`Col 1\` VARCHAR(255),
      \`Col 2\` VARCHAR(255),
      \`Col 3\` VARCHAR(255),
      \`Col 4\` VARCHAR(255),
      \`Col 5\` VARCHAR(255),
      \`Col 6\` VARCHAR(255),
      \`Col 7\` VARCHAR(255),
      \`Col 8\` VARCHAR(255),
      \`Col 9\` VARCHAR(255),
      \`Col 10\` VARCHAR(255)
    );
  `;

  db.query(createTableQuery, (createErr) => {
    if (createErr) {
      console.error("Error al crear/verificar la tabla M1:", createErr);
      res.status(500).send("Error al crear la tabla M1");
      return;
    }

    // Insertar datos en la tabla una vez creada
    const insertQuery = "INSERT INTO M1 (`Col 1`, `Col 2`, `Col 3`, `Col 4`, `Col 5`, `Col 6`, `Col 7`, `Col 8`, `Col 9`, `Col 10`) VALUES (?,?,?,?,?,?,?,?,?,?)";
    db.query(insertQuery, [col1, col2, col3, col4, col5, col6, col7, col8, col9, col10], (err, results) => {
      if (err) {
        console.error("Error al insertar el registro:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }
      console.log("Registro insertado correctamente");
      res.status(201).send("Registro insertado correctamente");
    });
  });
});

app.get("/inventario_rack", (req, res) => {
  const query = `
      SELECT Nombre, COUNT(*) as Cantidad
      FROM Datos
      WHERE Nombre LIKE 'Kit %'
      GROUP BY Nombre
    `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al seleccionar registros:", err);
      res.status(500).send("Error interno del servidor");
    } else {
      res.json(results);
    }
  });
});

// inventario llamado de tabla a sql
app.get('/michi', (req, res) => {

  db.query('SELECT * FROM RETORFID.Datos', (err, results) => {
    if (err) {
      console.error("Error al obtener los datos:", err);
      res.status(500).send("Error en el servidor");
      return;
    }
    res.json(results);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
