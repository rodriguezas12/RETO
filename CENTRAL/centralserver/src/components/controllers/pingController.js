const connection = require('../models/db');

module.exports.ping = (req, res) => {
    const consult = 'SELECT * FROM login'; // Corrección: Agregar espacios alrededor del asterisco y comillas faltantes

    try {
        connection.query(consult, (err, results) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                res.status(500).send('Error en el servidor');
                return;
            }
            console.log(results);
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).send('Error en el servidor');
    }
};