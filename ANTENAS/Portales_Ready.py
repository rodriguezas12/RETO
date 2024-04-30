import mysql.connector
from reader import R420
import time
import datetime

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
    "110000000000000000000305": "Kit 1",
    "110000000000000000000308": "Kit 2",
    "110000000000000000000306": "Kit 3",
    "110000000000000000000307": "Kit 3",
    "ad8a14004440b5874c000064": "Kit 1"
}
tags_detectados_IN = []
tags_detectados_OUT = []
tags_detectados_RACK= []
# Establecer la conexión a la base de datos MySQL
conexion = mysql.connector.connect(user='admin', password='usuario123', host='db-retorfid.cdsc040qszy0.us-east-2.rds.amazonaws.com',
                                   database='RETORFID', port='3306')


# Crear un cursor
cursor = conexion.cursor()

# Definir la consulta SQL para crear la tabla de datos si no existe
sql_create_table_datos = """
CREATE TABLE IF NOT EXISTS Datos (
  Tag VARCHAR(25) NOT NULL,
  Nombre TEXT NOT NULL,
  Cantidad INT NOT NULL, 
  Hora_entrada_lab TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida_lab TIMESTAMP DEFAULT NULL,
  INV ENUM('si', 'no') NOT NULL DEFAULT 'no', -- Nueva columna 'inv' con valores 'si' o 'no'
  PRIMARY KEY (Tag)
  
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

# Ejecutar la consulta SQL para crear la tabla de datos
cursor.execute(sql_create_table_datos)

# Ejecutar la consulta SQL para crear la tabla de contabilidad de kits
cursor.execute(sql_create_table_contabilidad_kits)

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

durationn=0.5

while True:
    # Detectar tags con el lector RFID de entrada
    tags_IN = reader_IN.detectTags(powerDBm=reader_IN.power_table[35], freqMHz=reader_IN.freq_table[0], mode=1001, session=2, population=1, duration=durationn, searchmode=2)
    for tag_IN in tags_IN:
        tag_id_IN = tag_IN['EPC-96'].decode('utf-8')
        print("Tag detectado en entrada:", tag_id_IN)
        
        nombre_IN = nombres_tags.get(tag_id_IN, "No registrado")
        hora_actual = obtener_hora_actual()
        cursor.execute("SELECT * FROM Datos WHERE Tag = %s", (tag_id_IN,))
        resultado = cursor.fetchone()
        
        if resultado:
            # Si la tag ya existe y tiene registrada una hora de salida, significa que está reingresando.
            if resultado[4] is not None:  # Asumiendo que el índice 4 es Hora_salida_lab
                # Resetear las horas relevantes y actualizar la entrada
                cursor.execute("""
                UPDATE Datos SET Nombre = %s, Cantidad = Cantidad + 1, Hora_entrada_lab = %s, Hora_salida_lab = NULL, Hora_entrada_bodega = NULL 
                WHERE Tag = %s""", (nombre_IN, hora_actual, tag_id_IN))
                print(f"Tag '{tag_id_IN}' ha reingresado y sus tiempos han sido reseteados.")
            else:
                # Si la hora de salida es NULL, es un error lógico, pues no debería detectarse entrada sin salida.
                print(f"Error: Tag '{tag_id_IN}' detectado en entrada sin registro de salida.")
        else:
            # Insertar la tag como nueva entrada si no existe previamente en la base de datos
            cursor.execute("INSERT INTO Datos (Tag, Nombre, Cantidad, Hora_entrada_lab) VALUES (%s, %s, 1, %s)", (tag_id_IN, nombre_IN, hora_actual))
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
            valores_datos_OUT = (tag_id_OUT, nombre_OUT, 1)
            try:
                # Verificar si el tag ya está en la base de datos
                cursor.execute("SELECT * FROM Datos WHERE Tag = %s", (tag_id_OUT,))
                if cursor.fetchone():  # El tag ya existe, actualizar el nombre
                    cursor.execute("UPDATE Datos SET Nombre = %s WHERE Tag = %s", (nombre_OUT, tag_id_OUT))
                else:  # El tag no existe, insertarlo
                    cursor.execute("INSERT INTO Datos (Tag, Nombre, Cantidad, Hora_salida_lab) VALUES (%s, %s, %s)", valores_datos_OUT)
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

