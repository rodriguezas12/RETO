import subprocess
import os

# Función para buscar archivos en el directorio actual y sus subdirectorios
def buscar_archivo(nombre_archivo):
    for root, dirs, files in os.walk('.'):
        if nombre_archivo in files:
            return os.path.join(root, nombre_archivo)
    return None

# Función para ejecutar un script de Python en un subproceso
def ejecutar_script(script_path):
    return subprocess.Popen(['python', script_path])

if __name__ == '__main__':
    # Nombres de los scripts a buscar
    nombre_script1 = 'Portales_Ready.py'
    nombre_script2 = 'Estaciones_Redundancia.py'

    # Buscar los scripts
    ruta_script1 = buscar_archivo(nombre_script1)
    ruta_script2 = buscar_archivo(nombre_script2)

    # Verificar si los scripts fueron encontrados
    if ruta_script1 is None:
        print(f"No se encontró el archivo: {nombre_script1}")
        exit(1)
    if ruta_script2 is None:
        print(f"No se encontró el archivo: {nombre_script2}")
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