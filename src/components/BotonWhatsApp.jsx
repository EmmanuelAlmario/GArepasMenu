/**
 * Boton de pedido por WhatsApp: pastilla verde con el icono del chat.
 *
 * Acepta un mensaje prellenado opcional. Se oculta por completo
 * si WHATSAPP_URL no esta configurada (sin enlace, sin boton).
 */
import { enlacePedido, hayWhatsApp } from '../lib/whatsapp.js'

function IconoWhatsApp() {
    return (
        <svg
            className="boton-wa__icono"
            viewBox="0 0 32 32"
            width="20"
            height="20"
            aria-hidden="true"
            focusable="false"
        >
            <path
                fill="currentColor"
                d="M16.02 4C9.44 4 4.1 9.33 4.1 15.9c0 2.1.55 4.16 1.6 5.97L4 28l6.28-1.64a11.94 11.94 0 0 0 5.73 1.46h.01c6.57 0 11.9-5.33 11.9-11.9C27.92 9.33 22.6 4 16.02 4Zm0 21.82c-1.8 0-3.57-.48-5.11-1.4l-.37-.22-3.73.98 1-3.63-.24-.38a9.86 9.86 0 0 1-1.51-5.27c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.14 1.03 7 2.9a9.85 9.85 0 0 1 2.9 7.01c0 5.46-4.44 9.9-9.86 9.9Zm5.44-7.42c-.3-.15-1.83-.9-2.11-1-.28-.11-.49-.16-.7.15-.2.3-.8.98-1 1.18-.2.2-.36.23-.66.08-.3-.15-1.3-.48-2.46-1.52-.91-.81-1.52-1.8-1.7-2.1-.18-.3-.02-.47.13-.62.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.7-1.68-.96-2.3-.25-.6-.5-.52-.7-.53h-.6c-.2 0-.53.08-.8.38-.28.3-1.06 1.02-1.06 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.13 4.54.72.31 1.27.5 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.83-.75 2.09-1.47.26-.72.26-1.34.18-1.47-.07-.13-.27-.2-.57-.35Z"
            />
        </svg>
    )
}

export default function BotonWhatsApp({
    mensaje = 'Hola, quiero hacer un pedido.',
    texto = 'Pedir por WhatsApp',
    className = 'boton-wa',
}) {
    const enlace = enlacePedido(mensaje)
    if (!hayWhatsApp || !enlace) return null

    return (
        <a
            href={enlace}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
        >
            <IconoWhatsApp />
            <span>{texto}</span>
        </a>
    )
}
