const mysql = require('mysql');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'comu-database-register.cdiikyiuqv0u.us-east-1.rds.amazonaws.com',
  user: 'Migthyfigth',
  password: 'estrella10juju',
  database: 'comu-database-register'
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL en RDS');
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
)
`;

// Ejecuta la consulta para crear la tabla
connection.query(createTableQuery, (err, results, fields) => {
  if (err) {
    console.error('Error al crear la tabla:', err);
    return;
  }
  console.log('Tabla creada exitosamente.');
});


// Exportar la conexión para que esté disponible en otros archivos
module.exports = connection;
