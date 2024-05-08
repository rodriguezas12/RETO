#ESTE CÓDIGO SERÁ UTILIZADO EN LAS ESTACIONES, 7 EN TOTAL 
#SERVIRÁ PARA TRACKEAR EN QUE ESTACIÓN SE ENCUENTRA EL PRODUCTO, ASÍ MISMO DECIR CUANTO LE TOMÓ PASAR DE UNA ESTACIÓN A OTRA

import mysql.connector
from reader import R420
import time  # Importa el módulo time para obtener la hora actual

nombres_tags = {
    "ad89180010d68d8b39000080": "Kit 1",
    "ad89180010d6958b3a000081": "Kit 1",
    "ad89180010d6a98c39000083": "Kit 1",
    "ad89180010d8e58d3a0000c6": "Kit 1",
    "ad89180010d98188390000d7": "Kit 1",
    "ad89180010d4b98d38000049": "Kit 2",
    "ad89180010d67d8b3900007d": "Kit 2",
    "ad89180010d6858a3900007f": "Kit 2",
    "ad89180010d6878a3900007e": "Kit 2",
    "ad89180010d7318b39000093": "Kit 2",
    "ad89180010d6a1883a000082": "Kit 3",
    "ad89180010d6c58c39000085": "Kit 3",
    "ad89180010d6d38a35000088": "Kit 3",
    "ad89180010d705873900008e": "Kit 3",
    "ad89180010d97d903a0000d8": "Kit 3",
    "ad89180010d6c3873c000086": "Kit 4",
    "ad89180010d6cb8e38000087": "Kit 4",
    "ad89180010d6fd8e3a00008d": "Kit 4",
    "ad89180010d94d8f390000d1": "Kit 4",
    "ad89180010dad5893b000000": "Kit 4",
    "ad89180010d6dd8a36000089": "Kit 5",
    "ad89180010d6e58c3600008a": "Kit 5",
    "ad89180010d6f58f3600008b": "Kit 5",
    "ad89180010d6ff8c3600008c": "Kit 5",
    "ad89180010d9318f3a0000cf": "Kit 5",
    "ad89180010d65b8d3800007a": "Kit 6",
    "ad89180010d6638f3900007b": "Kit 6",
    "ad89180010d66d8c3a00007c": "Kit 6",
    "ad89180010d7398a39000094": "Kit 6",
    "ad89180010dacd8c3a0000ff": "Kit 6"
}

# Establecer la conexión a la base de datos MySQL
conexion = mysql.connector.connect(user='admin', password='usuario123', host='db-retorfid.cdsc040qszy0.us-east-2.rds.amazonaws.com',
                                   database='RETORFID', port='3306')

# Crear un cursor
cursor = conexion.cursor()

# Definir la consulta SQL para crear la tabla de la estación 1
sql_create_table_estacion1 = """
CREATE TABLE IF NOT EXISTS Estación_1 (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  Tag VARCHAR(25) NOT NULL,
  Kit VARCHAR(25) NOT NULL,
  Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 1'
"""

sql_create_table_estacion2 = """
CREATE TABLE IF NOT EXISTS Estación_2 (
 ID INT AUTO_INCREMENT PRIMARY KEY,
  Tag VARCHAR(25) NOT NULL,
  Kit VARCHAR(25) NOT NULL,
  Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 2'
"""

sql_create_table_estacion3 = """
CREATE TABLE IF NOT EXISTS Estación_3 (ID INT AUTO_INCREMENT PRIMARY KEY,
 Tag VARCHAR(25) NOT NULL,
  Kit VARCHAR(25) NOT NULL,
  Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 3'
"""

sql_create_table_estacion4 = """
CREATE TABLE IF NOT EXISTS Estación_4 (ID INT AUTO_INCREMENT PRIMARY KEY, 
Tag VARCHAR(25) NOT NULL,
  Kit VARCHAR(25) NOT NULL,
  Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 4'
"""

sql_create_table_estacion5 = """
CREATE TABLE IF NOT EXISTS Estación_5 (ID INT AUTO_INCREMENT PRIMARY KEY,
Tag VARCHAR(25) NOT NULL,
  Kit VARCHAR(25) NOT NULL,
  Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 5'
"""

sql_create_table_estacion6 = """
CREATE TABLE IF NOT EXISTS Estación_6 (ID INT AUTO_INCREMENT PRIMARY KEY, 
Tag VARCHAR(25) NOT NULL,
  Kit VARCHAR(25) NOT NULL,
  Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 6'
"""

sql_create_table_estacion7 = """
CREATE TABLE IF NOT EXISTS Estación_7 (ID INT AUTO_INCREMENT PRIMARY KEY,
Tag VARCHAR(25) NOT NULL,
  Kit VARCHAR(25) NOT NULL,
  Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 7'
"""

sql_create_table_Eventos = """
CREATE TABLE IF NOT EXISTS Eventos (Tag VARCHAR(100) DEFAULT NULL,
ID VARCHAR(100) DEFAULT NULL,
Kit VARCHAR(100) DEFAULT NULL,
Estación VARCHAR(100) DEFAULT NULL,
Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de los Eventos'
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

cursor.execute(sql_create_table_Eventos)
conexion.commit()