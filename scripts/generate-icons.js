#!/usr/bin/env node
/**
 * AppForge — Generador de icono y splash automático
 * Uso: node scripts/generate-icons.js "Nombre de la App" "#0a0f1d"
 * Genera: assets/icon.png (1024x1024) y assets/splash.png (2732x2732)
 */

const fs = require('fs');
const path = require('path');

const appName = process.argv[2] || 'AppForge';
const bgColor = process.argv[3] || '#0a0f1d';
const assetsDir = path.join(__dirname, '..', 'assets');

// Crear directorio si no existe
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Función para convertir hex a RGB
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// Generar icono PNG (1024x1024) con texto
function generateIcon() {
  const size = 1024;
  const bg = hexToRgb(bgColor);
  const { r, g, b } = bg;

  // Crear PNG con un fondo de color y una letra inicial
  const initial = appName.charAt(0).toUpperCase();

  // SVG → PNG (escribimos SVG como placeholder, @capacitor/assets lo convierte)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:rgb(${r},${g},${b})" />
        <stop offset="100%" style="stop-color:rgb(${Math.max(0,r-30)},${Math.max(0,g-30)},${Math.max(0,b-30)})" />
      </linearGradient>
      <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#10b981" />
        <stop offset="100%" style="stop-color:#06b6d4" />
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="225" fill="url(#bg)" />
    <text x="50%" y="50%" font-family="Arial,sans-serif" font-size="500" font-weight="bold"
          text-anchor="middle" dominant-baseline="central" fill="url(#accent)">${initial}</text>
  </svg>`;

  // Guardar como SVG (Capacitor assets lo convierte)
  fs.writeFileSync(path.join(assetsDir, 'icon.svg'), svg);

  // Generar PNG básico con el header PNG mínimo
  // Como no tenemos canvas en Node puro, generamos un PNG sólido de 1024x1024
  generateSolidPng(path.join(assetsDir, 'icon.png'), size, bg);

  console.log(`✓ Icono generado: assets/icon.png (${size}x${size})`);
  console.log(`✓ Icono SVG: assets/icon.svg`);
}

// Generar splash PNG (2732x2732)
function generateSplash() {
  const size = 2732;
  const bg = hexToRgb(bgColor);

  generateSolidPng(path.join(assetsDir, 'splash.png'), size, bg);

  // Splash SVG con nombre de la app
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${bgColor}" />
    <text x="50%" y="50%" font-family="Arial,sans-serif" font-size="120" font-weight="bold"
          text-anchor="middle" dominant-baseline="central" fill="#10b981">${appName}</text>
  </svg>`;

  fs.writeFileSync(path.join(assetsDir, 'splash.svg'), svg);

  console.log(`✓ Splash generado: assets/splash.png (${size}x${size})`);
  console.log(`✓ Splash SVG: assets/splash.svg`);
}

// Generar PNG sólido (sin dependencias externas)
// Crea un PNG mínimo válido con un color sólido
function generateSolidPng(filepath, size, rgb) {
  // Usar ZLIB de Node para crear PNG válido
  const zlib = require('zlib');

  // Crear datos de pixels (RGBA, 4 bytes por pixel)
  const rowSize = size * 4 + 1; // +1 para filter byte
  const rawData = Buffer.alloc(rowSize * size);

  for (let y = 0; y < size; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < size; x++) {
      const pixOffset = rowOffset + 1 + x * 4;
      rawData[pixOffset] = rgb.r;
      rawData[pixOffset + 1] = rgb.g;
      rawData[pixOffset + 2] = rgb.b;
      rawData[pixOffset + 3] = 255; // Alpha
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // Construir PNG
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);  // Width
  ihdrData.writeUInt32BE(size, 4);  // Height
  ihdrData[8] = 8;   // Bit depth
  ihdrData[9] = 6;   // Color type: RGBA
  ihdrData[10] = 0;  // Compression
  ihdrData[11] = 0;  // Filter
  ihdrData[12] = 0;  // Interlace

  const ihdr = createChunk('IHDR', ihdrData);
  const idat = createChunk('IDAT', compressed);
  const iend = createChunk('IEND', Buffer.alloc(0));

  const png = Buffer.concat([signature, ihdr, idat, iend]);
  fs.writeFileSync(filepath, png);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, 'ascii');
  const crc = crc32(Buffer.concat([typeBuffer, data]));
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc >>> 0, 0);
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
    }
  }
  return crc ^ 0xFFFFFFFF;
}

// Ejecutar
console.log(`🎨 Generando assets para: ${appName}`);
console.log(`   Color de fondo: ${bgColor}`);
generateIcon();
generateSplash();
console.log('✅ Assets generados correctamente');
