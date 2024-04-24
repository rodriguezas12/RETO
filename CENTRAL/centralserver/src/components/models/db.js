const mysql = require('mysql2');



// Configura la conexión a la base de datos
const db = mysql.createConnection({
  host: 'db-retorfid.cdsc040qszy0.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'usuario123',
  database: 'loginbase'
});

// Conecta a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida');
});

// Exporta una función para insertar un registro en la tabla
exports.insertarRegistro = (nombreCompleto, codigoEstudiantil) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO register (nombre_completo, codigo_estudiantil) VALUES (?, ?)', [nombreCompleto, codigoEstudiantil], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
