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
            # consulta_sql = "SELECT `Col 1`, `Col 2`, `Col 3`, `Col 4`, `Col 5`, `Col 6`, `Col 7`, `Col 8`, `Col 9`, `Col 10` FROM M1 ORDER BY `Col 1`"
            # cursor.execute(consulta_sql)
            # resultados = cursor.fetchall()
            # M1 = np.array(resultados)
            M1 = np.random.randint(1, 7, size=(3, 10))
        
            # Segunda consulta
            # consulta_sql = "SELECT Pedido FROM Solicitud"
            # cursor.execute(consulta_sql)
            # resultados = cursor.fetchall()
            # ultimo_pedido = resultados[-1][0]
            # pedido = ultimo_pedido.split(',')
            # pedido = np.array(pedido)
            # pedido = pedido.tolist()
            pedido=[3,3,1]

            cursor.close()
            conexion.close()

            # Procesamiento de datos...
            # Tu código de procesamiento aquí

            sleep(0.1)  # Pausa antes de la próxima lectura

        except Exception as e:
            print("Error: ", e)
            if conexion.is_connected():
                cursor.close()
                conexion.close()
                print("Conexión cerrada debido a un error")

        numeros = np.arange(1, 31)
        nled = numeros.reshape(3, 10)

        P=[]
        X2=[]
        Y2=[]

        primer_kit=[1]
        X1=1000
        Y1=1000
        lista_2=[]
        for g in range(len(pedido)-1):
            #primer_kit=[1]
            X2.clear()
            Y2.clear()
            for i in range(len(M1[0,:]) - 1, -1, -1):
                for k in range(len(M1[:,0]) - 1, -1, -1):

                    if M1[k,i] in pedido and 1 not in primer_kit and 1 in lista_2:
                        X2.append(k)
                        Y2.append(i)

                    if M1[k,i] in pedido and 1 in primer_kit:
                        primer_kit.remove(1)
                        pedido.remove(M1[k,i])
                        P.append(nled[k,i])
                        X1=k
                        Y1=i     

                    if X1 == k and i == Y1:
                        lista_2 = [1]       

            lista_2=[]
            D=distancia(X1,Y1,X2,Y2)
            D=D.tolist()
            minimo=min(D)
            index_minimo=D.index(minimo)
            P.append(nled[X2[index_minimo],Y2[index_minimo]])
            X1=X2[index_minimo]
            Y1=Y2[index_minimo]
            pedido.remove(M1[X1,Y1])
            # print("X1= ", X1)
            # print("Y1= ",Y1)
            # print("P=", P)
            # print("X2= ",X2)
            # print("Y2= ",Y2)
            # print("distancias= ",D)
                    
        # print("X1= ", X1)
        # print("Y1= ",Y1)
        # print("X2= ",X2)
        # print("Y2= ",Y2)

        #print("distancias= ",D)
        print(M1)
        print("Leds a encender=",P)


leer_datos()

