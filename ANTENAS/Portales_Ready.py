import mysql.connector
from reader import R420
import time
import datetime
import re

# Diccionario para almacenar la última detección de cada tag en bodega
ultima_deteccion_bodega = {}

def tiempo_suficiente_ultima_deteccion(tag_id, tiempo_actual):
    if tag_id not in ultima_deteccion_bodega:
        return True
    ultima_deteccion = ultima_deteccion_bodega[tag_id]
    diferencia = tiempo_actual - ultima_deteccion
    return diferencia.total_seconds() > 10  # Retardo de 10 segundos


# Diccionario para asignar nombres a los tags
nombres_tags = {
    "ad89180010d68d8b39000080": "Kit 1", #ID 1
    "ad89180010d6958b3a000081": "Kit 1", #ID 2
    "ad89180010d6a98c39000083": "Kit 1", #ID 3
    "ad89180010d8e58d3a0000c6": "Kit 1", #ID 4
    "ad89180010d98188390000d7": "Kit 1", #ID 5
    "ad89180010d4b98d38000049": "Kit 2", #ID 1
    "ad89180010d67d8b3900007d": "Kit 2", #ID 2
    "ad89180010d6858a3900007f": "Kit 2", #ID 3
    "ad89180010d6878a3900007e": "Kit 2", #ID 4
    "ad89180010d7318b39000093": "Kit 2", #ID 5
    "ad89180010d6a1883a000082": "Kit 3", #ID 1
    "ad89180010d6c58c39000085": "Kit 3", #ID 2
    "ad89180010d6d38a35000088": "Kit 3", #ID 3
    "ad89180010d705873900008e": "Kit 3", #ID 4
    "ad89180010d97d903a0000d8": "Kit 3", #ID 5
    "ad89180010d6c3873c000086": "Kit 4", #ID 1
    "ad89180010d6cb8e38000087": "Kit 4", #ID 2
    "ad89180010d6fd8e3a00008d": "Kit 4", #ID 3
    "ad89180010d94d8f390000d1": "Kit 4", #ID 4
    "ad89180010dad5893b000000": "Kit 4", #ID 5
    "ad89180010d6dd8a36000089": "Kit 5", #ID 1
    "ad89180010d6e58c3600008a": "Kit 5", #ID 2
    "ad89180010d6f58f3600008b": "Kit 5", #ID 3
    "ad89180010d6ff8c3600008c": "Kit 5", #ID 4
    "ad89180010d9318f3a0000cf": "Kit 5", #ID 5
    "ad89180010d65b8d3800007a": "Kit 6", #ID 1
    "ad89180010d6638f3900007b": "Kit 6", #ID 2
    "ad89180010d66d8c3a00007c": "Kit 6", #ID 3
    "ad89180010d7398a39000094": "Kit 6", #ID 4
    "ad89180010dacd8c3a0000ff": "Kit 6" #ID 5
}

tags_detectados_IN = []
tags_detectados_OUT = []
tags_detectados_RACK= []
# Establecer la conexión a la base de datos MySQL
conexion = mysql.connector.connect(user='admin', password='usuario123', host='db-retorfid.cdsc040qszy0.us-east-2.rds.amazonaws.com',
                                   database='RETORFID', port='3306')

# conexion = mysql.connector.connect(user='root', password='asdasd', host='localhost',
#                                    database='prueba', port='3306')

# Crear un cursor
cursor = conexion.cursor()

# Definir la consulta SQL para crear la tabla de datos si no existe
sql_create_table_datos = """
CREATE TABLE IF NOT EXISTS Datos (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  Tag VARCHAR(25) UNIQUE,
  Nombre TEXT,
  Bahia INT NOT NULL,
  Cantidad INT NOT NULL, 
  Hora_entrada_lab TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida_lab TIMESTAMP DEFAULT NULL,
  Hora_entrada_bodega TIMESTAMP DEFAULT NULL,
  Hora_salida_bodega TIMESTAMP DEFAULT NULL,
  INV ENUM('SI', 'NO') NOT NULL DEFAULT 'NO' 
) COMMENT 'Base de datos de los tags'
"""

# Definir la consulta SQL para crear la tabla de contabilidad de kits si no existe
sql_create_table_contabilidad_kits = """
CREATE TABLE IF NOT EXISTS Contabilidad_Kits (
  Kit VARCHAR(25) NOT NULL,
  Cantidad INT NOT NULL,
  PRIMARY KEY (Kit)
) COMMENT 'Contabilidad de los kits'
"""

sql_create_table_dropeo = """
CREATE TABLE IF NOT EXISTS dropeo (
  id INT AUTO_INCREMENT,
  dropp VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT 'tabla de solicitud';
"""

sql_insert_first_row_if_empty = """
INSERT INTO dropeo (dropp)
SELECT ''
WHERE NOT EXISTS (SELECT 1 FROM dropeo);
"""

cursor.execute(sql_create_table_dropeo)
conexion.commit()

cursor.execute(sql_insert_first_row_if_empty)
conexion.commit()

cursor.execute(sql_create_table_datos)
conexion.commit()

cursor.execute(sql_create_table_contabilidad_kits)
conexion.commit()

# Verificar si la tabla de contabilidad está vacía
cursor.execute("SELECT COUNT(*) FROM Contabilidad_Kits")
num_rows = cursor.fetchone()[0]
if num_rows == 0:
    # Definir los valores predeterminados para la tabla de contabilidad de kits
    valores_contabilidad_kits = [
        ("Kit 1", 0),
        ("Kit 2", 0),
        ("Kit 3", 0),
        ("No registrado", 0)
    ]
    # Insertar los valores predeterminados en la tabla de contabilidad de kits
    cursor.executemany("INSERT INTO Contabilidad_Kits (Kit, Cantidad) VALUES (%s, %s)", valores_contabilidad_kits)

# Confirmar los cambios en la base de datos
conexion.commit()

try:
    # Intenta agregar la columna sin la condición IF NOT EXISTS
    cursor.execute("""
    ALTER TABLE Datos
    ADD COLUMN Hora_entrada_bodega TIMESTAMP DEFAULT NULL
    """)
    conexion.commit()
except mysql.connector.Error as err:
    # Captura el error si la columna ya existe
    if err.errno == 1060:  # Error 1060 es 'Duplicate column name'
        print("La columna 'Hora_entrada_bodega' ya existe.")
    else:
        raise  # Propaga otros errores que no sean específicos de columna duplicada


try:
    cursor.execute("""
    ALTER TABLE Datos
    ADD COLUMN Hora_salida_bodega TIMESTAMP DEFAULT NULL
    """)
    conexion.commit()
except mysql.connector.Error as err:
    if err.errno == 1060:  # Error 1060 es 'Duplicate column name'
        print("La columna 'Hora_salida_bodega' ya existe.")
    else:
        raise


###############
#LECTORES RFID#
############### 
reader_IN = R420('192.168.0.44')
reader_OUT = R420('192.168.0.42')
reader_RACK = R420('192.168.0.20')

# Definir una función para obtener la hora actual formateada
def obtener_hora_actual():
    return time.strftime('%Y-%m-%d %H:%M:%S')

def extract_number_from_string(drop_kit):

    match = re.search(r'\d+', str(drop_kit))
    if match:
        return match.group(0)
    else:
        return None

durationn=0.5

while True:
    # Detectar tags con el lector RFID de entrada
    tags_IN = reader_IN.detectTags(powerDBm=reader_IN.power_table[35], freqMHz=reader_IN.freq_table[0], mode=1001, session=2, population=1, duration=durationn, searchmode=2)
    for tag_IN in tags_IN:
        tag_id_IN = tag_IN['EPC-96'].decode('utf-8')
        nombre_IN = nombres_tags.get(tag_id_IN, "No registrado")
        hora_actual = obtener_hora_actual()
        cursor.execute("SELECT * FROM Datos WHERE Tag = %s", (tag_id_IN,))
        resultado = cursor.fetchone()
        if resultado:
            # Si la tag ya existe y tiene registrada una hora de salida, significa que está reingresando.
            if resultado[6] is not None:  # Asumiendo que el índice 6 es Hora_salida_lab
                # Resetear las horas relevantes y actualizar la entrada
                cursor.execute("""
                UPDATE Datos 
                SET Cantidad = Cantidad, 
                    Hora_entrada_lab = %s, 
                    Hora_salida_lab = NULL, 
                    Hora_entrada_bodega = NULL 
                WHERE Tag = %s""", (hora_actual, tag_id_IN))
                print(f"Tag '{tag_id_IN}' ha reingresado y sus tiempos han sido reseteados.")
            else:
                # Si la hora de salida es NULL, es un error lógico, pues no debería detectarse entrada sin salida.
                print(f"Error: Tag '{tag_id_IN}' detectado en entrada sin registro de salida.")
        else:
            # Insertar la tag como nueva entrada si no existe previamente en la base de datos
            cursor.execute("INSERT INTO Datos (Tag, Bahia, Cantidad, Hora_entrada_lab) VALUES (%s, 0, 1, %s)", (tag_id_IN, hora_actual))
            print(f"Nueva tag '{tag_id_IN}' registrada en entrada.")
    
    conexion.commit()



    # Detectar tags con el lector RFID de salida
    tags_OUT = reader_OUT.detectTags(powerDBm=reader_OUT.power_table[35], freqMHz=reader_OUT.freq_table[0], mode=1001, session=2, population=1, duration=durationn, searchmode=2)
    for tag_OUT in tags_OUT:
        tag_id_OUT = tag_OUT['EPC-96'].decode('utf-8')
        print("Tag detectado en entrada:", tag_id_OUT)
        # Verificar si el tag ya ha sido detectado antes
        if tag_id_OUT not in tags_detectados_OUT:
            tags_detectados_OUT.append(tag_id_OUT)
            # Definir el nombre basado en el diccionario
            nombre_OUT = nombres_tags.get(tag_id_OUT, "No registrado")
            # Definir los valores para la inserción en la tabla de datos
            valores_datos_OUT = (tag_id_OUT, 1)
            try:
                # Verificar si el tag ya está en la base de datos
                cursor.execute("SELECT * FROM Datos WHERE Tag = %s", (tag_id_OUT,))
                if cursor.fetchone():  # El tag ya existe, actualizar el nombre
                    cursor.execute("UPDATE Datos SET Nombre = %s WHERE Tag = %s", ("", tag_id_OUT))
                else:  # El tag no existe, insertarlo CAMBIOOOOOOOOOOOOO
                    cursor.execute("INSERT INTO Datos (Tag, Cantidad, Hora_salida_lab) VALUES (%s, %s)", valores_datos_OUT)
                # Actualizar la contabilidad de kits
                cursor.execute("UPDATE Contabilidad_Kits SET Cantidad = Cantidad - 1 WHERE Kit = %s", (nombre_OUT,))
                # Confirmar los cambios en la base de datos
                conexion.commit()
                print(f"Tag '{tag_id_OUT}' insertado/actualizado en la base de datos con nombre '{nombre_OUT}' (entrada).")
            except mysql.connector.Error as err:
                if err.errno == 1062:  # Error de clave duplicada
                    print(f"El tag '{tag_id_OUT}' ya existe en la base de datos.")
                    # Aquí puedes decidir qué hacer en caso de un tag duplicado,
                    # como actualizar el registro existente o ignorarlo.
                else:
                    print("Error al insertar/actualizar el tag (entrada):", err)  
            
    tags_RACK = reader_RACK.detectTags(powerDBm=reader_RACK.power_table[35], freqMHz=reader_RACK.freq_table[0], mode=1001, session=2, population=1, duration=durationn, searchmode=2)
    for tag_RACK in tags_RACK:
        tag_id_RACK = tag_RACK['EPC-96'].decode('utf-8')
        tiempo_actual = datetime.datetime.now()
        print("Tag detectado en bodega:", tag_id_RACK)
        
        if tiempo_suficiente_ultima_deteccion(tag_id_RACK, tiempo_actual):
            cursor.execute("SELECT Hora_entrada_bodega, Hora_salida_bodega FROM Datos WHERE Tag = %s", (tag_id_RACK,))
            tag_info = cursor.fetchone()
            
            if tag_info:
                if tag_info[0] is not None and tag_info[1] is None:  # Hora de entrada y salida bodega
                    cursor.execute("UPDATE Datos SET Hora_salida_bodega = %s WHERE Tag = %s", (obtener_hora_actual(), tag_id_RACK))
                    print(f"Tag '{tag_id_RACK}' hora de salida de la bodega registrada.")
                elif tag_info[0] is None:
                    cursor.execute("UPDATE Datos SET Hora_entrada_bodega = %s WHERE Tag = %s", (obtener_hora_actual(), tag_id_RACK))
                    print(f"Tag '{tag_id_RACK}' hora de entrada a la bodega registrada.")
            else:
                print(f"Tag '{tag_id_RACK}' no registrado en la base de datos.")
            ultima_deteccion_bodega[tag_id_RACK] = tiempo_actual
        else:
            print(f"Tag '{tag_id_RACK}' detectado nuevamente demasiado pronto; no se actualiza la salida.")
        conexion.commit()
       

        


    for tag_OUT in tags_OUT:
        tag_id_OUT = tag_OUT['EPC-96'].decode('utf-8')
        if tag_id_OUT in tags_detectados_OUT:
            cursor.execute("UPDATE Datos SET Hora_salida_lab = %s WHERE Tag = %s", (obtener_hora_actual(), tag_id_OUT))
            conexion.commit()
    

     
        
    #################
    cursor.execute("""
    SELECT COUNT(*) FROM Datos
    WHERE Nombre = 'Kit 1' AND Hora_entrada_bodega IS NOT NULL AND Hora_salida_bodega IS NULL
    """)
    cantidad_kit1_disponible = cursor.fetchone()[0]
    print(f"Cantidad de 'Kit 1' disponible en bodega: {cantidad_kit1_disponible}")
    #####################
    cursor.execute("""
    SELECT COUNT(*) FROM Datos
    WHERE Nombre = 'Kit 2' AND Hora_entrada_bodega IS NOT NULL AND Hora_salida_bodega IS NULL
    """)
    cantidad_kit2_disponible = cursor.fetchone()[0]
    print(f"Cantidad de 'Kit 2' disponible en bodega: {cantidad_kit2_disponible}")
   ############
    cursor.execute("""
    SELECT COUNT(*) FROM Datos
    WHERE Nombre = 'Kit 3' AND Hora_entrada_bodega IS NOT NULL AND Hora_salida_bodega IS NULL
    """)
    cantidad_kit3_disponible = cursor.fetchone()[0]
    print(f"Cantidad de 'Kit 3' disponible en bodega: {cantidad_kit3_disponible}")
    #################
    cursor.execute("""
    SELECT COUNT(*) FROM Datos
    WHERE Nombre = 'Kit 4' AND Hora_entrada_bodega IS NOT NULL AND Hora_salida_bodega IS NULL
    """)
    cantidad_kit4_disponible = cursor.fetchone()[0]
    print(f"Cantidad de 'Kit 4' disponible en bodega: {cantidad_kit4_disponible}")
       ############
    cursor.execute("""
    SELECT COUNT(*) FROM Datos
    WHERE Nombre = 'Kit 5' AND Hora_entrada_bodega IS NOT NULL AND Hora_salida_bodega IS NULL
    """)
    cantidad_kit5_disponible = cursor.fetchone()[0]
    print(f"Cantidad de 'Kit 5' disponible en bodega: {cantidad_kit5_disponible}")
    #################
    cursor.execute("""
    SELECT COUNT(*) FROM Datos
    WHERE Nombre = 'Kit 6' AND Hora_entrada_bodega IS NOT NULL AND Hora_salida_bodega IS NULL
    """)
    cantidad_kit6_disponible = cursor.fetchone()[0]
    print(f"Cantidad de 'Kit 6' disponible en bodega: {cantidad_kit6_disponible}")



    ############
    # Verifica cuántos registros cumplirían con la condición antes de la actualización a 'SI'

    cursor.execute("""
        SELECT Nombre FROM Datos
        WHERE Hora_entrada_bodega IS NOT NULL AND Hora_salida_bodega IS NULL AND INV = 'NO'
    """)
    resultado = cursor.fetchone()
    cursor.fetchall()
    print("resultado", resultado)
    if resultado:
        
        nombre_dropp = resultado[0]
        nombre_dropp = extract_number_from_string(nombre_dropp)
        cursor.execute("SELECT dropp FROM dropeo")
        rows = cursor.fetchone()  # Obtener todos los resultados de la consulta
        
        drops_registrados = [registro[0] for registro in cursor.fetchall()]
        #cursor.fetchall()

        try:

            # Verificar si el valor ya existe en la tabla 'dropeo'
            cursor.execute("SELECT COUNT(*) FROM dropeo WHERE dropp = %s", (nombre_dropp,))
            count = cursor.fetchone()
            if count is not None:
                count = count[0]
            else:
                count = 0
        
        except Exception as e:
            print(f"lol1: {e}")

            
        print("nombre_dropp= ", nombre_dropp)
        print("drops_registrados= ", drops_registrados)

        # Evitar resultados no leídos
        cursor.fetchall()

        if nombre_dropp in drops_registrados:  # Si el valor no existe, insertarlo
            print(f"El valor '{nombre_dropp}' ya existe en la tabla 'dropeo'. No se ha insertado nuevamente.")
        else:
            cursor.execute("INSERT INTO dropeo (dropp) VALUES (%s)", (nombre_dropp,))
            print("el valor se registro en dropp existosamente")
            conexion.commit()
            
            primer_si_detectado = True
        

        
        # Verificar si hay registros para actualizar a 'SI'
        cursor.execute("""
            SELECT COUNT(*) FROM Datos
            WHERE Hora_entrada_bodega IS NOT NULL AND Hora_salida_bodega IS NULL
        """)

        count = cursor.fetchone()
        try:
            if count is not None:
                count = count[0]
            else:
                count = 0  
            print(count)
        
        except Exception as e:
            print(f"lol2: {e}")

    # Si count es mayor que 0, realiza la actualización a 'SI'
    if count > 0:
        cursor.execute("""
            UPDATE Datos
            SET INV = 'SI'
            WHERE Hora_entrada_bodega IS NOT NULL AND Hora_salida_bodega IS NULL
        """)
        conexion.commit()
        print("INV actualizado a 'SI' para registros en bodega.")
    else:
        print("No hay registros para actualizar a 'SI'.")

    # Ahora verifica cuántos registros deberían ser actualizados a 'NO'
    cursor.execute("""
        SELECT COUNT(*) FROM Datos
        WHERE Hora_entrada_bodega IS NOT NULL AND Hora_salida_bodega IS NOT NULL
    """)
    count_no = cursor.fetchone()[0]
    print(f"Registros a actualizar a 'NO': {count_no}")

    # Si count_no es mayor que 0, realiza la actualización a 'NO'
    if count_no > 0:
        cursor.execute("""
            UPDATE Datos
            SET INV = 'NO'
            WHERE Hora_entrada_bodega IS NOT NULL AND Hora_salida_bodega IS NOT NULL
        """)
        conexion.commit()
        print("INV actualizado a 'NO' para registros con salida de bodega.")
    else:
        print("No hay registros para actualizar a 'NO'.")