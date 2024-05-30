import subprocess
import os

# Función para ejecutar un script de Python en un subproceso
def ejecutar_script(script_path):
    return subprocess.Popen(['python', script_path])

if __name__ == '__main__':
    # Rutas completas a los scripts
    ruta_script1 = r'C:\\Users\\miche\\Documents\\Estudio\\Noveno semestre\\Comunicaciones\\Michelle\\ANTENAS\\Portales_Ready.py'
    ruta_script2 = r'C:\\Users\\miche\\Documents\\Estudio\\Noveno semestre\\Comunicaciones\\Michelle\\ANTENAS\\Estaciones_Redundancia.py'

    # Verificar si las rutas existen
    if not os.path.isfile(ruta_script1):
        print(f"No se encontró el archivo: {ruta_script1}")
        exit(1)
    if not os.path.isfile(ruta_script2):
        print(f"No se encontró el archivo: {ruta_script2}")
        exit(1)

    # Ejecutar los scripts
    proceso1 = ejecutar_script(ruta_script1)
    proceso2 = ejecutar_script(ruta_script2)

    try:
        # Mantener el script principal en ejecución mientras los subprocesos se están ejecutando
        proceso1.wait()
        proceso2.wait()
    except KeyboardInterrupt:
        print("Interrupción detectada. Terminando los procesos...")
        proceso1.terminate()
        proceso2.terminate()
    finally:
        # Asegurarse de que los procesos terminen correctamente
        proceso1.wait()
        proceso2.wait()
        print("Procesos terminados.")