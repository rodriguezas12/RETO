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
conexion = mysql.connector.connect(user='root', password='123456', host='localhost',
                                   database='base_de_datos', port='3306')

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

sql_create_table_estacion2 = """
CREATE TABLE IF NOT EXISTS Estación_2 (Tag VARCHAR(25) NOT NULL,
  Nombre VARCHAR(25) NOT NULL,
  Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 2'
"""

sql_create_table_estacion3 = """
CREATE TABLE IF NOT EXISTS Estación_3 (Tag VARCHAR(25) NOT NULL,
  Nombre VARCHAR(25) NOT NULL,
  Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 3'
"""

sql_create_table_estacion4 = """
CREATE TABLE IF NOT EXISTS Estación_4 (Tag VARCHAR(25) NOT NULL,
  Nombre VARCHAR(25) NOT NULL,
  Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 4'
"""

sql_create_table_estacion5 = """
CREATE TABLE IF NOT EXISTS Estación_5 (Tag VARCHAR(25) NOT NULL,
  Nombre VARCHAR(25) NOT NULL,
  Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 5'
"""

sql_create_table_estacion6 = """
CREATE TABLE IF NOT EXISTS Estación_6 (Tag VARCHAR(25) NOT NULL,
  Nombre VARCHAR(25) NOT NULL,
  Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 6'
"""

sql_create_table_estacion7 = """
CREATE TABLE IF NOT EXISTS Estación_7 (Tag VARCHAR(25) NOT NULL,
  Nombre VARCHAR(25) NOT NULL,
  Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 7'
"""

# Ejecutar la consulta SQL para crear la tabla de datos
cursor.execute(sql_create_table_estacion1)
conexion.commit()

cursor.execute(sql_create_table_estacion2)
conexion.commit()

cursor.execute(sql_create_table_estacion3)
conexion.commit()

cursor.execute(sql_create_table_estacion4)
conexion.commit()

cursor.execute(sql_create_table_estacion5)
conexion.commit()

cursor.execute(sql_create_table_estacion6)
conexion.commit()

cursor.execute(sql_create_table_estacion7)
conexion.commit()

# Conectar al lector RFID de la estación 1 a la 3
reader_1 = R420('192.168.0.20')
reader_2 = R420('192.168.0.13')

antena_1 = []


# Definir una función para obtener la hora actual formateada
def obtener_hora_actual():
    return time.strftime('%Y-%m-%d %H:%M:%S')

while True:
    # Detectar tags con el lector RFID de la estación 1
    Lector_1 = reader_1.detectTags(powerDBm=reader_1.power_table[35], freqMHz=reader_1.freq_table[0], mode=1002, session=2, population=1, duration=0.5, searchmode=2)
    
    # Lista para almacenar los tags detectados en este ciclo
    tags_detectados = [tag['EPC-96'].decode('utf-8') for tag in Lector_1 if tag['AntennaID'] == 1]

    # Verificar si los tags previamente registrados en la tabla de la Estación 1 ya no están siendo detectados
    cursor.execute("SELECT Tag FROM Estación_1")
    tags_registrados = [registro[0] for registro in cursor.fetchall()]
    
    for tag_registrado in tags_registrados:
        if tag_registrado not in tags_detectados:
            # El tag ya no está siendo detectado, por lo que se registra la hora de salida
            try:
                cursor.execute("UPDATE Estación_1 SET Hora_salida = %s WHERE Tag = %s AND Hora_salida IS NULL", (obtener_hora_actual(), tag_registrado))
                conexion.commit()
                print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
            except mysql.connector.Error as err:
                print("Error al actualizar la hora de salida en la tabla de la Estación 1:", err)
    
    # Procesamiento de los tags detectados en este ciclo
    for tag_1 in Lector_1:
        if tag_1['AntennaID'] == 1:
            tags = tag_1['EPC-96'].decode('utf-8')
            # Asignación de nombre
            nombre_tag_1 = nombres_tags.get(tags, "No registrado")
            
            # Verificar si el tag ya está presente en la tabla de la Estación 1
            cursor.execute("SELECT Tag FROM Estación_1 WHERE Tag = %s", (tags,))
            resultado = cursor.fetchone()
            
            if resultado is None:
                # El tag no está presente en la tabla, entonces se inserta
                try:
                    # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
                    cursor.execute("INSERT INTO Estación_1 (Tag, Nombre, Hora_entrada) VALUES (%s, %s, %s)", (tags, nombre_tag_1, obtener_hora_actual()))
                    conexion.commit()
                    print(f"Tag '{tags}' insertado en la tabla de la Estación 1 con nombre '{nombre_tag_1}' y hora de entrada registrada.")
                except mysql.connector.Error as err:
                    print("Error al insertar el tag en la tabla de la Estación 1:", err)

    # Lista para almacenar los tags detectados en este ciclo
    tags_detectados2 = [tag['EPC-96'].decode('utf-8') for tag in Lector_1 if tag['AntennaID'] == 2]

    # Verificar si los tags previamente registrados en la tabla de la Estación 1 ya no están siendo detectados
    cursor.execute("SELECT Tag FROM Estación_1")
    tags_registrados2 = [registro[0] for registro in cursor.fetchall()]

    for tag_registrado2 in tags_registrados2:
        if tag_registrado2 not in tags_detectados2:
            # El tag ya no está siendo detectado, por lo que se registra la hora de salida
            try:
                cursor.execute("UPDATE Estación_2 SET Hora_salida = %s WHERE Tag = %s AND Hora_salida IS NULL", (obtener_hora_actual(), tag_registrado2))
                conexion.commit()
                print(f"Registrada la hora de salida para el tag '{tag_registrado2}'.")
            except mysql.connector.Error as err:
                print("Error al actualizar la hora de salida en la tabla de la Estación 2:", err)
    for tag_1 in Lector_1:
        if tag_1['AntennaID'] == 2:
            tags2 = tag_1['EPC-96'].decode('utf-8')
            # Asignación de nombre
            nombre_tag_2 = nombres_tags.get(tags2, "No registrado")
            
            # Verificar si el tag ya está presente en la tabla de la Estación 1
            cursor.execute("SELECT Tag FROM Estación_2 WHERE Tag = %s", (tags2,))
            resultado = cursor.fetchone()
            
            if resultado is None:
                # El tag no está presente en la tabla, entonces se inserta
                try:
                    # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
                    cursor.execute("INSERT INTO Estación_2 (Tag, Nombre, Hora_entrada) VALUES (%s, %s, %s)", (tags2, nombre_tag_2, obtener_hora_actual()))
                    conexion.commit()
                    print(f"Tag '{tags2}' insertado en la tabla de la Estación 2 con nombre '{nombre_tag_2}' y hora de entrada registrada.")
                except mysql.connector.Error as err:
                    print("Error al insertar el tag en la tabla de la Estación 2:", err)


    # Lista para almacenar los tags detectados en este ciclo
    tags_detectados3 = [tag['EPC-96'].decode('utf-8') for tag in Lector_1 if tag['AntennaID'] == 3]

    # Verificar si los tags previamente registrados en la tabla de la Estación 1 ya no están siendo detectados
    cursor.execute("SELECT Tag FROM Estación_3")###tenia 1
    tags_registrados3 = [registro[0] for registro in cursor.fetchall()]

    for tag_registrado3 in tags_registrados3:
        if tag_registrado3 not in tags_detectados3:
            # El tag ya no está siendo detectado, por lo que se registra la hora de salida
            try:
                cursor.execute("UPDATE Estación_3 SET Hora_salida = %s WHERE Tag = %s AND Hora_salida IS NULL", (obtener_hora_actual(), tag_registrado3))
                conexion.commit()
                print(f"Registrada la hora de salida para el tag '{tag_registrado3}'.")
            except mysql.connector.Error as err:
                print("Error al actualizar la hora de salida en la tabla de la Estación 3:", err)
    for tag_1 in Lector_1:
        if tag_1['AntennaID'] == 3:
            tags3 = tag_1['EPC-96'].decode('utf-8')
            # Asignación de nombre
            nombre_tag_3 = nombres_tags.get(tags3, "No registrado")
            
            # Verificar si el tag ya está presente en la tabla de la Estación 1
            cursor.execute("SELECT Tag FROM Estación_3 WHERE Tag = %s", (tags3,))
            resultado = cursor.fetchone()
            
            if resultado is None:
                # El tag no está presente en la tabla, entonces se inserta
                try:
                    # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
                    cursor.execute("INSERT INTO Estación_3 (Tag, Nombre, Hora_entrada) VALUES (%s, %s, %s)", (tags3, nombre_tag_3, obtener_hora_actual()))
                    conexion.commit()
                    print(f"Tag '{tags3}' insertado en la tabla de la Estación 3 con nombre '{nombre_tag_3}' y hora de entrada registrada.")
                except mysql.connector.Error as err:
                    print("Error al insertar el tag en la tabla de la Estación 3:", err)
##### 4 ultimas
    #Detectar tags con el lector RFID de la estación 4
    Lector_2 = reader_2.detectTags(powerDBm=reader_2.power_table[35], freqMHz=reader_2.freq_table[0], mode=1002, session=2, population=1, duration=0.5, searchmode=2)
    tags_detectados_4_1 = [tag['EPC-96'].decode('utf-8') for tag in Lector_2 if tag['AntennaID'] == 1]
    cursor.execute("SELECT Tag FROM Estación_4")
    tags_registrados_4_1 = [registro[0] for registro in cursor.fetchall()]

    for tag_registrado_4_1 in tags_registrados_4_1:
        if tag_registrado_4_1 not in tags_detectados_4_1:
            # El tag ya no está siendo detectado, por lo que se registra la hora de salida
            try:
                cursor.execute("UPDATE Estación_4 SET Hora_salida = %s WHERE Tag = %s AND Hora_salida IS NULL", (obtener_hora_actual(), tag_registrado_4_1))
                conexion.commit()
                print(f"Registrada la hora de salida para el tag '{tag_registrado_4_1}'.")
            except mysql.connector.Error as err:
                print("Error al actualizar la hora de salida en la tabla de la Estación 1:", err)
    for tag_4_1 in Lector_2:
        if tag_4_1['AntennaID'] == 1:
            tags_4 = tag_4_1['EPC-96'].decode('utf-8')
            # Asignación de nombre
            nombre_tag_4_1 = nombres_tags.get(tags_4, "No registrado")
            
            # Verificar si el tag ya está presente en la tabla de la Estación 1
            cursor.execute("SELECT Tag FROM Estación_4 WHERE Tag = %s", (tags_4,))
            resultado = cursor.fetchone()
            
            if resultado is None:
                # El tag no está presente en la tabla, entonces se inserta
                try:
                    # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
                    cursor.execute("INSERT INTO Estación_4 (Tag, Nombre, Hora_entrada) VALUES (%s, %s, %s)", (tags_4, nombre_tag_4_1, obtener_hora_actual()))
                    conexion.commit()
                    print(f"Tag '{tags_4}' insertado en la tabla de la Estación 4 con nombre '{nombre_tag_4_1}' y hora de entrada registrada.")
                except mysql.connector.Error as err:
                    print("Error al insertar el tag en la tabla de la Estación 4:", err)    
#####ESTACION 5
    tags_detectados_5_1 = [tag['EPC-96'].decode('utf-8') for tag in Lector_2 if tag['AntennaID'] == 9 ]
    cursor.execute("SELECT Tag FROM Estación_5")
    tags_registrados_5_1 = [registro[0] for registro in cursor.fetchall()]

    for tag_registrado_5_1 in tags_registrados_5_1:
        if tag_registrado_5_1 not in tags_detectados_5_1:
            # El tag ya no está siendo detectado, por lo que se registra la hora de salida
            try:
                cursor.execute("UPDATE Estación_5 SET Hora_salida = %s WHERE Tag = %s AND Hora_salida IS NULL", (obtener_hora_actual(), tag_registrado_5_1))
                conexion.commit()
                print(f"Registrada la hora de salida para el tag '{tag_registrado_5_1}'.")
            except mysql.connector.Error as err:
                print("Error al actualizar la hora de salida en la tabla de la Estación 5:", err)
    for tag_5_1 in Lector_2:
        if tag_5_1['AntennaID'] == 9 :
            tags_5 = tag_5_1['EPC-96'].decode('utf-8')
            # Asignación de nombre
            nombre_tag_5_1 = nombres_tags.get(tags_5, "No registrado")
            
            # Verificar si el tag ya está presente en la tabla de la Estación 1
            cursor.execute("SELECT Tag FROM Estación_5 WHERE Tag = %s", (tags_5,))
            resultado = cursor.fetchone()
            
            if resultado is None:
                # El tag no está presente en la tabla, entonces se inserta
                try:
                    # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
                    cursor.execute("INSERT INTO Estación_5 (Tag, Nombre, Hora_entrada) VALUES (%s, %s, %s)", (tags_5, nombre_tag_5_1, obtener_hora_actual()))
                    conexion.commit()
                    print(f"Tag '{tags_5}' insertado en la tabla de la Estación 5 con nombre '{nombre_tag_5_1}' y hora de entrada registrada.")
                except mysql.connector.Error as err:
                    print("Error al insertar el tag en la tabla de la Estación 5:", err)

##### ESTACION 6
    tags_detectados_6_1 = [tag['EPC-96'].decode('utf-8') for tag in Lector_2 if tag['AntennaID'] == 17]
    cursor.execute("SELECT Tag FROM Estación_6")
    tags_registrados_6_1 = [registro[0] for registro in cursor.fetchall()]

    for tag_registrado_6_1 in tags_registrados_6_1:
        if tag_registrado_6_1 not in tags_detectados_6_1:
            # El tag ya no está siendo detectado, por lo que se registra la hora de salida
            try:
                cursor.execute("UPDATE Estación_6 SET Hora_salida = %s WHERE Tag = %s AND Hora_salida IS NULL", (obtener_hora_actual(), tag_registrado_6_1))
                conexion.commit()
                print(f"Registrada la hora de salida para el tag '{tag_registrado_6_1}'.")
            except mysql.connector.Error as err:
                print("Error al actualizar la hora de salida en la tabla de la Estación 6:", err)
    for tag_6_1 in Lector_2:
        if tag_6_1['AntennaID'] == 17:
            tags_6 = tag_6_1['EPC-96'].decode('utf-8')
            # Asignación de nombre
            nombre_tag_6_1 = nombres_tags.get(tags_6, "No registrado")
            
            # Verificar si el tag ya está presente en la tabla de la Estación 1
            cursor.execute("SELECT Tag FROM Estación_6 WHERE Tag = %s", (tags_6,))
            resultado = cursor.fetchone()
            
            if resultado is None:
                # El tag no está presente en la tabla, entonces se inserta
                try:
                    # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
                    cursor.execute("INSERT INTO Estación_6 (Tag, Nombre, Hora_entrada) VALUES (%s, %s, %s)", (tags_6, nombre_tag_6_1, obtener_hora_actual()))
                    conexion.commit()
                    print(f"Tag '{tags_6}' insertado en la tabla de la Estación 6 con nombre '{nombre_tag_6_1}' y hora de entrada registrada.")
                except mysql.connector.Error as err:
                    print("Error al insertar el tag en la tabla de la Estación 6:", err)

### ESTACION 7
    tags_detectados_7_1 = [tag['EPC-96'].decode('utf-8') for tag in Lector_2 if tag['AntennaID'] == 25]
    cursor.execute("SELECT Tag FROM Estación_7")
    tags_registrados_7_1 = [registro[0] for registro in cursor.fetchall()]

    for tag_registrado_7_1 in tags_registrados_7_1:
        if tag_registrado_7_1 not in tags_detectados_7_1:
            # El tag ya no está siendo detectado, por lo que se registra la hora de salida
            try:
                cursor.execute("UPDATE Estación_7 SET Hora_salida = %s WHERE Tag = %s AND Hora_salida IS NULL", (obtener_hora_actual(), tag_registrado_7_1))
                conexion.commit()
                print(f"Registrada la hora de salida para el tag '{tag_registrado_7_1}'.")
            except mysql.connector.Error as err:
                print("Error al actualizar la hora de salida en la tabla de la Estación 7:", err)
    for tag_7_1 in Lector_2:
        if tag_7_1['AntennaID'] == 25:
            tags_7 = tag_7_1['EPC-96'].decode('utf-8')
            # Asignación de nombre
            nombre_tag_7_1 = nombres_tags.get(tags_7, "No registrado")
            
            # Verificar si el tag ya está presente en la tabla de la Estación 1
            cursor.execute("SELECT Tag FROM Estación_7 WHERE Tag = %s", (tags_7,))
            resultado = cursor.fetchone()
            
            if resultado is None:
                # El tag no está presente en la tabla, entonces se inserta
                try:
                    # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
                    cursor.execute("INSERT INTO Estación_7 (Tag, Nombre, Hora_entrada) VALUES (%s, %s, %s)", (tags_7, nombre_tag_7_1, obtener_hora_actual()))
                    conexion.commit()
                    print(f"Tag '{tags_7}' insertado en la tabla de la Estación 7 con nombre '{nombre_tag_7_1}' y hora de entrada registrada.")
                except mysql.connector.Error as err:
                    print("Error al insertar el tag en la tabla de la Estación 7:", err)


    # Lector_2 = reader_2.detectTags(powerDBm=reader_2.power_table[35], freqMHz=reader_2.freq_table[0], mode=1002, session=2, population=1, duration=0.5, searchmode=2)
    
    # # Lista para almacenar los tags detectados en este ciclo
    # tags_detectados_4 = [tag['EPC-96'].decode('utf-8') for tag in Lector_2 if tag['AntennaID'] == 4]

    # # Verificar si los tags previamente registrados en la tabla de la Estación 1 ya no están siendo detectados
    # cursor.execute("SELECT Tag FROM Estación_4")
    # tags_registrados_4 = [registro[0] for registro in cursor.fetchall()]
    
    # for tag_registrado_4 in tags_registrados_4:
    #     if tag_registrado_4 not in tags_detectados_4:
    #         # El tag ya no está siendo detectado, por lo que se registra la hora de salida
    #         try:
    #             cursor.execute("UPDATE Estación_4 SET Hora_salida = %s WHERE Tag = %s AND Hora_salida IS NULL", (obtener_hora_actual(), tag_registrado_4))
    #             conexion.commit()
    #             print(f"Registrada la hora de salida para el tag '{tag_registrado_4}'.")
    #         except mysql.connector.Error as err:
    #             print("Error al actualizar la hora de salida en la tabla de la Estación 4:", err)
    
    # # Procesamiento de los tags detectados en este ciclo
    # for tag_2 in Lector_2:
    #     if tag_2['AntennaID'] == 1:
    #         tags = tag_2['EPC-96'].decode('utf-8')
    #         # Asignación de nombre
    #         nombre_tag_2 = nombres_tags.get(tags, "No registrado")
            
    #         # Verificar si el tag ya está presente en la tabla de la Estación 1
    #         cursor.execute("SELECT Tag FROM Estación_4 WHERE Tag = %s", (tags,))
    #         resultado = cursor.fetchone()
            
    #         if resultado is None:
    #             # El tag no está presente en la tabla, entonces se inserta
    #             try:
    #                 # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
    #                 cursor.execute("INSERT INTO Estación_4 (Tag, Nombre, Hora_entrada) VALUES (%s, %s, %s)", (tags, nombre_tag_2, obtener_hora_actual()))
    #                 conexion.commit()
    #                 print(f"Tag '{tags}' insertado en la tabla de la Estación 4 con nombre '{nombre_tag_2}' y hora de entrada registrada.")
    #             except mysql.connector.Error as err:
    #                 print("Error al insertar el tag en la tabla de la Estación 4:", err)    