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
# Definir la consulta SQL para crear la tabla de la estación 3
sql_create_table_estacion3 = """
CREATE TABLE IF NOT EXISTS Estación_3 (
  Tag VARCHAR(25) NOT NULL,
  Nombre VARCHAR(25) NOT NULL,
  Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 3'
"""
# Definir la consulta SQL para crear la tabla de la estación 4
sql_create_table_estacion4 = """
CREATE TABLE IF NOT EXISTS Estación_4 (
  Tag VARCHAR(25) NOT NULL,
  Nombre VARCHAR(25) NOT NULL,
  Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 4'
"""
# Definir la consulta SQL para crear la tabla de la estación 5
sql_create_table_estacion5 = """
CREATE TABLE IF NOT EXISTS Estación_5 (
  Tag VARCHAR(25) NOT NULL,
  Nombre VARCHAR(25) NOT NULL,
  Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 5'
"""
# Definir la consulta SQL para crear la tabla de la estación 6
sql_create_table_estacion6 = """
CREATE TABLE IF NOT EXISTS Estación_6 (
  Tag VARCHAR(25) NOT NULL,
  Nombre VARCHAR(25) NOT NULL,
  Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 6'
"""
# Definir la consulta SQL para crear la tabla de la estación 7
sql_create_table_estacion7 = """
CREATE TABLE IF NOT EXISTS Estación_7 (
  Tag VARCHAR(25) NOT NULL,
  Nombre VARCHAR(25) NOT NULL,
  Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 7'
"""

# Ejecutar la consulta SQL para crear la tabla de datos
cursor.execute(sql_create_table_estacion1)
cursor.execute(sql_create_table_estacion2)
cursor.execute(sql_create_table_estacion3)
cursor.execute(sql_create_table_estacion4)
cursor.execute(sql_create_table_estacion5)
cursor.execute(sql_create_table_estacion6)
cursor.execute(sql_create_table_estacion7)

conexion.commit()


# Conectar al lector RFID de la estación 1
reader_1 = R420('192.168.0.20')
reader_2 = R420('192.168.0.21')

# Conectar al lector RFID de la estación 2  
#reader_2 = R420('192.168.0.21')

tags_detectados_1 = []
tags_detectados_2 = []
tags_detectados_3 = []
tags_detectados_4 = []
tags_detectados_5 = []
tags_detectados_6 = []
tags_detectados_7 = []

a=0

# Definir una función para obtener la hora actual formateada
def obtener_hora_actual():
    return time.strftime('%Y-%m-%d %H:%M:%S')

while True:


    
    # Detectar tags con el lector RFID de las estaciones 1, 2 y 3
    tags_1 = reader_1.detectTags(powerDBm=reader_1.power_table[35], freqMHz=reader_1.freq_table[0], mode=1002, session=2, population=1, duration=0.2, searchmode=2)
    tags_2 = reader_2.detectTags(powerDBm=reader_1.power_table[35], freqMHz=reader_1.freq_table[0], mode=1002, session=2, population=1, duration=0.2, searchmode=2)

    

        
    for tag_1 in tags_1:
        tag_id_1 = tag_1['EPC-96'].decode('utf-8')            
        tag_antenna = tag_1['AntennaID']
        print("Tag: ",tag_id_1,"Estación: ",tag_antenna)
   
        if tag_1['AntennaID']==1: #ESTACIÓN 1
            # cursor.execute("SELECT Tag FROM Estación_1")
            # tags_en_tabla_1 = [row[0] for row in cursor.fetchall()]

            # Verificar si el tag ya está en la tabla de la Estación 1
            if tag_id_1 not in tags_detectados_1:
                tags_detectados_1.append(tag_id_1) 
                # El tag no está en la tabla, así que inserta una nueva entrada con la hora de entrada
                nombre_tag_1 = nombres_tags.get(tag_id_1, "No registrado")
                try:
                    # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
                    cursor.execute("INSERT INTO Estación_1 (Tag, Nombre, Hora_entrada) VALUES (%s, %s, %s)", (tag_id_1, nombre_tag_1, obtener_hora_actual()))
                    conexion.commit()
                    print(f"Tag '{tag_id_1}' insertado en la tabla de la Estación 1 con nombre '{nombre_tag_1}' y hora de entrada registrada.")
                except mysql.connector.Error as err:
                    print("Error al insertar el tag en la tabla de la Estación 1:", err)

        if tag_1['AntennaID']==2: #ESTACIÓN 2
            #cursor.execute("SELECT Tag FROM Estación_2")
            #tags_en_tabla_2 = [row[0] for row in cursor.fetchall()] #lista de tags almacenada en al estación 2 en MySQL

            if tag_id_1 not in tags_detectados_1 and tag_id_1 not in tags_detectados_2:
                print("ERROR DE SECUENCIA, por favor regrese a la estación anterior")
            #Almacenar el tag detectado a la lista de la estación 2 si no estaba almacenado previamente

            if tag_id_1 not in tags_detectados_2 and tag_id_1 in tags_detectados_1: #Lógica cuando un tag entra por primera vez a la estación 2
                # El tag no está en la tabla, así que inserta una nueva entrada con la hora de entrada
                tags_detectados_2.append(tag_id_1)
                tags_detectados_1.remove(tag_id_1)
                nombre_tag_1 = nombres_tags.get(tag_id_1, "No registrado")
                try:
                    # Insertar el tag en la tabla de la Estación 2 con la hora de entrada
                    cursor.execute("UPDATE Estación_1 SET Hora_salida = %s WHERE Tag = %s AND Hora_salida IS NULL", (obtener_hora_actual(), tag_id_1))
                    conexion.commit()
                    print(f"Se registró la hora de salida para el tag '{tag_id_1}' en la tabla de la Estación 1.")
                    cursor.execute("INSERT INTO Estación_2 (Tag, Nombre, Hora_entrada) VALUES (%s, %s, %s)", (tag_id_1, nombre_tag_1, obtener_hora_actual()))
                    conexion.commit()
                    print(f"Tag '{tag_id_1}' insertado en la tabla de la Estación 2 con nombre '{nombre_tag_1}' y hora de entrada registrada.")
                    
                except mysql.connector.Error as err:
                    print("Error al insertar el tag en la tabla de la Estación 2:", err)

        if tag_1['AntennaID']==3: #ESTACIÓN 3
            
            if tag_id_1 not in tags_detectados_2 and tag_id_1 not in tags_detectados_3:
                print("ERROR DE SECUENCIA, por favor regrese a la estación anterior")
            #Almacenar el tag detectado a la lista de la estación 2 si no estaba almacenado previamente

            if tag_id_1 not in tags_detectados_3 and tag_id_1 in tags_detectados_2: #Lógica cuando un tag entra por primera vez a la estación 2
                # El tag no está en la tabla, así que inserta una nueva entrada con la hora de entrada
                tags_detectados_3.append(tag_id_1)
                tags_detectados_2.remove(tag_id_1)
                nombre_tag_3 = nombres_tags.get(tag_id_1, "No registrado")
                try:
                    # Insertar el tag en la tabla de la Estación 2 con la hora de entrada
                    cursor.execute("UPDATE Estación_2 SET Hora_salida = %s WHERE Tag = %s AND Hora_salida IS NULL", (obtener_hora_actual(), tag_id_1))
                    conexion.commit()
                    print(f"Se registró la hora de salida para el tag '{tag_id_1}' en la tabla de la Estación 2.")
                    cursor.execute("INSERT INTO Estación_3 (Tag, Nombre, Hora_entrada) VALUES (%s, %s, %s)", (tag_id_1, nombre_tag_3, obtener_hora_actual()))
                    conexion.commit()
                    print(f"Tag '{tag_id_1}' insertado en la tabla de la Estación 3 con nombre '{nombre_tag_3}' y hora de entrada registrada.")
                    
                except mysql.connector.Error as err:
                    print("Error al insertar el tag en la tabla de la Estación 3:", err)
   
    for tag_2 in tags_2:
        

        tag_id_2 = tag_2['EPC-96'].decode('utf-8')            
        tag_antenna = tag_2['AntennaID']   
        print(tag_id_2)
        
         
        
        if tag_2['AntennaID']==1: #ESTACIÓN 4
            print("Tag: ",tag_id_2,"Estación: ",tag_antenna+3)
            if tag_id_2 not in tags_detectados_3 and tag_id_2 not in tags_detectados_4:
                print("ERROR DE SECUENCIA, por favor regrese a la estación anterior")
            #Almacenar el tag detectado a la lista de la estación 2 si no estaba almacenado previamente

            if tag_id_2 not in tags_detectados_4 and tag_id_2 in tags_detectados_3: #Lógica cuando un tag entra por primera vez a la estación 2
                # El tag no está en la tabla, así que inserta una nueva entrada con la hora de entrada
                tags_detectados_4.append(tag_id_2)
                tags_detectados_3.remove(tag_id_2)
                nombre_tag_4 = nombres_tags.get(tag_id_2, "No registrado")
                try:
                    # Insertar el tag en la tabla de la Estación 2 con la hora de entrada
                    cursor.execute("UPDATE Estación_3 SET Hora_salida = %s WHERE Tag = %s AND Hora_salida IS NULL", (obtener_hora_actual(), tag_id_2))
                    conexion.commit()
                    print(f"Se registró la hora de salida para el tag '{tag_id_2}' en la tabla de la Estación 3.")
                    cursor.execute("INSERT INTO Estación_4 (Tag, Nombre, Hora_entrada) VALUES (%s, %s, %s)", (tag_id_2, nombre_tag_4, obtener_hora_actual()))
                    conexion.commit()
                    print(f"Tag '{tag_id_2}' insertado en la tabla de la Estación 4 con nombre '{nombre_tag_4}' y hora de entrada registrada.")
                    
                except mysql.connector.Error as err:
                    print("Error al insertar el tag en la tabla de la Estación 4:", err)

        if tag_2['AntennaID']==9: #ESTACIÓN 5
            print("Tag: ",tag_id_2,"Estación: ",tag_antenna-4)
            if tag_id_2 not in tags_detectados_4  and tag_id_2 not in tags_detectados_5:
                print("ERROR DE SECUENCIA, por favor regrese a la estación anterior")
            #Almacenar el tag detectado a la lista de la estación 2 si no estaba almacenado previamente

            if tag_id_2 not in tags_detectados_5 and tag_id_2 in tags_detectados_4: #Lógica cuando un tag entra por primera vez a la estación 2
                # El tag no está en la tabla, así que inserta una nueva entrada con la hora de entrada
                tags_detectados_5.append(tag_id_2)
                tags_detectados_4.remove(tag_id_2)
                nombre_tags_4 = nombres_tags.get(tag_id_2, "No registrado")
                try:
                    # Insertar el tag en la tabla de la Estación 2 con la hora de entrada
                    cursor.execute("UPDATE Estación_4 SET Hora_salida = %s WHERE Tag = %s AND Hora_salida IS NULL", (obtener_hora_actual(), tag_id_2))
                    conexion.commit()
                    print(f"Se registró la hora de salida para el tag '{tag_id_2}' en la tabla de la Estación 4.")
                    cursor.execute("INSERT INTO Estación_5 (Tag, Nombre, Hora_entrada) VALUES (%s, %s, %s)", (tag_id_2, nombre_tags_4, obtener_hora_actual()))
                    conexion.commit()
                    print(f"Tag '{tag_id_2}' insertado en la tabla de la Estación 4 con nombre '{nombre_tags_4}' y hora de entrada registrada.")
                    
                except mysql.connector.Error as err:
                    print("Error al insertar el tag en la tabla de la Estación 5:", err)

        if tag_2['AntennaID']==17: #ESTACIÓN 6
            print("Tag: ",tag_id_2,"Estación: ",tag_antenna-11)
            if tag_id_2 not in tags_detectados_5  and tag_id_2 not in tags_detectados_6:
                print("ERROR DE SECUENCIA, por favor regrese a la estación anterior")
            #Almacenar el tag detectado a la lista de la estación 2 si no estaba almacenado previamente

            if tag_id_2 not in tags_detectados_6 and tag_id_2 in tags_detectados_5: #Lógica cuando un tag entra por primera vez a la estación 2
                # El tag no está en la tabla, así que inserta una nueva entrada con la hora de entrada
                tags_detectados_6.append(tag_id_2)
                tags_detectados_5.remove(tag_id_2)
                nombre_tags_6 = nombres_tags.get(tag_id_2, "No registrado")
                try:
                    # Insertar el tag en la tabla de la Estación 2 con la hora de entrada
                    cursor.execute("UPDATE Estación_5 SET Hora_salida = %s WHERE Tag = %s AND Hora_salida IS NULL", (obtener_hora_actual(), tag_id_2))
                    conexion.commit()
                    print(f"Se registró la hora de salida para el tag '{tag_id_2}' en la tabla de la Estación 5.")
                    cursor.execute("INSERT INTO Estación_6 (Tag, Nombre, Hora_entrada) VALUES (%s, %s, %s)", (tag_id_2, nombre_tags_6, obtener_hora_actual()))
                    conexion.commit()
                    print(f"Tag '{tag_id_2}' insertado en la tabla de la Estación 6 con nombre '{nombre_tags_6}' y hora de entrada registrada.")
                    
                except mysql.connector.Error as err:
                    print("Error al insertar el tag en la tabla de la Estación 6:", err)

        if tag_2['AntennaID']==25: #ESTACIÓN 7
 

            print("Tag: ",tag_id_2,"Estación: ",tag_antenna-18)
            if tag_id_2 not in tags_detectados_6 and tag_id_2 not in tags_detectados_7:
                print("ERROR DE SECUENCIA, por favor regrese a la estación anterior")
            #Almacenar el tag detectado a la lista de la estación 2 si no estaba almacenado previamente

            if tag_id_2 not in tags_detectados_7 and tag_id_2 in tags_detectados_6: #Lógica cuando un tag entra por primera vez a la estación 2
                # El tag no está en la tabla, así que inserta una nueva entrada con la hora de entrada
                tags_detectados_7.append(tag_id_2)
                tags_detectados_6.remove(tag_id_2)
                nombre_tags_7 = nombres_tags.get(tag_id_2, "No registrado")
                try:
                    # Insertar el tag en la tabla de la Estación 2 con la hora de entrada
                    cursor.execute("UPDATE Estación_6 SET Hora_salida = %s WHERE Tag = %s AND Hora_salida IS NULL", (obtener_hora_actual(), tag_id_2))
                    conexion.commit()
                    print(f"Se registró la hora de salida para el tag '{tag_id_2}' en la tabla de la Estación 6.")
                    cursor.execute("INSERT INTO Estación_7 (Tag, Nombre, Hora_entrada) VALUES (%s, %s, %s)", (tag_id_2, nombre_tags_7, obtener_hora_actual()))
                    conexion.commit()
                    print(f"Tag '{tag_id_2}' insertado en la tabla de la Estación 7 con nombre '{nombre_tags_7}' y hora de entrada registrada.")
                    
                except mysql.connector.Error as err:
                    print("Error al insertar el tag en la tabla de la Estación 6:", err)



            if tag_id_2 not in tags_detectados_7:
                a=a+1

            if tag_id_2 in tags_detectados_7:
                a=0

            if a==4:
                # El tag ya no está siendo detectado, por lo que se registra la hora de salida
                try:
                    cursor.execute("UPDATE Estación_7 SET Hora_salida = %s WHERE Tag = %s AND Hora_salida IS NULL", (obtener_hora_actual(), tag_id_2))
                    conexion.commit()
                    print(f"Registrada la hora de salida para el tag '{tag_id_2}'.")

                except mysql.connector.Error as err:
                    print("Error al actualizar la hora de salida en la tabla de la Estación 7:", err)
        

   
        
   