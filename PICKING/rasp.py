import mysql.connector
import numpy as np
from time import sleep
from gpiozero import LED
import time
import board
import neopixel


# Establecer la conexión a la base de datos MySQL
conexion = mysql.connector.connect(
    user='admin', 
    password='usuario123', 
    host='db-retorfid.cdsc040qszy0.us-east-2.rds.amazonaws.com',
    database='RETORFID', 
    port='3306'
)

# Crear un objeto cursor usando el método cursor() del objeto conexión
cursor = conexion.cursor()

# Definir la consulta SQL para seleccionar solo la columna Pedido
consulta_sql = "SELECT Pedido FROM Solicitud"

# Ejecutar la consulta SQL
cursor.execute(consulta_sql)

# Recuperar todos los resultados
resultados = cursor.fetchall()

# Cerrar el cursor y la conexión
cursor.close()
conexion.close()

# Asumiendo que el último resultado es el que queremos
ultimo_pedido = resultados[-1][0]  # Obtenemos el string '1,4,6'

# Dividir el string por las comas para obtener solo los números
pedido = ultimo_pedido.split(',')

# Imprimir la cantidad de números
#print(len(pedido))  # Esto imprimirá '3' para el string '1,4,6'
#print("Pedido=",pedido)


# Convertir cada elemento de la lista a entero
pedido = [int(num) for num in pedido]

# Ahora Pedido es una lista de enteros
print(pedido)


# Crear un arreglo de NumPy con números del 1 al 50
numeros = np.arange(1, 51)

# Reorganizar el arreglo en una matriz de 5 filas y 10 columnas
nled = numeros.reshape(5, 10)
nled1=np.array([[30,29,28,27,26,25,24,23,22,21],[20,19,18,17,16,15,14,13,12,11],[10,9,8,7,6,5,4,3,2,1]])
#print(nled1[1,0])
print(nled1)

# Imprimir la matriz
print("nled=",nled)
# Crear una matriz de 5x10 con valores aleatorios entre 1 y 6
M1 = np.random.randint(1, 7, size=(5, 10))

# Imprimir la matriz
print("M1=",M1)

P=[]
lista1=[]
for g in range (len(pedido)): #kits solicitados
    for i in range (len(M1[:,0])): # controla columna M1
        for k in range (len(M1[0,:])): # controla fila M1
            if M1[i,k] == pedido[g] and pedido[g] not in lista1: # busca el primer Kit solicitado y cuando lo encuentra guarda su posición en el rack
                lista1.append(pedido[g])
                kitL=nled[i,k] #numero del led a encender en cada iteración
                P.append(kitL) #vector de los leds a encender

print("Leds a encender=",P)
#print("Lista1=",lista1)
        
KAKA = range(1, 51)

for h in KAKA:
    if KAKA==P:
        print(f"Se enciende led {h}")

# LO QUE ESTÁ BIEN SE DEJA QUIETO, PRENDE SOLO UNA VEZ PERO AJA NO ERA LOS QUE QUERIAMOS CORRER EN UN COMIENZO




# # Separar los valores por la coma y convertirlos a enteros
# lista_pedidos = [int(num) for num in ultimo_pedido.split(',')]

# # Cerrar el cursor y la conexión
# cursor.close()
# conexion.close()

# # Usando un diccionario para asignar valores a variables dinámicamente
# variables = {chr(97 + i): valor for i, valor in enumerate(lista_pedidos)}

# # Ejemplo de cómo podrías usar `variables` más adelante en tu código
# def procesar_pedidos(variables):
#     # Aquí puedes añadir lógica para procesar los pedidos usando variables
#     print("Procesando los siguientes pedidos:")
#     for letra, valor in variables.items():
#         print(f"{letra} = {valor}")

# # Llamada a la función con el diccionario de variables
# procesar_pedidos(variables)

# # Demostración de acceso a variables individuales
# print("Acceso a variables individuales:")
# print("a =", variables.get('a', 'No definido'))
# print("b =", variables.get('b', 'No definido'))
# print("c =", variables.get('c', 'No definido'))
# print("d =", variables.get('d', 'No definido'))
# print("e =", variables.get('e', 'No definido'))
# print("f =", variables.get('f', 'No definido'))

# # Acceso seguro a variables, asumiendo un valor por defecto si no existen
# a = variables.get('a', None)
# b = variables.get('b', None)
# c = variables.get('c', None)
# d = variables.get('d', None)
# e = variables.get('e', None)
# f = variables.get('f', None)


