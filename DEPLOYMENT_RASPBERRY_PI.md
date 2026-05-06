# Guía de Despliegue en Raspberry Pi (Nginx + MariaDB + PM2 + Tailscale)

Esta guía detalla los pasos para desplegar la aplicación **Disslapp** (Frontend React/Vite en la raíz del repo y Backend Node.js/Express en `/backend`) en una Raspberry Pi desde cero.

---

## 1. Actualizar el sistema e instalar dependencias

```bash
sudo apt update && sudo apt upgrade -y

sudo apt install -y git nginx mariadb-server

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

sudo npm install -g pm2
```

---

## 2. Configurar la Base de Datos (MariaDB)

```bash
sudo mysql_secure_installation
```

Entra a la consola de MariaDB:

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE disslapp DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'disslapp_user'@'localhost' IDENTIFIED BY 'contraseña_segura';

GRANT ALL PRIVILEGES ON disslapp.* TO 'disslapp_user'@'localhost';

FLUSH PRIVILEGES;
EXIT;
```

---

## 3. Clonar el repositorio

```bash
cd ~
git clone https://github.com/tu-usuario/dislap_app-main.git
cd dislap_app-main
```

> **Nota:** El frontend principal está en la **raíz** del repositorio (no en una subcarpeta). La carpeta `disslapp_react/` es un prototipo antiguo — no la uses para el despliegue.

---

## 4. Importar el esquema de la Base de Datos

```bash
cd ~/dislap_app-main/backend
mysql -u disslapp_user -p disslapp < database.sql
```

Opcionalmente, poblar con datos de prueba:

```bash
npm install
npm run seed
```

Credenciales de prueba que genera el seed:
- Psicólogo: `doctora@clinica.com` / `dislexia123`
- Paciente: `mateo@mail.com` / `dislexia123`
- Paciente: `sofia@mail.com` / `dislexia123`

---

## 5. Configurar y lanzar el Backend

```bash
cd ~/dislap_app-main/backend
npm install

cp .env.example .env
nano .env
```

Rellena el archivo `.env` con tus valores:

```ini
DB_HOST=localhost
DB_PORT=3306
DB_USER=disslapp_user
DB_PASSWORD=contraseña_segura
DB_NAME=disslapp

PORT=3001

JWT_SECRET=una_clave_larga_y_aleatoria
JWT_EXPIRES_IN=24h

GOOGLE_CLIENT_ID=tu_google_oauth_client_id.apps.googleusercontent.com

# Stripe — https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO=
STRIPE_PRICE_PREMIUM=

# PayPal — https://developer.paypal.com/dashboard/applications
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_ENV=sandbox

# En producción, cambia esto por tu dominio o IP pública de Tailscale Funnel
FRONTEND_URL=https://tu-maquina.tu-tailnet.ts.net
```

Lanzar con PM2:

```bash
pm2 start server.js --name "disslapp-backend"
pm2 startup
# Copia y ejecuta el comando que te muestre pm2 startup
pm2 save
```

Verifica que el backend responde:

```bash
curl http://localhost:3001/api/health
```

---

## 6. Configurar y compilar el Frontend

El frontend vive en la **raíz** del repositorio (`~/dislap_app-main`), no en `disslapp_react/`.

```bash
cd ~/dislap_app-main
npm install

cp .env.example .env
nano .env
```

Rellena el `.env` del frontend:

```ini
VITE_PAYPAL_CLIENT_ID=tu_paypal_client_id
VITE_STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key
```

Compila el proyecto:

```bash
npm run build
```

Copia el resultado a Nginx:

```bash
sudo mkdir -p /var/www/disslapp
sudo cp -r dist/* /var/www/disslapp/
sudo chown -R www-data:www-data /var/www/disslapp
sudo chmod -R 755 /var/www/disslapp
```

---

## 7. Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/disslapp
```

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/disslapp;
    index index.html;

    # React Router: redirige todo al index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy inverso al backend Node.js
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

Habilitar el sitio:

```bash
sudo ln -s /etc/nginx/sites-available/disslapp /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t
sudo systemctl restart nginx
```

En este punto la app está disponible en la red local (`http://<IP-de-la-raspberry>/`).

---

## 8. Exponer al exterior con Tailscale Funnel

Tailscale Funnel permite acceder a la Raspberry Pi desde Internet sin abrir puertos en el router.

### 8.1 Instalar Tailscale

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

Sigue el enlace que aparece en la terminal para autenticar el dispositivo en tu cuenta de Tailscale.

### 8.2 Habilitar HTTPS en Nginx con el certificado de Tailscale

Tailscale Funnel requiere que el servicio local escuche en HTTPS (puerto 443) o redirigir desde Funnel al puerto 80. La forma más sencilla es dejar que Tailscale gestione el TLS y haga proxy al Nginx en el puerto 80:

```bash
# Habilitar Funnel apuntando al puerto 80 local
sudo tailscale funnel --bg 80
```

Esto crea una URL pública del tipo:
```
https://nombre-maquina.nombre-tailnet.ts.net
```

Puedes ver la URL asignada con:

```bash
tailscale funnel status
```

### 8.3 Actualizar FRONTEND_URL en el backend

Edita `~/dislap_app-main/backend/.env` y actualiza:

```ini
FRONTEND_URL=https://nombre-maquina.nombre-tailnet.ts.net
```

Reinicia el backend para que tome el nuevo valor:

```bash
pm2 restart disslapp-backend
```

### 8.4 Hacer que Funnel persista entre reinicios

Tailscale Funnel con `--bg` ya queda registrado como configuración persistente. Para confirmarlo:

```bash
tailscale funnel status
```

Si necesitas desactivarlo en algún momento:

```bash
sudo tailscale funnel off
```

---

## 9. ¡Listo!

La aplicación está disponible:

| Acceso | URL |
|--------|-----|
| Red local | `http://<IP-raspberry>/` |
| Internet (Tailscale Funnel) | `https://nombre-maquina.nombre-tailnet.ts.net` |

Para verificar el estado de los servicios:

```bash
pm2 status                  # Estado del backend
sudo systemctl status nginx # Estado del servidor web
tailscale funnel status     # Estado del túnel público
```
