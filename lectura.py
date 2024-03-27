from reader import R420
import sllurp
import numpy as np
reader = R420('192.168.0.20')

freqs = reader.freq_table
powers = reader.power_table
while True:
    tags = reader.detectTags(powerDBm=powers[-1], freqMHz=freqs[0], 
        mode=1002, session=2, population=1, duration=0.5, searchmode=2)

    
    for tag in tags:
        first_value = tag['EPC-96'][0:24].decode('utf-8')
        print(first_value)
        #print(tag)
        


