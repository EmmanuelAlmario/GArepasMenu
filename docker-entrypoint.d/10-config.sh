#!/bin/sh
# Escribe la config runtime del menu con la URL del backend.
# Se ejecuta antes de arrancar nginx (imagen oficial de nginx).
set -e

API_URL="${API_URL:-}"

cat > /usr/share/nginx/html/config.js <<CONFIG
window.__API_URL__ = "${API_URL}";
CONFIG

echo "config.js generado con API_URL='${API_URL}'"
