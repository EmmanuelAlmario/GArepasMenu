/**
 * Tarjeta de producto para la carta: ilustracion, descripcion, precio
 * protagonista y pedido directo por WhatsApp.
 *
 * Todos los datos visibles vienen de la API publica (lista blanca:
 * id, nombre, precio, disponible) o del mapa de detalles local.
 */
import { motion } from 'motion/react'
import GlareHover from './reactbits/GlareHover.jsx'
import IlustracionProducto from './IlustracionProducto.jsx'
import BotonWhatsApp from './BotonWhatsApp.jsx'
import { detalleDe } from '../data/detalles.js'
import { hayWhatsApp } from '../lib/whatsapp.js'

const monetizar = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
})

export const filaVariants = {
    oculta: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

export default function TarjetaProducto({ producto }) {
    const detalle = detalleDe(producto)
    const agotado = !producto.disponible
    const mensaje = `Hola, quiero pedir: ${producto.nombre.trim()}`

    return (
        <motion.li
            className={agotado
                ? 'tarjeta-item tarjeta-item--agotado'
                : 'tarjeta-item'}
            variants={filaVariants}
        >
            <GlareHover
                className="tarjeta__marco"
                width="100%"
                height="auto"
                background="transparent"
                borderColor="transparent"
                borderRadius="12px"
                glareColor="#FED05F"
                glareOpacity={0.14}
                glareAngle={-45}
                glareSize={90}
                transitionDuration={900}
            >
                <div className="tarjeta__cuerpo">
                    <div className="tarjeta__visual" aria-hidden="true">
                        {detalle.imagen
                            ? <img className="tarjeta__ilustracion" src={detalle.imagen} alt="" loading="lazy" />
                            : <IlustracionProducto nombre={producto.nombre} />}
                        <span className={agotado
                            ? 'tarjeta__estado tarjeta__estado--agotado'
                            : 'tarjeta__estado'}
                        >
                            {agotado ? 'Agotado' : 'Disponible'}
                        </span>
                    </div>

                    <div className="tarjeta__datos">
                        <h2 className="tarjeta__nombre">{producto.nombre.trim()}</h2>
                        <p className="tarjeta__descripcion">{detalle.descripcion}</p>

                        {detalle.ingredientes.length > 0 && (
                            <ul className="tarjeta__chips" aria-label="Ingredientes">
                                {detalle.ingredientes.map((ingrediente) => (
                                    <li key={ingrediente} className="tarjeta__chip">{ingrediente}</li>
                                ))}
                            </ul>
                        )}

                        <div className="tarjeta__pie">
                            <span className="tarjeta__precio">
                                {monetizar.format(producto.precio)}
                            </span>
                            {!agotado && hayWhatsApp && (
                                <BotonWhatsApp
                                    mensaje={mensaje}
                                    texto="Pedir este"
                                    className="tarjeta__pedir"
                                />
                            )}
                        </div>
                        {agotado && (
                            <p className="tarjeta__nota-agotado">
                                Hoy no está disponible, pero vuelve pronto.
                            </p>
                        )}
                    </div>
                </div>
            </GlareHover>
        </motion.li>
    )
}
