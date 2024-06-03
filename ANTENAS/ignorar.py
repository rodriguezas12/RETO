import mysql.connector
from reader import R420
import time
import datetime



###############
#LECTORES RFID#
############### 

reader_IN = R420('192.168.0.20')

# Definir una función para obtener la hora actual formateada
def obtener_hora_actual():
    return time.strftime('%Y-%m-%d %H:%M:%S')

durationn=0.5

while True:
    # Detectar tags con el lector RFID de entrada
    tags_IN = reader_IN.detectTags(powerDBm=reader_IN.power_table[35], freqMHz=reader_IN.freq_table[0], mode=1001, session=2, population=1, duration=durationn, searchmode=2)
    for tag_IN in tags_IN:
        tag_id_IN = tag_IN['EPC-96'].decode('utf-8')
        print(tag_id_IN)