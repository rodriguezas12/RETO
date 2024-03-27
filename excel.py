my_dict = {
    'EPC-96': b'110000000000000000000308',
    'AntennaID': 2,
    'PeakRSSI': -64,
    'ChannelIndex': 41,
    'FirstSeenTimestampUTC': 1711573240005603,
    'LastSeenTimestampUTC': 1711573240794195,
    'TagSeenCount': 32,
    'PhaseAngle': 185.2734375,
    'RSSI': -64.0
}

# Extraer el valor entre comillas de la cadena de bytes correspondiente a la clave 'EPC-96'
first_value = my_dict['EPC-96'][0:24].decode('utf-8')
print(first_value)
