/**
 * Enlace de pedidos por WhatsApp.
 *
 * La URL base se inyecta en runtime (config.js -> window.__WHATSAPP_URL__)
 * o, en desarrollo, con VITE_WHATSAPP_URL. Si no hay valor configurado,
 * no hay botones: nunca se muestra un enlace roto.
 *
 * Formato aceptado en la variable: el numero con codigo de pais
 * (ej. https://wa.me/573001234567) o cualquier URL de wa.me/whatsapp.
 */
const WHATSAPP_URL =
    (typeof window !== 'undefined' && window.__WHATSAPP_URL__) ||
    import.meta.env.VITE_WHATSAPP_URL ||
    ''

export const hayWhatsApp = WHATSAPP_URL.trim().length > 0

/**
 * Devuelve el enlace de Whatsapp con el mensaje prellenado, o null si
 * la URL no esta configurada.
 */
export function enlacePedido(mensaje) {
    if (!hayWhatsApp) return null
    const separador = WHATSAPP_URL.includes('?') ? '&' : '?'
    return `${WHATSAPP_URL}${separador}text=${encodeURIComponent(mensaje)}`
}
