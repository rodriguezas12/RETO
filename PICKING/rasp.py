import mysql.connector
import numpy as np
from time import sleep

def distancia(X1, Y1, X2, Y2):
    X2 = np.array(X2)
    Y2 = np.array(Y2)
    D = np.sqrt((X2 - X1)**2 + (Y2 - Y1)**2)
    return D

def leer_datos():
    while True:
        try:
            conexion = mysql.connector.connect(
                user='admin',
                password='usuario123',
                host='db-retorfid.cdsc040qszy0.us-east-2.rds.amazonaws.com',
                database='RETORFID',
                port='3306'
            )
            cursor = conexion.cursor()

            # Primera consulta
            consulta_sql = "SELECT `Col 1`, `Col 2`, `Col 3`, `Col 4`, `Col 5`, `Col 6`, `Col 7`, `Col 8`, `Col 9`, `Col 10` FROM M1 ORDER BY `Col 1`"
            cursor.execute(consulta_sql)
            resultados = cursor.fetchall()
            M1 = np.array(resultados)
            print(M1)

            # Segunda consulta
            consulta_sql = "SELECT Pedido FROM Solicitud"
            cursor.execute(consulta_sql)
            resultados = cursor.fetchall()
            ultimo_pedido = resultados[-1][0]
            pedido = ultimo_pedido.split(',')
            pedido = np.array(pedido)
            pedido = pedido.tolist()
            print(pedido)

            cursor.close()
            conexion.close()

            # Procesamiento de datos...
            # Tu código de procesamiento aquí

            sleep(30)  # Pausa antes de la próxima lectura

        except Exception as e:
            print("Error: ", e)
            if conexion.is_connected():
                cursor.close()
                conexion.close()
                print("Conexión cerrada debido a un error")

leer_datos()
