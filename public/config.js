// Configuracion de desarrollo. El contenedor de produccion reescribe este
// archivo al arrancar con la URL real del backend (variable API_URL) y el
// WhatsApp de pedidos (variable WHATSAPP_URL).
// Vacio => se usan VITE_API_URL / VITE_WHATSAPP_URL o los valores por defecto.
window.__API_URL__ = "";
window.__WHATSAPP_URL__ = "";
