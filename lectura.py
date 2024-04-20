from reader import R420
import sllurp
import numpy as np
import pandas as pd
import os
import keyboard
from datetime import datetime
# Configuración de conexión a MySQL
import mysql.connector
from mysql.connector import errorcode


reader_IN = R420('192.168.0.20')
#reader_OUT = R420('192.168.0.21')

freqs = reader_IN.freq_table
powers = reader_IN.power_table

while True:
    tags_IN = reader_IN.detectTags(powerDBm=powers[42], freqMHz=freqs[0], 
        mode=1002, session=2, population=1, duration=0.2, searchmode=2)
    #tags_OUT = reader_OUT.detectTags(powerDBm=powers[-1], freqMHz=freqs[0], 
    #    mode=1002, session=2, population=1, duration=0.5, searchmode=2)

    for tag in tags_IN:
        first_value = tag['EPC-96'][0:24].decode('utf-8')
        tag_antenna = tag['AntennaID']
        if tag_antenna==3:

            print("Tag: ",first_value,"Estación: ",tag_antenna)

    #for tag in tags_IN:
        #first_value = tag['EPC-96'][0:24].decode('utf-8')
      
      











        
