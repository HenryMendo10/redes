## Instalación y Configuración

### Backend (Python y PostgreSQL)

1. Cambiar la Política de Ejecución (Windows):
      Set-ExecutionPolicy RemoteSigned -Scope Process
   
2. Crear y Activar Entorno Virtual:
   python -m venv env
   .\env\Scripts\Activate  # Windows
   source env/bin/activate  # MacOS/Linux

3. Instalar Dependencias de Python desde archivo.txt:
   # requirements.txt

# Módulos del sistema operativo y manejo de HTTP
requests
hashlib
json
time
datetime

# Colecciones y manipulación de datos
collections

# Conexión a PostgreSQL
psycopg2

# Framework web Flask y manejo de CORS
Flask
flask_cors

Para instalar las dependencias:

4. Para instalar las dependencias:
   pip install -r requirements.txt

5. Inicializar y Ejecutar PostgreSQL (Docker):
   docker run -d -p 5432:5432 --name postgres-db -e POSTGRES_PASSWORD=mysecretpassword postgres

7. Ejecutar Backend:
    python server.py


Frontend (React)

1. Instalar Dependencias de Node.js:
    npm install
   
3. Ejecutar Aplicación Frontend:
   npm start


