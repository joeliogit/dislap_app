# Guía de Despliegue en Raspberry Pi (Nginx + MariaDB + PM2)

Esta guía detalla los pasos exactos para desplegar la aplicación "Disslapp" (Frontend en React/Vite y Backend en Node.js/Express) en una Raspberry Pi desde cero, clonando el repositorio desde GitHub.

## 1. Actualizar el sistema e instalar dependencias

Conéctate a tu Raspberry Pi por SSH y ejecuta los siguientes comandos para actualizar el sistema e instalar Git, MariaDB, Nginx y Node.js.

```bash
# Actualizar repositorios y paquetes
sudo apt update && sudo apt upgrade -y

# Instalar Git, Nginx y MariaDB
sudo apt install -y git nginx mariadb-server

# Instalar Node.js (versión 20.x recomendada) y npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2 globalmente para mantener el backend ejecutándose en segundo plano
sudo npm install -y -g pm2
```

## 2. Configurar la Base de Datos (MariaDB)

Primero, asegura la instalación de MariaDB (opcional pero recomendado):

```bash
sudo mysql_secure_installation
# Responde 'Y' a las opciones de seguridad y establece una contraseña de root si te lo pide.
```

Entra a la consola de MariaDB:

```bash
sudo mysql -u root -p
```

Dentro de la consola de MariaDB, ejecuta los siguientes comandos SQL para crear la base de datos y el usuario:

```sql
-- Crear la base de datos
CREATE DATABASE disslapp DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear el usuario (cambia 'contraseña_segura' por una real)
CREATE USER 'disslapp_user'@'localhost' IDENTIFIED BY 'contraseña_segura';

-- Otorgar todos los permisos al usuario sobre la base de datos
GRANT ALL PRIVILEGES ON disslapp.* TO 'disslapp_user'@'localhost';

-- Aplicar los cambios y salir
FLUSH PRIVILEGES;
EXIT;
```

## 3. Clonar el repositorio desde GitHub

Clona tu repositorio en el directorio `home` de la Raspberry Pi:

```bash
# Cambia a tu directorio de usuario
cd ~

# Clona el repositorio (Reemplaza la URL por la tuya de GitHub)
git clone https://github.com/tu-usuario/dislap_app-main.git
cd dislap_app-main/dislap_app-main
```

## 4. Configurar e importar la Base de Datos

Importa el esquema de la base de datos desde el archivo SQL del proyecto:

```bash
# Navegar a la carpeta del backend
cd backend

# Importar el esquema
mysql -u disslapp_user -p disslapp < database.sql
# (Te pedirá la 'contraseña_segura' que configuraste en el paso 2)
```

## 5. Configurar y lanzar el Backend

Configura las variables de entorno, instala las dependencias y lanza el servidor con PM2:

```bash
# Instalar dependencias del backend
npm install

# Crear el archivo .env basado en el de ejemplo
cp .env.example .env

# Editar el archivo .env (puedes usar nano)
nano .env
```

Asegúrate de que el archivo `.env` del backend contenga la conexión correcta a tu base de datos local:

```ini
DB_HOST=localhost
DB_PORT=3306
DB_USER=disslapp_user
DB_PASSWORD=contraseña_segura
DB_NAME=disslapp
PORT=3001
JWT_SECRET=tu_clave_secreta_aqui
```
*(Guarda con `Ctrl+O`, `Enter`, y sal con `Ctrl+X`)*

Lanza el backend usando PM2:

```bash
# Iniciar el backend con pm2
pm2 start server.js --name "disslapp-backend"

# Configurar PM2 para que el backend se inicie automáticamente al reiniciar la Raspberry
pm2 startup
# (Este comando te dará una instrucción que debes copiar y pegar en la terminal y ejecutarla)

pm2 save
```

## 6. Configurar y compilar el Frontend

Ahora vamos a compilar la parte de React:

```bash
# Volver a la raíz del repositorio
cd ~/dislap_app-main/dislap_app-main

# Instalar dependencias del frontend
npm install

# Construir (build) el proyecto para producción
npm run build
```

Una vez compilado, movemos los archivos generados (carpeta `dist`) al directorio donde Nginx los va a servir:

```bash
# Crear un directorio para la app en /var/www
sudo mkdir -p /var/www/disslapp

# Copiar el contenido de la carpeta 'dist' a /var/www/disslapp
sudo cp -r dist/* /var/www/disslapp/

# Dar permisos al usuario de Nginx (www-data)
sudo chown -R www-data:www-data /var/www/disslapp
sudo chmod -R 755 /var/www/disslapp
```

## 7. Configurar Nginx

Crear un archivo de configuración en Nginx para tu aplicación:

```bash
sudo nano /etc/nginx/sites-available/disslapp
```

Pega la siguiente configuración. Esto sirve el frontend estático y actúa como proxy inverso (`proxy_pass`) para mandar las peticiones `/api` al backend de Node.js:

```nginx
server {
    listen 80;
    
    # Opcional: si tienes un dominio, ponlo aquí (ej: server_name disslapp.com;)
    server_name _; 

    root /var/www/disslapp;
    index index.html;

    # Sirve el frontend (React Router necesita redirigir al index.html)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Redirige las peticiones /api al backend Node.js (PM2 corriendo en puerto 3001)
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
*(Guarda con `Ctrl+O`, `Enter`, y sal con `Ctrl+X`)*

Habilitar el sitio en Nginx:

```bash
# Crear enlace simbólico a sites-enabled
sudo ln -s /etc/nginx/sites-available/disslapp /etc/nginx/sites-enabled/

# Opcional: Eliminar la página por defecto de Nginx si causa conflictos
sudo rm /etc/nginx/sites-enabled/default

# Verificar que la sintaxis de Nginx sea correcta
sudo nginx -t

# Si todo es "ok", reiniciar Nginx
sudo systemctl restart nginx
```

## 8. ¡Listo!

Ahora puedes abrir el navegador web de cualquier dispositivo conectado a tu red local, ingresar la dirección IP de tu Raspberry Pi (por ejemplo, `http://100.102.160.109/`) y deberías poder ver tu página funcionando perfectamente. El frontend se comunicará con el backend a través de Nginx en la misma IP usando la ruta `/api`.
