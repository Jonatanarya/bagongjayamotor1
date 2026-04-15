# 🖥️ VPS Setup — bagongjayamotor.com (Ubuntu 24.04 LTS)

Semua perintah tinggal **copy-paste langsung** ke terminal VPS.

---

## Step 1: Update System & Install Dependencies

```bash
apt update && apt upgrade -y
```

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

```bash
node -v && npm -v
```

```bash
apt install -y postgresql postgresql-contrib nginx git certbot python3-certbot-nginx
```

```bash
npm install -g pm2
```

---

## Step 2: Setup Database PostgreSQL

```bash
sudo -u postgres psql
```

Jalankan di dalam prompt `postgres=#` :

```sql
CREATE USER bagong WITH PASSWORD 'BagongJaya2026!Motor';
CREATE DATABASE bagong_jaya_motor OWNER bagong;
GRANT ALL PRIVILEGES ON DATABASE bagong_jaya_motor TO bagong;
\q
```

> ⚠️ Boleh ganti password `BagongJaya2026!Motor` — tapi **pastikan sama** dengan yang di Step 4.

---

## Step 3: Clone Repository

```bash
cd /var/www
git clone https://github.com/Jonatanarya/bagongjayamotor1.git bagong-jaya-motor
cd bagong-jaya-motor
```

---

## Step 4: Setup & Build Backend

```bash
cd /var/www/bagong-jaya-motor/backend
npm install
```

Buat file `.env`:

```bash
cat > .env << 'EOF'
DATABASE_URL=postgresql://bagong:BagongJaya2026!Motor@localhost:5432/bagong_jaya_motor
DB_LOGGING=false
AUTH_URL=https://api.bagongjayamotor.com
AUTH_SECRET=GANTI_INI
AUTH_BASE_URL=https://api.bagongjayamotor.com/api/auth
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://bagongjayamotor.com,https://www.bagongjayamotor.com,https://admin.bagongjayamotor.com
MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads
LOG_LEVEL=info
EOF
```

Generate AUTH_SECRET lalu paste ke `.env`:

```bash
echo "AUTH_SECRET yang di-generate:"
openssl rand -base64 32
```

Edit `.env`, ganti `GANTI_INI` dengan hasil di atas:

```bash
nano .env
```
> Tekan `Ctrl+O` → Enter → `Ctrl+X` untuk save & keluar nano.

Build & jalankan:

```bash
npm run build
npm run db:push
```

```bash
pm2 start dist/index.js --name "bagong-api"
curl http://localhost:3000/health
```

> Harus muncul: `{"status":"OK","database":"Connected",...}`

```bash
pm2 save
pm2 startup
```
> Jika muncul perintah yang harus di-copy, **jalankan perintah itu**.

---

## Step 5: Build Frontend & Admin

```bash
cd /var/www/bagong-jaya-motor/frontend
npm install
echo 'VITE_API_BASE_URL=https://api.bagongjayamotor.com/api' > .env.production
npm run build
```

```bash
cd /var/www/bagong-jaya-motor/admin
npm install
echo 'VITE_API_BASE_URL=https://api.bagongjayamotor.com/api' > .env.production
npm run build
```

---

## Step 6: Konfigurasi Nginx

```bash
cat > /etc/nginx/sites-available/bagong-jaya-motor << 'EOF'
server {
    listen 80;
    server_name bagongjayamotor.com www.bagongjayamotor.com;

    root /var/www/bagong-jaya-motor/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}

server {
    listen 80;
    server_name admin.bagongjayamotor.com;

    root /var/www/bagong-jaya-motor/admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}

server {
    listen 80;
    server_name api.bagongjayamotor.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
```

```bash
ln -sf /etc/nginx/sites-available/bagong-jaya-motor /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

---

## Step 7: Setup DNS di Hostinger

Buka **Hostinger Panel → Domain → DNS Zone** untuk `bagongjayamotor.com`:

| Type | Name | Value |
|------|------|-------|
| **A** | `@` | `IP_VPS_KAMU` |
| **A** | `www` | `IP_VPS_KAMU` |
| **A** | `admin` | `IP_VPS_KAMU` |
| **A** | `api` | `IP_VPS_KAMU` |

> Cek IP VPS kamu: jalankan `curl ifconfig.me` di terminal VPS.

Tunggu **5-30 menit** untuk DNS propagasi. Cek di: https://dnschecker.org/?q=bagongjayamotor.com

---

## Step 8: Pasang SSL (HTTPS)

> ⚠️ **Jalankan setelah DNS sudah aktif!** Test dulu: `ping bagongjayamotor.com`

```bash
certbot --nginx -d bagongjayamotor.com -d www.bagongjayamotor.com -d admin.bagongjayamotor.com -d api.bagongjayamotor.com
```

> Saat diminta: masukkan email → `Y` agree → pilih `2` (redirect to HTTPS)

```bash
certbot renew --dry-run
```

---

## ✅ Step 9: Verifikasi — Buka di Browser

| URL | Tampilan |
|-----|----------|
| https://bagongjayamotor.com | Website publik |
| https://admin.bagongjayamotor.com | Dashboard admin |
| https://api.bagongjayamotor.com/health | `{"status":"OK",...}` |

---

## 🔄 Update di Masa Depan

```bash
cd /var/www/bagong-jaya-motor
git pull origin master
bash deploy.sh all
```
