#!/bin/sh
# Escribe la config runtime del menu: URL del backend y WhatsApp de pedidos.
# Se ejecuta antes de arrancar nginx (imagen oficial de nginx).
set -e

API_URL="${API_URL:-}"
WHATSAPP_URL="${WHATSAPP_URL:-}"

cat > /usr/share/nginx/html/config.js <<CONFIG
window.__API_URL__ = "${API_URL}";
window.__WHATSAPP_URL__ = "${WHATSAPP_URL}";
CONFIG

echo "config.js generado con API_URL='${API_URL}' y WHATSAPP_URL='${WHATSAPP_URL}'"
