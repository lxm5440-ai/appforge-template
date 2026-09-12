# 🚀 AppForge Template

Plantilla para crear **APKs Android** desde HTML/JS/CSS vanilla usando **Capacitor 6** y **GitHub Actions**.

## ✨ Características

- 📱 **HTML + JS + CSS vanilla** — sin frameworks, sin npm install complejo
- ⚙️ **Configuración centralizada** — todo en `app.config.json`
- 🎨 **Assets autogenerados** — script que genera icono y splash
- 🤖 **Skill para agentes IA** — los agentes saben cómo crear APKs
- 🔨 **Compilación automática** — GitHub Actions con keyword `[compile]`
- 📦 **APK debug listo** — descargable directamente de GitHub Actions

## 📁 Estructura

```
appforge-template/
├── www/                        # App web vanilla
│   ├── index.html              # Página principal
│   ├── css/style.css           # Estilos
│   └── js/
│       ├── tailwind.js          # Tailwind CSS (local, sin CDN)
│       ├── lucide.js            # Iconos (local)
│       └── app.js               # Lógica + utilidades (RF.*)
├── assets/                     # Icono y splash
├── android-plugin/             # Plugins Java nativos (opcional)
├── scripts/
│   └── generate-icons.js       # Generador de icono + splash
├── skills/
│   └── appforge-apk-builder.md # Skill para agentes IA
├── .github/workflows/
│   └── build.yml                # Workflow GitHub Actions
├── app.config.json              # Configuración ⭐
├── capacitor.config.json
└── package.json
```

## 🚀 Inicio rápido

### 1. Clonar la plantilla
```bash
git clone https://github.com/josevdr95new/appforge-template.git mi-app
cd mi-app
```

### 2. Configurar
Edita `app.config.json`:
```json
{
  "appId": "io.github.josevdr95.miapp",
  "appName": "Mi App",
  "version": "1.0.0",
  "versionCode": 1,
  "description": "Descripción de mi app",
  "author": {
    "name": "josevdr95",
    "email": "josevdr95@gmail.com"
  },
  "license": "MIT",
  "licenseYear": "2026"
}
```

### 3. Generar iconos
```bash
node scripts/generate-icons.js "Mi App" "#0a0f1d"
```

### 4. Desarrollar la app
Edita `www/index.html`, `www/css/style.css`, `www/js/app.js`

### 5. Compilar
```bash
git add .
git commit -m "Mi App v1.0.0 [compile]"
git push origin main
```

### 6. Descargar APK
Ve a **Actions** en GitHub → descarga **APK-Instalable**

## 🤖 Skill para Agentes IA

El archivo `skills/appforge-apk-builder.md` contiene instrucciones detalladas para que cualquier agente IA (PSCoder, Claude, GPT) sepa cómo:

- Crear la estructura del proyecto
- Configurar app.config.json
- Desarrollar la app web vanilla
- Crear plugins Java nativos
- Configurar permisos Android
- Subir al repo y compilar

## ⚙️ Configuración — app.config.json

| Campo | Descripción | Default |
|-------|-------------|---------|
| `appId` | ID único (ej: com.empresa.app) | — |
| `appName` | Nombre visible | — |
| `version` | Versión semántica (x.x.x) | 1.0.0 |
| `versionCode` | Número de build | 1 |
| `android.minSdkVersion` | SDK mínimo | 24 |
| `android.targetSdkVersion` | SDK objetivo | 34 |
| `android.permissions` | Array de permisos | [INTERNET] |
| `build.compile` | Compilar automáticamente | true |

## 🔌 Control de compilación

| Keyword en commit | Acción |
|---|---|
| `[compile]` `[compilar]` `[build]` | Compila |
| `[skip]` `[noc]` | No compila |
| Sin keyword | Compila si build.compile=true |

## 📦 Permisos Android comunes

```json
"permissions": [
  "android.permission.INTERNET",
  "android.permission.ACCESS_NETWORK_STATE",
  "android.permission.ACCESS_FINE_LOCATION",
  "android.permission.READ_PHONE_STATE",
  "android.permission.CAMERA",
  "android.permission.SYSTEM_ALERT_WINDOW",
  "android.permission.FOREGROUND_SERVICE",
  "android.permission.VIBRATE",
  "android.permission.WAKE_LOCK"
]
```

## 🎨 Generar iconos

```bash
node scripts/generate-icons.js "Nombre App" "#color_hex"
```

Genera automáticamente:
- `assets/icon.png` (1024×1024)
- `assets/splash.png` (2732×2732)
- `assets/icon.svg` y `assets/splash.svg`

## 📱 Apps creadas con esta plantilla

- **Antena ETECSA** — Mapa de antenas celulares con GPS
- **NetVigia** — Vigilante de red con tráfico, velocidad y mapa de Cuba
- **SlideLock** — Bloqueo de pantalla con sensor de proximidad

## 📄 Licencia

MIT © 2026 — josevdr95 (josevdr95@gmail.com)
