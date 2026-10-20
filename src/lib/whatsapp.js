const WHATSAPP_URL =
    (typeof window !== 'undefined' && window.__WHATSAPP_URL__) ||
    import.meta.env.VITE_WHATSAPP_URL ||
    ''

export const hayWhatsApp = WHATSAPP_URL.trim().length > 0

export function enlacePedido(mensaje) {
    if (!hayWhatsApp) return null
    const separador = WHATSAPP_URL.includes('?') ? '&' : '?'
    return `${WHATSAPP_URL}${separador}text=${encodeURIComponent(mensaje)}`
}
