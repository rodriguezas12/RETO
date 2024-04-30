import mysql.connector
from reader import R420
import time

# Conectar a la base de datos MySQL
conexion = mysql.connector.connect(user='admin', password='usuario123', host='db-retorfid.cdsc040qszy0.us-east-2.rds.amazonaws.com', database='RETORFID', port='3306')
cursor = conexion.cursor()

# Crear la tabla si no existe
cursor.execute("""
CREATE TABLE IF NOT EXISTS Registro_Tags (
  Tag VARCHAR(25) NOT NULL,
  Nombre TEXT NOT NULL,
  PRIMARY KEY (Tag)
) COMMENT 'Registro continuo de los tags detectados con nombres ingresados por el usuario';
""")
conexion.commit()

# Instanciar el lector RFID
reader = R420('192.168.0.20')
durationn = 0.5

# Leer tags de forma continua
while True:
    tags = reader.detectTags(powerDBm=reader.power_table[35], freqMHz=reader.freq_table[0], mode=1001, session=2, population=1, duration=durationn, searchmode=2)
    for tag in tags:
        tag_id = tag['EPC-96'].decode('utf-8')
        print(f"Tag detectado: {tag_id}")
        
        # Solicitar al usuario que ingrese el nombre del kit para el tag detectado
        nombre_kit = input("Introduce el nombre del kit para este tag: ")

        # Insertar el tag y el nombre asignado en la base de datos
        try:
            cursor.execute("INSERT INTO Registro_Tags (Tag, Nombre) VALUES (%s, %s) ON DUPLICATE KEY UPDATE Nombre = %s", (tag_id, nombre_kit, nombre_kit))
            conexion.commit()
            print("Tag y nombre guardados correctamente en la base de datos.")
        except mysql.connector.Error as err:
            print("Error al insertar el tag en la base de datos:", err)
