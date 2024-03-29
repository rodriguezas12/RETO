#ESTE CÓDIGO SERÁ UTILIZADO EN LAS ESTACIONES, 7 EN TOTAL 
#SERVIRÁ PARA TRACKEAR EN QUE ESTACIÓN SE ENCUENTRA EL PRODUCTO, ASÍ MISMO DECIR CUANTO LE TOMÓ PASAR DE UNA ESTACIÓN A OTRA

import mysql.connector
from reader import R420
import time  # Importa el módulo time para obtener la hora actual

nombres_tags = {
    "110000000000000000000305": "Kit 1",
    "110000000000000000000308": "Kit 2",
    "110000000000000000000306": "Kit 3",
    "110000000000000000000307": "Kit 3",
    "ad8a14004440b5874c000064": "Kit 1"
}

# Establecer la conexión a la base de datos MySQL
conexion = mysql.connector.connect(user='root', password='asdasd', host='localhost',
                                   database='PRUEBA', port='3306')

# Crear un cursor
cursor = conexion.cursor()

# Definir la consulta SQL para crear la tabla de la estación 1
sql_create_table_estacion1 = """
CREATE TABLE IF NOT EXISTS Estación_1 (Tag VARCHAR(25) NOT NULL,
  Nombre VARCHAR(25) NOT NULL,
  Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 1'
"""
# Definir la consulta SQL para crear la tabla de la estación 2
sql_create_table_estacion2 = """
CREATE TABLE IF NOT EXISTS Estación_2 (
  Tag VARCHAR(25) NOT NULL,
  Nombre VARCHAR(25) NOT NULL,
  Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 2'
"""

# Ejecutar la consulta SQL para crear la tabla de datos
cursor.execute(sql_create_table_estacion1)
cursor.execute(sql_create_table_estacion2)
conexion.commit()


# Conectar al lector RFID de la estación 1
reader_1 = R420('192.168.0.20')

# Conectar al lector RFID de la estación 2  
reader_2 = R420('192.168.0.21')

tags_detectados_1 = []
tags_detectados_2 = []


# Definir una función para obtener la hora actual formateada
def obtener_hora_actual():
    return time.strftime('%Y-%m-%d %H:%M:%S')

while True:
    # Obtener los tags que ya están en la tabla de la Estación 1
    cursor.execute("SELECT Tag FROM Estación_1")
    tags_en_tabla_1 = [row[0] for row in cursor.fetchall()]
        # Obtener los tags que ya están en la tabla de la Estación 1
    cursor.execute("SELECT Tag FROM Estación_2")
    tags_en_tabla_2 = [row[0] for row in cursor.fetchall()]

    # tags_detectados_1 = set()  # Conjunto para almacenar los tags detectados en la estación 1

    # Detectar tags con el lector RFID de la estación 1
    tags_1 = reader_1.detectTags(powerDBm=reader_1.power_table[-1], freqMHz=reader_1.freq_table[0], mode=1002, session=2, population=1, duration=0.5, searchmode=2)
    
    for tag_1 in tags_1:
        tag_id_1 = tag_1['EPC-96'].decode('utf-8')
        if tag_id_1 not in tags_detectados_1:
            tags_detectados_1.append(tag_id_1)
        print("Tag detectado en estación 1:", tags_detectados_1)

        # Verificar si el tag ya está en la tabla de la Estación 1
        if tag_id_1 not in tags_en_tabla_1:
            # El tag no está en la tabla, así que inserta una nueva entrada con la hora de entrada
            nombre_tag_1 = nombres_tags.get(tag_id_1, "No registrado")
            try:
                # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
                cursor.execute("INSERT INTO Estación_1 (Tag, Nombre, Hora_entrada) VALUES (%s, %s, %s)", (tag_id_1, nombre_tag_1, obtener_hora_actual()))
                conexion.commit()
                print(f"Tag '{tag_id_1}' insertado en la tabla de la Estación 1 con nombre '{nombre_tag_1}' y hora de entrada registrada.")
            except mysql.connector.Error as err:
                print("Error al insertar el tag en la tabla de la Estación 1:", err)
        # else:
            # El tag ya está en la tabla, así que agrega su ID al conjunto de tags detectados
            # tags_detectados_1.add(tag_id_1)

    tags_2 = reader_2.detectTags(powerDBm=reader_2.power_table[-1], freqMHz=reader_2.freq_table[0], mode=1002, session=2, population=1, duration=0.5, searchmode=2)
    # Obtener los tags que ya no están presentes en la estación 1 y registrar su hora de salida
    
    for tag_2 in tags_2:
        tag_id_2 = tag_2['EPC-96'].decode('utf-8')
        # Verificar si el tag ya está en la tabla de la Estación 1
        if tag_id_2 not in tags_en_tabla_2:
            # El tag no está en la tabla, así que inserta una nueva entrada con la hora de entrada
            nombre_tag_2 = nombres_tags.get(tag_id_2, "No registrado")
            try:
                # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
                cursor.execute("INSERT INTO Estación_2 (Tag, Nombre, Hora_entrada) VALUES (%s, %s, %s)", (tag_id_2, nombre_tag_2, obtener_hora_actual()))
                conexion.commit()
                print(f"Tag '{tag_id_2}' insertado en la tabla de la Estación 2 con nombre '{nombre_tag_2}' y hora de entrada registrada.")
            except mysql.connector.Error as err:
                print("Error al insertar el tag en la tabla de la Estación 2:", err)

        if tag_id_2 in tags_detectados_1:
            # El tag ya no está presente en la estación 1, así que registra la hora de salida
            try:
                cursor.execute("UPDATE Estación_1 SET Hora_salida = %s WHERE Tag = %s AND Hora_salida IS NULL", (obtener_hora_actual(), tag_id_2))
                conexion.commit()
                print(f"Se registró la hora de salida para el tag '{tag_id_2}' en la tabla de la Estación 1.")
            except mysql.connector.Error as err:
                print("Error al registrar la hora de salida para el tag en la tabla de la Estación 1:", err)