#ESTE CÓDIGO SERÁ UTILIZADO EN LAS ESTACIONES, 7 EN TOTAL 
#SERVIRÁ PARA TRACKEAR EN QUE ESTACIÓN SE ENCUENTRA EL PRODUCTO, ASÍ MISMO DECIR CUANTO LE TOMÓ PASAR DE UNA ESTACIÓN A OTRA

import mysql.connector
from reader import R420
import time  # Importa el módulo time para obtener la hora actual
from datetime import datetime

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

# conexion = mysql.connector.connect(user='root', password='asdasd', host='localhost',
#                                    database='prueba', port='3306')

# Crear un cursor
cursor = conexion.cursor()

# Definir la consulta SQL para crear la tabla de la estación 1
sql_create_table_estacion1 = """
CREATE TABLE IF NOT EXISTS Estación_1 (
ID INT AUTO_INCREMENT PRIMARY KEY,
Tag VARCHAR(25) NOT NULL,
Kit VARCHAR(25) DEFAULT NULL,
modo VARCHAR(25) DEFAULT NULL,
Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 1'
"""

sql_create_table_estacion2 = """
CREATE TABLE IF NOT EXISTS Estación_2 (
ID INT AUTO_INCREMENT PRIMARY KEY,
Tag VARCHAR(25) NOT NULL,
Kit VARCHAR(25) NOT NULL,
modo VARCHAR(25) NOT NULL,
Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 2'
"""

sql_create_table_estacion3 = """
CREATE TABLE IF NOT EXISTS Estación_3 (ID INT AUTO_INCREMENT PRIMARY KEY,
Tag VARCHAR(25) NOT NULL,
Kit VARCHAR(25) NOT NULL,
modo VARCHAR(25) NOT NULL,
Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 3'
"""

sql_create_table_estacion4 = """
CREATE TABLE IF NOT EXISTS Estación_4 (ID INT AUTO_INCREMENT PRIMARY KEY, 
Tag VARCHAR(25) NOT NULL,
Kit VARCHAR(25) NOT NULL,
modo VARCHAR(25) NOT NULL,
Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 4'
"""

sql_create_table_estacion5 = """
CREATE TABLE IF NOT EXISTS Estación_5 (ID INT AUTO_INCREMENT PRIMARY KEY,
Tag VARCHAR(25) NOT NULL,
Kit VARCHAR(25) NOT NULL,
modo VARCHAR(25) NOT NULL,
Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 5'
"""

sql_create_table_estacion6 = """
CREATE TABLE IF NOT EXISTS Estación_6 (ID INT AUTO_INCREMENT PRIMARY KEY, 
Tag VARCHAR(25) NOT NULL,
Kit VARCHAR(25) NOT NULL,
modo VARCHAR(25) NOT NULL,
Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 6'
"""

sql_create_table_estacion7 = """
CREATE TABLE IF NOT EXISTS Estación_7 (ID INT AUTO_INCREMENT PRIMARY KEY,
Tag VARCHAR(25) NOT NULL,
Kit VARCHAR(25) NOT NULL,
modo VARCHAR(25) NOT NULL,
Hora_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
Hora_salida TIMESTAMP DEFAULT NULL
) COMMENT 'Base de datos de la estación 7'
"""

sql_create_table_Eventos = """
CREATE TABLE IF NOT EXISTS Eventos (
id VARCHAR(100) DEFAULT NULL,
usuario VARCHAR(100) DEFAULT NULL,
evento VARCHAR(100) DEFAULT NULL,
descripcion VARCHAR(100) DEFAULT NULL,
fecha VARCHAR(100) DEFAULT NULL,
hora VARCHAR(100) DEFAULT NULL
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



# Conectar al lector RFID de la estación 1 a la 3
reader_1 = R420('192.168.0.20')
#reader_2 = R420('192.168.0.21')

antena_1 = []

# Definir una función para obtener la hora actual formateada
def obtener_hora_actual():
    return time.strftime('%Y-%m-%d %H:%M:%S')

def decrementar_lista(lista_ceros, index):
    print("Valor actual en lista_ceros[index]:", lista_ceros[index])
    print("Tipo de lista_ceros[index]:", type(lista_ceros[index]))
    #lista_ceros = [int(elemento) for elemento in lista_ceros]
    if not isinstance(lista_ceros[index], int):
        raise TypeError(f"Se esperaba un entero en el índice {index}, pero se encontró {type(lista_ceros[index])}")
    lista_ceros[index] -= int(1)
    lista_ceros = [int(elemento) for elemento in lista_ceros]
    return lista_ceros[index]

def def_time(fecha_hora_1, fecha_hora_2):
    # Convertir las cadenas de texto a objetos datetime
    datetime_1 = datetime.strptime(str(fecha_hora_1), '%Y-%m-%d %H:%M:%S')
    datetime_2 = datetime.strptime(str(fecha_hora_2), '%Y-%m-%d %H:%M:%S')

    # Calcular la diferencia
    diferencia = datetime_2 - datetime_1

    # Obtener horas, minutos y segundos de la diferencia
    total_segundos = int(diferencia.total_seconds())
    #horas = total_segundos // 3600
    minutos = (total_segundos % 3600) // 60
    segundos = total_segundos % 60

    # Retornar la diferencia en una sola variable
    return f"{minutos}m : {segundos}s"

#Creación de listas
lista_ceros_1 = list(range(1))
lista_hora_1 = list(range(1))
lista_ceros_2 = list(range(1))
lista_hora_2 = list(range(1))
lista_ceros_3 = list(range(1))
lista_hora_3 = list(range(1))
lista_ceros_4 = list(range(1))
lista_hora_4 = list(range(1))
lista_ceros_5 = list(range(1))
lista_hora_5 = list(range(1))
lista_ceros_6 = list(range(1))
lista_hora_6 = list(range(1))
lista_ceros_7 = list(range(1))
lista_hora_7 = list(range(1))


max_cero=10

while True:

############
#ESTACIÓN_1#
############

    Lector_1 = reader_1.detectTags(powerDBm=reader_1.power_table[35], freqMHz=reader_1.freq_table[0], mode=1002, session=2, population=1, duration=0.1, searchmode=2)
    tags_detectados = [tag['EPC-96'].decode('utf-8') for tag in Lector_1 if tag['AntennaID'] == 1]
    cursor.execute("SELECT Tag FROM Estación_1")
    tags_registrados = [registro[0] for registro in cursor.fetchall()]
    # cursor.execute("SELECT modo FROM Estación_1 ORDER BY id DESC LIMIT 1")
    # modo = cursor.fetchone()[0]
    Estación=1

    #if modo == "lectura":
    try:
        
        for tag_registrado in tags_registrados: #REGISTRO HORA DE SALIDA
            cursor.execute("SELECT Tag FROM Estación_1")
            tags_registrados = [registro[0] for registro in cursor.fetchall()] #TAGS INCLUIDOS DENTRO DE LA TABLA DE LA ESTACIÓN 1
            index=tags_registrados.index(tag_registrado)+1
            print("index= ",index)
            print("lista_ceros: ",lista_ceros_1)
            print("lista_hora: ", lista_hora_1)
            # print(lista_ceros_1[index])
            ultimo_cero_1=False
            if tag_registrado not in tags_detectados and lista_ceros_1[index]==0: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
                try:
                    print("tercer cero")
                    # print(index)
                    cursor.execute("SELECT Hora_entrada FROM Estación_1 WHERE Tag = %s", (tag_registrado,))
                    hora_entrada = cursor.fetchone()[0]
                    cursor.execute("SELECT ID FROM datos WHERE Tag = %s", (tag_registrado,))
                    idd = cursor.fetchone()[0]
                    fecha, hora = lista_hora_1[index].split(' ')
                    descripcion= def_time(hora_entrada,lista_hora_1[index])
                    cursor.execute(
                        "INSERT INTO Eventos (id, usuario, evento, descripcion, fecha, hora) VALUES (%s, %s, %s, %s, %s, %s)",
                        (idd, Estación, "Kit armado", "Tiempo de armado: " + descripcion, fecha, hora)
                    )

                    ultimo_cero_1=True
                    
                    #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
                except mysql.connector.Error as err:
                    print("Error al actualizar la hora de salida en la tabla de la Estación 1:", err) 
            if tag_registrado not in tags_detectados and lista_ceros_1[index]!=0 and lista_ceros_1[index]!=max_cero:
                print("segundo cero")
                lista_ceros_1[index]=decrementar_lista(lista_ceros_1,index)
            
            if tag_registrado not in tags_detectados and lista_ceros_1[index]==max_cero: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
                try:
                    print("primer cero")
                    #cursor.execute("INSERT INTO fechas (ID, Hora_salida, Estación) VALUES (%s, %s, %s)", (str(tag_registrado), obtener_hora_actual(), int(Estación)))
                    lista_hora_1[index]=(str(obtener_hora_actual()))
                    lista_ceros_1[index]=decrementar_lista(lista_ceros_1,index)
                    #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
                except mysql.connector.Error as err:
                    print("Error al actualizar la hora de salida en la tabla de la Estación 1:", err) 

            if lista_ceros_1[index]==0 and ultimo_cero_1==True:
                lista_ceros_1.pop(index)
                lista_hora_1.pop(index)
                cursor.execute("DELETE FROM Estación_1 WHERE Tag = %s", (tag_registrado,))
                #print("-1 fila estacion1")
                conexion.commit()

            if tag_registrado in tags_detectados:
                lista_ceros_1[index]=int(max_cero)

            ultimo_cero_1=False
        
        for tag_1 in Lector_1: #REGISTRO HORA DE ENTRADA
            
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
                        #id_kit = (list(nombres_tags.keys())).index(tags) % 5 + 1
                        # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
                        print(obtener_hora_actual())
                        cursor.execute("INSERT INTO Estación_1 (Tag, Hora_entrada) VALUES (%s, %s)", (tags, obtener_hora_actual()))
                        conexion.commit()
                        lista_ceros_1.append(int(max_cero))
                        lista_hora_1.append(0)
                        #print(f"Tag '{tags}' insertado en la tabla de la Estación 1 con nombre '{nombre_tag_1}' y hora de entrada registrada.")
                    except mysql.connector.Error as err:
                        print("Error al insertar el tag en la tabla de la Estación 1:", err)

    #if modo == "asignación":
    except mysql.connector.Error as err:
        print("Error al insertar el tag en la tabla de la Estación 1:", err)


############
#ESTACIÓN_2#
############

    tags_detectados2 = [tag['EPC-96'].decode('utf-8') for tag in Lector_1 if tag['AntennaID'] == 2]
    cursor.execute("SELECT Tag FROM Estación_2")
    tags_registrados2 = [registro[0] for registro in cursor.fetchall()]

    Estación=2
    for tag_registrado in tags_registrados2: #REGISTRO HORA DE SALIDA
        cursor.execute("SELECT Tag FROM Estación_2")
        tags_registrados2 = [registro[0] for registro in cursor.fetchall()] #TAGS INCLUIDOS DENTRO DE LA TABLA DE LA ESTACIÓN 1
        index=tags_registrados2.index(tag_registrado)+1
        print("index= ",index)
        print("lista_ceros: ",lista_ceros_2)
        print("lista_hora: ", lista_hora_2)
        # print(lista_ceros_2[index])
        ultimo_cero_2=False
        if tag_registrado not in tags_detectados2 and lista_ceros_2[index]==0: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
            try:
                print("tercer cero")
                # print(index)
                cursor.execute("SELECT Hora_entrada FROM Estación_2 WHERE Tag = %s", (tag_registrado,))
                hora_entrada = cursor.fetchone()[0] 
                cursor.execute("INSERT INTO Eventos (Tag, Estación, Hora_entrada, Hora_salida) VALUES (%s, %s, %s, %s)", 
                            (tag_registrado, Estación, hora_entrada, lista_hora_2[index]))
                conexion.commit()
                ultimo_cero_2=True
                
                #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
            except mysql.connector.Error as err:
                print("Error al actualizar la hora de salida en la tabla de la Estación 2:", err) 

        if tag_registrado not in tags_detectados2 and lista_ceros_2[index]!=0 and lista_ceros_2[index]!=max_cero:
            print("segundo cero")
            lista_ceros_2[index]=decrementar_lista(lista_ceros_2,index)
        
        if tag_registrado not in tags_detectados2 and lista_ceros_2[index]==max_cero: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
            try:
                print("primer cero")
                #cursor.execute("INSERT INTO fechas (ID, Hora_salida, Estación) VALUES (%s, %s, %s)", (str(tag_registrado), obtener_hora_actual(), int(Estación)))
                lista_hora_2[index]=(str(obtener_hora_actual()))
                lista_ceros_2[index]=decrementar_lista(lista_ceros_2,index)
                #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
            except mysql.connector.Error as err:
                print("Error al actualizar la hora de salida en la tabla de la Estación 2:", err) 

        if lista_ceros_2[index]==0 and ultimo_cero_2==True:
            lista_ceros_2.pop(index)
            lista_hora_2.pop(index)
            cursor.execute("DELETE FROM Estación_2 WHERE Tag = %s", (tag_registrado,))
            #print("-1 fila estacion1")
            conexion.commit()

        if tag_registrado in tags_detectados2:
            lista_ceros_2[index]=int(max_cero)

        ultimo_cero_2=False

    for tag_1 in Lector_1: #REGISTRO HORA DE ENTRADA
        
        if tag_1['AntennaID'] == 2:
            tags = tag_1['EPC-96'].decode('utf-8')
            # Asignación de nombre
            nombre_tag_2 = nombres_tags.get(tags, "No registrado")
            
            # Verificar si el tag ya está presente en la tabla de la Estación 1
            cursor.execute("SELECT Tag FROM Estación_2 WHERE Tag = %s", (tags,))
            resultado = cursor.fetchone()
            
            if resultado is None:
                # El tag no está presente en la tabla, entonces se inserta
                try:
                    # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
                    print(obtener_hora_actual())
                    cursor.execute("INSERT INTO Estación_2 (Tag, Kit, Hora_entrada) VALUES (%s, %s, %s)", (tags, nombre_tag_2, obtener_hora_actual()))
                    conexion.commit()
                    lista_ceros_2.append(int(max_cero))
                    lista_hora_2.append(0)
                    #print(f"Tag '{tags}' insertado en la tabla de la Estación 1 con nombre '{nombre_tag_2}' y hora de entrada registrada.")
                except mysql.connector.Error as err:
                    print("Error al insertar el tag en la tabla de la Estación 2:", err)

############
#ESTACIÓN_3#
############

    tags_detectados_3 = [tag['EPC-96'].decode('utf-8') for tag in Lector_1 if tag['AntennaID'] == 3]
    cursor.execute("SELECT Tag FROM Estación_3")
    tags_registrados3 = [registro[0] for registro in cursor.fetchall()]

    Estación=3
    for tag_registrado in tags_registrados3: #REGISTRO HORA DE SALIDA
        cursor.execute("SELECT Tag FROM Estación_3")
        tags_registrados3 = [registro[0] for registro in cursor.fetchall()] #TAGS INCLUIDOS DENTRO DE LA TABLA DE LA ESTACIÓN 1
        index=tags_registrados3.index(tag_registrado)+1
        print("index= ",index)
        print("lista_ceros: ",lista_ceros_3)
        print("lista_hora: ", lista_hora_3)
        # print(lista_ceros_3[index])
        ultimo_cero_3=False
        if tag_registrado not in tags_detectados_3 and lista_ceros_3[index]==0: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
            try:
                print("tercer cero")
                # print(index)
                cursor.execute("SELECT Hora_entrada FROM Estación_3 WHERE Tag = %s", (tag_registrado,))
                hora_entrada = cursor.fetchone()[0] 
                cursor.execute("INSERT INTO Eventos (Tag, Estación, Hora_entrada, Hora_salida) VALUES (%s, %s, %s, %s)", 
                            (tag_registrado, Estación, hora_entrada, lista_hora_3[index]))
                conexion.commit()
                ultimo_cero_3=True
                
                #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
            except mysql.connector.Error as err:
                print("Error al actualizar la hora de salida en la tabla de la Estación 3:", err) 

        if tag_registrado not in tags_detectados_3 and lista_ceros_3[index]!=0 and lista_ceros_3[index]!=max_cero:
            print("segundo cero")
            lista_ceros_3[index]=decrementar_lista(lista_ceros_3,index)
        
        if tag_registrado not in tags_detectados_3 and lista_ceros_3[index]==max_cero: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
            try:
                print("primer cero")
                #cursor.execute("INSERT INTO fechas (ID, Hora_salida, Estación) VALUES (%s, %s, %s)", (str(tag_registrado), obtener_hora_actual(), int(Estación)))
                lista_hora_3[index]=(str(obtener_hora_actual()))
                lista_ceros_3[index]=decrementar_lista(lista_ceros_3,index)
                #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
            except mysql.connector.Error as err:
                print("Error al actualizar la hora de salida en la tabla de la Estación 3:", err) 

        if lista_ceros_3[index]==0 and ultimo_cero_3==True:
            lista_ceros_3.pop(index)
            lista_hora_3.pop(index)
            cursor.execute("DELETE FROM Estación_3 WHERE Tag = %s", (tag_registrado,))
            #print("-1 fila estacion1")
            conexion.commit()

        if tag_registrado in tags_detectados_3:
            lista_ceros_3[index]=int(max_cero)

        ultimo_cero_3=False

    for tag_1 in Lector_1: #REGISTRO HORA DE ENTRADA
        
        if tag_1['AntennaID'] == 3:
            tags = tag_1['EPC-96'].decode('utf-8')
            # Asignación de nombre
            nombre_tag_3 = nombres_tags.get(tags, "No registrado")
            
            # Verificar si el tag ya está presente en la tabla de la Estación 1
            cursor.execute("SELECT Tag FROM Estación_3 WHERE Tag = %s", (tags,))
            resultado = cursor.fetchone()
            
            if resultado is None:
                # El tag no está presente en la tabla, entonces se inserta
                try:
                    # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
                    print(obtener_hora_actual())
                    cursor.execute("INSERT INTO Estación_3 (Tag, Kit, Hora_entrada) VALUES (%s, %s, %s)", (tags, nombre_tag_3, obtener_hora_actual()))
                    conexion.commit()
                    lista_ceros_3.append(int(max_cero))
                    lista_hora_3.append(0)
                    #print(f"Tag '{tags}' insertado en la tabla de la Estación 1 con nombre '{nombre_tag_3}' y hora de entrada registrada.")
                except mysql.connector.Error as err:
                    print("Error al insertar el tag en la tabla de la Estación 3:", err)



# ############
# #ESTACIÓN_4#
# ############

#     Lector_2 = reader_2.detectTags(powerDBm=reader_2.power_table[35], freqMHz=reader_2.freq_table[0], mode=1002, session=2, population=1, duration=0.1, searchmode=2)
#     print(Lector_2)
#     tags_detectados_4 = [tag['EPC-96'].decode('utf-8') for tag in Lector_2 if tag['AntennaID'] == 1]
#     cursor.execute("SELECT Tag FROM Estación_4")
#     tags_registrados_4 = [registro[0] for registro in cursor.fetchall()]

#     Estación=4
#     for tag_registrado in tags_registrados_4: #REGISTRO HORA DE SALIDA
#         cursor.execute("SELECT Tag FROM Estación_4")
#         tags_registrados_4 = [registro[0] for registro in cursor.fetchall()] #TAGS INCLUIDOS DENTRO DE LA TABLA DE LA ESTACIÓN 1
#         index=tags_registrados_4.index(tag_registrado)+1
#         print("index= ",index)
#         print("lista_ceros: ",lista_ceros_4)
#         print("lista_hora: ", lista_hora_4)
#         # print(lista_ceros_4[index])
#         ultimo_cero_4=False
#         if tag_registrado not in tags_detectados_4 and lista_ceros_4[index]==0: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
#             try:
#                 print("tercer cero")
#                 # print(index)
#                 cursor.execute("SELECT Hora_entrada FROM Estación_4 WHERE Tag = %s", (tag_registrado,))
#                 hora_entrada = cursor.fetchone()[0] 
#                 cursor.execute("INSERT INTO Eventos (Tag, Estación, Hora_entrada, Hora_salida) VALUES (%s, %s, %s, %s)", 
#                             (tag_registrado, Estación, hora_entrada, lista_hora_4[index]))
#                 conexion.commit()
#                 ultimo_cero_4=True
                
#                 #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
#             except mysql.connector.Error as err:
#                 print("Error al actualizar la hora de salida en la tabla de la Estación 4:", err) 

#         if tag_registrado not in tags_detectados_4 and lista_ceros_4[index]!=0 and lista_ceros_4[index]!=max_cero:
#             print("segundo cero")
#             lista_ceros_4[index]=decrementar_lista(lista_ceros_4,index)
        
#         if tag_registrado not in tags_detectados_4 and lista_ceros_4[index]==max_cero: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
#             try:
#                 print("primer cero")
#                 #cursor.execute("INSERT INTO fechas (ID, Hora_salida, Estación) VALUES (%s, %s, %s)", (str(tag_registrado), obtener_hora_actual(), int(Estación)))
#                 lista_hora_4[index]=(str(obtener_hora_actual()))
#                 lista_ceros_4[index]=decrementar_lista(lista_ceros_4,index)
#                 #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
#             except mysql.connector.Error as err:
#                 print("Error al actualizar la hora de salida en la tabla de la Estación 4:", err) 

#         if lista_ceros_4[index]==0 and ultimo_cero_4==True:
#             lista_ceros_4.pop(index)
#             lista_hora_4.pop(index)
#             cursor.execute("DELETE FROM Estación_4 WHERE Tag = %s", (tag_registrado,))
#             #print("-1 fila estacion1")
#             conexion.commit()

#         if tag_registrado in tags_detectados_4:
#             lista_ceros_4[index]=int(max_cero)

#         ultimo_cero_4=False

#     for tag_2 in Lector_2: #REGISTRO HORA DE ENTRADA
        
#         if tag_2['AntennaID'] == 1:
#             tags = tag_2['EPC-96'].decode('utf-8')
#             # Asignación de nombre
#             nombre_tag_4 = nombres_tags.get(tags, "No registrado")
            
#             # Verificar si el tag ya está presente en la tabla de la Estación 1
#             cursor.execute("SELECT Tag FROM Estación_4 WHERE Tag = %s", (tags,))
#             resultado = cursor.fetchone()
            
#             if resultado is None:
#                 # El tag no está presente en la tabla, entonces se inserta
#                 try:
#                     # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
#                     print(obtener_hora_actual())
#                     cursor.execute("INSERT INTO Estación_4 (Tag, Kit, Hora_entrada) VALUES (%s, %s, %s)", (tags, nombre_tag_4, obtener_hora_actual()))
#                     conexion.commit()
#                     lista_ceros_4.append(int(max_cero))
#                     lista_hora_4.append(0)
#                     #print(f"Tag '{tags}' insertado en la tabla de la Estación 1 con nombre '{nombre_tag_4}' y hora de entrada registrada.")
#                 except mysql.connector.Error as err:
#                     print("Error al insertar el tag en la tabla de la Estación 4:", err)

# ############
# #ESTACIÓN_5#
# ############

#     tags_detectados_5 = [tag['EPC-96'].decode('utf-8') for tag in Lector_2 if tag['AntennaID'] == 9]
#     cursor.execute("SELECT Tag FROM Estación_5")
#     tags_registrados_5 = [registro[0] for registro in cursor.fetchall()]

#     Estación=5
#     for tag_registrado in tags_registrados_5: #REGISTRO HORA DE SALIDA
#         cursor.execute("SELECT Tag FROM Estación_5")
#         tags_registrados_5 = [registro[0] for registro in cursor.fetchall()] #TAGS INCLUIDOS DENTRO DE LA TABLA DE LA ESTACIÓN 1
#         index=tags_registrados_5.index(tag_registrado)+1
#         print("index= ",index)
#         print("lista_ceros: ",lista_ceros_5)
#         print("lista_hora: ", lista_hora_5)
#         # print(lista_ceros_5[index])
#         ultimo_cero_5=False
#         if tag_registrado not in tags_detectados_5 and lista_ceros_5[index]==0: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
#             try:
#                 print("tercer cero")
#                 # print(index)
#                 cursor.execute("SELECT Hora_entrada FROM Estación_5 WHERE Tag = %s", (tag_registrado,))
#                 hora_entrada = cursor.fetchone()[0] 
#                 cursor.execute("INSERT INTO Eventos (Tag, Estación, Hora_entrada, Hora_salida) VALUES (%s, %s, %s, %s)", 
#                             (tag_registrado, Estación, hora_entrada, lista_hora_5[index]))
#                 conexion.commit()
#                 ultimo_cero_5=True
                
#                 #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
#             except mysql.connector.Error as err:
#                 print("Error al actualizar la hora de salida en la tabla de la Estación 5:", err) 

#         if tag_registrado not in tags_detectados_5 and lista_ceros_5[index]!=0 and lista_ceros_5[index]!=max_cero:
#             print("segundo cero")
#             lista_ceros_5[index]=decrementar_lista(lista_ceros_5,index)
        
#         if tag_registrado not in tags_detectados_5 and lista_ceros_5[index]==max_cero: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
#             try:
#                 print("primer cero")
#                 #cursor.execute("INSERT INTO fechas (ID, Hora_salida, Estación) VALUES (%s, %s, %s)", (str(tag_registrado), obtener_hora_actual(), int(Estación)))
#                 lista_hora_5[index]=(str(obtener_hora_actual()))
#                 lista_ceros_5[index]=decrementar_lista(lista_ceros_5,index)
#                 #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
#             except mysql.connector.Error as err:
#                 print("Error al actualizar la hora de salida en la tabla de la Estación 5:", err) 

#         if lista_ceros_5[index]==0 and ultimo_cero_5==True:
#             lista_ceros_5.pop(index)
#             lista_hora_5.pop(index)
#             cursor.execute("DELETE FROM Estación_5 WHERE Tag = %s", (tag_registrado,))
#             #print("-1 fila estacion1")
#             conexion.commit()

#         if tag_registrado in tags_detectados_5:
#             lista_ceros_5[index]=int(max_cero)

#         ultimo_cero_5=False

#     for tag_2 in Lector_2: #REGISTRO HORA DE ENTRADA
        
#         if tag_2['AntennaID'] == 9:
#             tags = tag_2['EPC-96'].decode('utf-8')
#             # Asignación de nombre
#             nombre_tag_5 = nombres_tags.get(tags, "No registrado")
            
#             # Verificar si el tag ya está presente en la tabla de la Estación 1
#             cursor.execute("SELECT ID FROM Estación_5 WHERE Tag = %s", (tags,))
#             resultado = cursor.fetchone()
            
#             if resultado is None:
#                 # El tag no está presente en la tabla, entonces se inserta
#                 try:
#                     # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
#                     print(obtener_hora_actual())
#                     cursor.execute("INSERT INTO Estación_5 (Tag, Kit, Hora_entrada) VALUES (%s, %s, %s)", (tags, nombre_tag_5, obtener_hora_actual()))
#                     conexion.commit()
#                     lista_ceros_5.append(int(max_cero))
#                     lista_hora_5.append(0)
#                     #print(f"Tag '{tags}' insertado en la tabla de la Estación 1 con nombre '{nombre_tag_5}' y hora de entrada registrada.")
#                 except mysql.connector.Error as err:
#                     print("Error al insertar el tag en la tabla de la Estación 5:", err)

# ############
# #ESTACIÓN_6#
# ############

#     tags_detectados_6 = [tag['EPC-96'].decode('utf-8') for tag in Lector_2 if tag['AntennaID'] == 17]
#     cursor.execute("SELECT Tag FROM Estación_6")
#     tags_registrados_6 = [registro[0] for registro in cursor.fetchall()]

#     Estación=6
#     for tag_registrado in tags_registrados_6: #REGISTRO HORA DE SALIDA
#         cursor.execute("SELECT Tag FROM Estación_6")
#         tags_registrados_6 = [registro[0] for registro in cursor.fetchall()] #TAGS INCLUIDOS DENTRO DE LA TABLA DE LA ESTACIÓN 1
#         index=tags_registrados_6.index(tag_registrado)+1
#         print("index= ",index)
#         print("lista_ceros: ",lista_ceros_6)
#         print("lista_hora: ", lista_hora_6)
#         # print(lista_ceros_6[index])
#         ultimo_cero_6=False
#         if tag_registrado not in tags_detectados_6 and lista_ceros_6[index]==0: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
#             try:
#                 print("tercer cero")
#                 # print(index)
#                 cursor.execute("SELECT Hora_entrada FROM Estación_6 WHERE Tag = %s", (tag_registrado,))
#                 hora_entrada = cursor.fetchone()[0] 
#                 cursor.execute("INSERT INTO Eventos (Tag, Estación, Hora_entrada, Hora_salida) VALUES (%s, %s, %s, %s)", 
#                             (tag_registrado, Estación, hora_entrada, lista_hora_6[index]))
#                 conexion.commit()
#                 ultimo_cero_6=True
                
#                 #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
#             except mysql.connector.Error as err:
#                 print("Error al actualizar la hora de salida en la tabla de la Estación 6:", err) 

#         if tag_registrado not in tags_detectados_6 and lista_ceros_6[index]!=0 and lista_ceros_6[index]!=max_cero:
#             print("segundo cero")
#             lista_ceros_6[index]=decrementar_lista(lista_ceros_6,index)
        
#         if tag_registrado not in tags_detectados_6 and lista_ceros_6[index]==max_cero: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
#             try:
#                 print("primer cero")
#                 #cursor.execute("INSERT INTO fechas (ID, Hora_salida, Estación) VALUES (%s, %s, %s)", (str(tag_registrado), obtener_hora_actual(), int(Estación)))
#                 lista_hora_6[index]=(str(obtener_hora_actual()))
#                 lista_ceros_6[index]=decrementar_lista(lista_ceros_6,index)
#                 #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
#             except mysql.connector.Error as err:
#                 print("Error al actualizar la hora de salida en la tabla de la Estación 6:", err) 

#         if lista_ceros_6[index]==0 and ultimo_cero_6==True:
#             lista_ceros_6.pop(index)
#             lista_hora_6.pop(index)
#             cursor.execute("DELETE FROM Estación_6 WHERE Tag = %s", (tag_registrado,))
#             #print("-1 fila estacion1")
#             conexion.commit()

#         if tag_registrado in tags_detectados_6:
#             lista_ceros_6[index]=int(max_cero)

#         ultimo_cero_6=False

#     for tag_2 in Lector_2: #REGISTRO HORA DE ENTRADA
        
#         if tag_2['AntennaID'] == 17:
#             tags = tag_2['EPC-96'].decode('utf-8')
#             # Asignación de nombre
#             nombre_tag_6 = nombres_tags.get(tags, "No registrado")
            
#             # Verificar si el tag ya está presente en la tabla de la Estación 1
#             cursor.execute("SELECT Tag FROM Estación_6 WHERE Tag = %s", (tags,))
#             resultado = cursor.fetchone()
            
#             if resultado is None:
#                 # El tag no está presente en la tabla, entonces se inserta
#                 try:
#                     # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
#                     print(obtener_hora_actual())
#                     cursor.execute("INSERT INTO Estación_6 (Tag, Kit, Hora_entrada) VALUES (%s, %s, %s)", (tags, nombre_tag_6, obtener_hora_actual()))
#                     conexion.commit()
#                     lista_ceros_6.append(int(max_cero))
#                     lista_hora_6.append(0)
#                     #print(f"Tag '{tags}' insertado en la tabla de la Estación 1 con nombre '{nombre_tag_6}' y hora de entrada registrada.")
#                 except mysql.connector.Error as err:
#                     print("Error al insertar el tag en la tabla de la Estación 6:", err)

# ############
# #ESTACIÓN_7#
# ############

#     tags_detectados_7 = [tag['EPC-96'].decode('utf-8') for tag in Lector_2 if tag['AntennaID'] == 25]
#     cursor.execute("SELECT Tag FROM Estación_7")
#     tags_registrados_7 = [registro[0] for registro in cursor.fetchall()]

#     Estación=7
#     for tag_registrado in tags_registrados_7: #REGISTRO HORA DE SALIDA
#         cursor.execute("SELECT Tag FROM Estación_7")
#         tags_registrados_7 = [registro[0] for registro in cursor.fetchall()] #TAGS INCLUIDOS DENTRO DE LA TABLA DE LA ESTACIÓN 1
#         index=tags_registrados_7.index(tag_registrado)+1
#         print("index= ",index)
#         print("lista_ceros: ",lista_ceros_7)
#         print("lista_hora: ", lista_hora_7)
#         # print(lista_ceros_7[index])
#         ultimo_cero_7=False
#         if tag_registrado not in tags_detectados_7 and lista_ceros_7[index]==0: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
#             try:
#                 print("tercer cero")
#                 # print(index)
#                 cursor.execute("SELECT Hora_entrada FROM Estación_7 WHERE Tag = %s", (tag_registrado,))
#                 hora_entrada = cursor.fetchone()[0] 
#                 cursor.execute("INSERT INTO Eventos (Tag, Estación, Hora_entrada, Hora_salida) VALUES (%s, %s, %s, %s)", 
#                             (tag_registrado, Estación, hora_entrada, lista_hora_7[index]))
#                 conexion.commit()
#                 ultimo_cero_7=True
                
#                 #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
#             except mysql.connector.Error as err:
#                 print("Error al actualizar la hora de salida en la tabla de la Estación 7:", err) 

#         if tag_registrado not in tags_detectados_7 and lista_ceros_7[index]!=0 and lista_ceros_7[index]!=max_cero:
#             print("segundo cero")
#             lista_ceros_7[index]=decrementar_lista(lista_ceros_7,index)
        
#         if tag_registrado not in tags_detectados_7 and lista_ceros_7[index]==max_cero: #MIRA SI EL TAG CONTENIDO EN LA TALA DE E1 DEJA DE SER DETECTADO EN UN MOMENTO X
#             try:
#                 print("primer cero")
#                 #cursor.execute("INSERT INTO fechas (ID, Hora_salida, Estación) VALUES (%s, %s, %s)", (str(tag_registrado), obtener_hora_actual(), int(Estación)))
#                 lista_hora_7[index]=(str(obtener_hora_actual()))
#                 lista_ceros_7[index]=decrementar_lista(lista_ceros_7,index)
#                 #print(f"Registrada la hora de salida para el tag '{tag_registrado}'.")
#             except mysql.connector.Error as err:
#                 print("Error al actualizar la hora de salida en la tabla de la Estación 7:", err) 

#         if lista_ceros_7[index]==0 and ultimo_cero_7==True:
#             lista_ceros_7.pop(index)
#             lista_hora_7.pop(index)
#             cursor.execute("DELETE FROM Estación_7 WHERE Tag = %s", (tag_registrado,))
#             #print("-1 fila estacion1")
#             conexion.commit()

#         if tag_registrado in tags_detectados_7:
#             lista_ceros_7[index]=int(max_cero)

#         ultimo_cero_7=False

#     for tag_2 in Lector_2: #REGISTRO HORA DE ENTRADA
        
#         if tag_2['AntennaID'] == 25:
#             print("leyó antena 7")
#             tags = tag_2['EPC-96'].decode('utf-8')
#             # Asignación de nombre
#             nombre_tag_7 = nombres_tags.get(tags, "No registrado")
            
#             # Verificar si el tag ya está presente en la tabla de la Estación 1
#             cursor.execute("SELECT Tag FROM Estación_7 WHERE Tag = %s", (tags,))
#             resultado = cursor.fetchone()
            
#             if resultado is None:
#                 # El tag no está presente en la tabla, entonces se inserta
#                 try:
#                     # Insertar el tag en la tabla de la Estación 1 con la hora de entrada
#                     print(obtener_hora_actual())
#                     cursor.execute("INSERT INTO Estación_7 (Tag, Kit, Hora_entrada) VALUES (%s, %s, %s)", (tags, nombre_tag_7, obtener_hora_actual()))
#                     conexion.commit()
#                     lista_ceros_7.append(int(max_cero))
#                     lista_hora_7.append(0)
#                     #print(f"Tag '{tags}' insertado en la tabla de la Estación 1 con nombre '{nombre_tag_7}' y hora de entrada registrada.")
#                 except mysql.connector.Error as err:
#                     print("Error al insertar el tag en la tabla de la Estación 7:", err)