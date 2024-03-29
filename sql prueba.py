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

# Lista para almacenar los tags detectados
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

# Conectar al lector RFID
reader = R420('192.168.0.21')

while True:
    # Detectar tags con el lector RFID
    freqs = reader.freq_table
    powers = reader.power_table

    tags = reader.detectTags(powerDBm=powers[-1], freqMHz=freqs[0], mode=1002, session=2, population=1, duration=3, searchmode=2)
    for tag in tags:
        tag_id = tag['EPC-96'].decode('utf-8')
        print(tag_id)
        
        # Verificar si el tag ya ha sido detectado antes
        if tag_id not in tags_detectados:
            tags_detectados.append(tag_id)
            
            # Definir el nombre basado en el diccionario
            nombre = nombres_tags.get(tag_id, "No registrado")
            
            # Definir los valores para la inserción en la tabla de datos
            valores_datos = (tag_id, nombre, 1)
            
            try:
                # Verificar si el tag ya está en la base de datos
                cursor.execute("SELECT * FROM Datos WHERE Tag = %s", (tag_id,))
                if cursor.fetchone():  # El tag ya existe, actualizar el nombre
                    cursor.execute("UPDATE Datos SET Nombre = %s WHERE Tag = %s", (nombre, tag_id))
                else:  # El tag no existe, insertarlo
                    cursor.execute("INSERT INTO Datos (Tag, Nombre, Cantidad) VALUES (%s, %s, %s)", valores_datos)
                    
                # Actualizar la contabilidad de kits
                cursor.execute("UPDATE Contabilidad_Kits SET Cantidad = Cantidad + 1 WHERE Kit = %s", (nombre,))
                
                # Confirmar los cambios en la base de datos
                conexion.commit()
                print(f"Tag '{tag_id}' insertado/actualizado en la base de datos con nombre '{nombre}'.")
            except mysql.connector.Error as err:
                if err.errno == 1062:  # Error de clave duplicada
                    print(f"El tag '{tag_id}' ya existe en la base de datos.")
                    # Aquí puedes decidir qué hacer en caso de un tag duplicado,
                    # como actualizar el registro existente o ignorarlo.
                else:
                    print("Error al insertar/actualizar el tag:", err)

# Cerrar el cursor y la conexión
cursor.close()
conexion.close()
