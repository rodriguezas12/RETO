import mysql.connector
from reader import R420

# Diccionario para asignar nombres a los tags
nombres_tags = {
    "110000000000000000000305": "Kit 1",
    "110000000000000000000308": "Kit 2",
    "110000000000000000000306": "Kit 3",
    "110000000000000000000307": "Kit 3",
    "ad8a14004440b5874c000064": "Kit 1"
}
tags_detectados = []
# Establecer la conexión a la base de datos MySQL
conexion = mysql.connector.connect(user='root', password='123456', host='localhost',
                                   database='base_de_datos', port='3306')

# Crear un cursor
cursor = conexion.cursor()

# Definir la consulta SQL para crear la tabla de datos si no existe
sql_create_table_datos = """
CREATE TABLE IF NOT EXISTS Datos (
  Tag VARCHAR(25) NOT NULL,
  Nombre TEXT NOT NULL,
  Cantidad INT NOT NULL,
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

# Conectar al lector RFID de entrada
reader_IN = R420('192.168.0.21')

# Conectar al lector RFID de salida
reader_OUT = R420('192.168.0.20')

while True:
    # Detectar tags con el lector RFID de entrada
    tags_IN = reader_IN.detectTags(powerDBm=reader_IN.power_table[-1], freqMHz=reader_IN.freq_table[0], mode=1002, session=2, population=1, duration=3, searchmode=2)
    for tag_IN in tags_IN:
        tag_id_IN = tag_IN['EPC-96'].decode('utf-8')
        print("Tag detectado en entrada:", tag_id_IN)
        # Verificar si el tag ya ha sido detectado antes
        if tag_id_IN not in tags_detectados:
            tags_detectados.append(tag_id_IN)
            # Definir el nombre basado en el diccionario
            nombre_IN = nombres_tags.get(tag_id_IN, "No registrado")
            # Definir los valores para la inserción en la tabla de datos
            valores_datos_IN = (tag_id_IN, nombre_IN, 1)
            try:
                # Verificar si el tag ya está en la base de datos
                cursor.execute("SELECT * FROM Datos WHERE Tag = %s", (tag_id_IN,))
                if cursor.fetchone():  # El tag ya existe, actualizar el nombre
                    cursor.execute("UPDATE Datos SET Nombre = %s WHERE Tag = %s", (nombre_IN, tag_id_IN))
                else:  # El tag no existe, insertarlo
                    cursor.execute("INSERT INTO Datos (Tag, Nombre, Cantidad) VALUES (%s, %s, %s)", valores_datos_IN)
                # Actualizar la contabilidad de kits
                cursor.execute("UPDATE Contabilidad_Kits SET Cantidad = Cantidad + 1 WHERE Kit = %s", (nombre_IN,))
                # Confirmar los cambios en la base de datos
                conexion.commit()
                print(f"Tag '{tag_id_IN}' insertado/actualizado en la base de datos con nombre '{nombre_IN}' (entrada).")
            except mysql.connector.Error as err:
                if err.errno == 1062:  # Error de clave duplicada
                    print(f"El tag '{tag_id_IN}' ya existe en la base de datos.")
                    # Aquí puedes decidir qué hacer en caso de un tag duplicado,
                    # como actualizar el registro existente o ignorarlo.
                else:
                    print("Error al insertar/actualizar el tag (entrada):", err)

    # Detectar tags con el lector RFID de salida
    tags_OUT = reader_OUT.detectTags(powerDBm=reader_OUT.power_table[-1], freqMHz=reader_OUT.freq_table[0], mode=1002, session=2, population=1, duration=3, searchmode=2)
    for tag_OUT in tags_OUT:
        tag_id_OUT = tag_OUT['EPC-96'].decode('utf-8')
        print("Tag detectado en salida:", tag_id_OUT)
        # Verificar si el tag ya ha sido detectado antes
        if tag_id_OUT in tags_detectados:
            # Obtener el nombre del kit correspondiente al tag
            nombre_OUT = nombres_tags.get(tag_id_OUT, "No registrado")
            try:
                # Actualizar la contabilidad de kits restando 1 a la cantidad
                cursor.execute("UPDATE Contabilidad_Kits SET Cantidad = Cantidad - 1 WHERE Kit = %s", (nombre_OUT,))
                # Confirmar los cambios en la base de datos
                conexion.commit()
                print(f"Tag '{tag_id_OUT}' detectado en salida. Se ha restado 1 al kit '{nombre_OUT}' en la contabilidad.")
            except mysql.connector.Error as err:
                print("Error al actualizar la contabilidad de kits (salida):", err)

# Cerrar el cursor y la conexión
cursor.close()
conexion.close()
