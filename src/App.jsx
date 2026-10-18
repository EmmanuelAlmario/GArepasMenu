import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Aurora from './components/reactbits/Aurora.jsx'
import BlurText from './components/reactbits/BlurText.jsx'
import ClickSpark from './components/reactbits/ClickSpark.jsx'
import GlareHover from './components/reactbits/GlareHover.jsx'
import Noise from './components/reactbits/Noise.jsx'
import ShinyText from './components/reactbits/ShinyText.jsx'
import IlustracionProducto from './components/IlustracionProducto.jsx'
import { detalleDe } from './data/detalles.js'

// URL del backend Spring Boot (GArepasAppV2).
// Orden de prioridad:
//   1. window.__API_URL__  → lo inyecta el contenedor al arrancar (config.js)
//   2. VITE_API_URL        → util para desarrollo local
//   3. localhost:8080      → por defecto
const API_URL =
    (typeof window !== 'undefined' && window.__API_URL__) ||
    import.meta.env.VITE_API_URL ||
    'http://localhost:8080'

const monetizar = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
})

// La aurora y el grano son decorativos: con "reducir movimiento" no se montan.
const auroraColores = ['#7A2E1F', '#F67D14', '#FED05F']

const listaVariants = {
    oculta: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
}

const filaVariants = {
    oculta: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

const marcaVariants = {
    oculta: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

const transicionFicha = {
    height: { duration: 0.34, ease: [0.25, 0.8, 0.35, 1] },
    opacity: { duration: 0.24, ease: 'easeOut' },
}

function ProductoFila({ producto, abierto, modoHover, animar, onAbrir, onCerrar, onAlternar }) {
    const detalle = detalleDe(producto)
    const agotado = !producto.disponible
    const idFicha = `ficha-producto-${producto.id}`
    const temporizador = useRef(null)

    // Pequeña demora al salir para no cerrar por un movimiento accidental.
    const entrar = () => {
        window.clearTimeout(temporizador.current)
        onAbrir()
    }

    const programarCierre = () => {
        window.clearTimeout(temporizador.current)
        temporizador.current = window.setTimeout(onCerrar, 140)
    }

    useEffect(() => () => window.clearTimeout(temporizador.current), [])

    return (
        <motion.li
            className={agotado ? 'producto-item producto--agotado' : 'producto-item'}
            variants={filaVariants}
            onMouseEnter={modoHover ? entrar : undefined}
            onMouseLeave={modoHover ? programarCierre : undefined}
        >
            {/* Con puntero fino manda el hover (y el foco de teclado):
                el clic no alterna para no cerrar por sorpresa.
                En táctil, el toque abre y cierra. */}
            <button
                type="button"
                className="producto"
                aria-expanded={abierto}
                aria-controls={idFicha}
                onClick={modoHover ? undefined : onAlternar}
                onFocus={modoHover ? entrar : undefined}
                onBlur={modoHover ? onCerrar : undefined}
            >
                <GlareHover
                    className="producto__fila"
                    width="100%"
                    height="auto"
                    background="transparent"
                    borderColor="transparent"
                    borderRadius="8px"
                    glareColor="#FED05F"
                    glareOpacity={0.16}
                    glareAngle={-45}
                    glareSize={60}
                    transitionDuration={900}
                >
                    <span className="producto__indicador" aria-hidden="true">+</span>
                    <span className="producto__nombre">{producto.nombre}</span>
                    <span className="producto__puntos" aria-hidden="true" />
                    <span className="producto__precio">{monetizar.format(producto.precio)}</span>
                </GlareHover>
                {agotado && <span className="producto__sello">Agotado</span>}
            </button>

            <AnimatePresence initial={false}>
                {abierto && (
                    <motion.div
                        id={idFicha}
                        className="producto__ficha"
                        initial={animar ? { height: 0, opacity: 0 } : false}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={animar ? { height: 0, opacity: 0 } : undefined}
                        transition={animar ? transicionFicha : { duration: 0 }}
                    >
                        <motion.div
                            className="producto__ficha-contenido"
                            initial={animar ? { y: -10, opacity: 0 } : false}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: animar ? 0.3 : 0, delay: animar ? 0.08 : 0, ease: 'easeOut' }}
                        >
                            {detalle.imagen
                                ? <img className="producto__ilustracion" src={detalle.imagen} alt="" loading="lazy" />
                                : <IlustracionProducto nombre={producto.nombre} />}
                            <div className="producto__ficha-texto">
                                <p className="producto__descripcion">{detalle.descripcion}</p>
                                {detalle.ingredientes.length > 0 && (
                                    <>
                                        <p className="producto__ingredientes-titulo">Ingredientes</p>
                                        <ul className="producto__chips">
                                            {detalle.ingredientes.map((ingrediente) => (
                                                <li key={ingrediente} className="producto__chip">{ingrediente}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                                {agotado && <p className="producto__nota-agotado">Hoy no está disponible.</p>}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.li>
    )
}

export default function App() {
    const [estado, setEstado] = useState('cargando') // cargando | listo | error | vacio
    const [productos, setProductos] = useState([])
    const [abiertoId, setAbiertoId] = useState(null)
    const [modoHover, setModoHover] = useState(false)
    const [animar, setAnimar] = useState(
        () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    )

    const cargar = useCallback(async () => {
        setEstado('cargando')
        setAbiertoId(null)
        try {
            const respuesta = await fetch(`${API_URL}/api/public/menu`)
            if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`)
            const datos = await respuesta.json()
            setProductos(datos)
            setEstado(datos.length === 0 ? 'vacio' : 'listo')
        } catch {
            setEstado('error')
        }
    }, [])

    useEffect(() => {
        cargar()
    }, [cargar])

    // Solo los dispositivos con puntero fino abren la ficha al pasar el cursor.
    useEffect(() => {
        const consulta = window.matchMedia('(hover: hover) and (pointer: fine)')
        const actualizar = () => setModoHover(consulta.matches)
        actualizar()
        consulta.addEventListener('change', actualizar)
        return () => consulta.removeEventListener('change', actualizar)
    }, [])

    useEffect(() => {
        const alPresionar = (evento) => {
            if (evento.key === 'Escape') setAbiertoId(null)
        }
        window.addEventListener('keydown', alPresionar)
        return () => window.removeEventListener('keydown', alPresionar)
    }, [])

    const contenido = (
        <>
            {estado === 'cargando' && (
                <p className="carta__estado" role="status">
                    <strong className="carta__estado-titulo">Encendiendo la pizarra...</strong>
                </p>
            )}

            {estado === 'error' && (
                <div className="carta__estado" role="alert">
                    <strong className="carta__estado-titulo">Se cayó la pizarra.</strong>
                    <span className="carta__estado-texto">
                        No pudimos conectar con la cocina. Revisa tu conexión e intenta de nuevo.
                    </span>
                    <button type="button" className="carta__reintentar" onClick={cargar}>
                        Reintentar
                    </button>
                </div>
            )}

            {estado === 'vacio' && (
                <p className="carta__estado">
                    <strong className="carta__estado-titulo">Hoy la pizarra está vacía.</strong>
                    <span className="carta__estado-texto">Vuelve pronto: salen arepas calientes.</span>
                </p>
            )}

            {estado === 'listo' && (
                <motion.ul
                    className="carta__lista"
                    initial={animar ? 'oculta' : false}
                    animate="visible"
                    variants={listaVariants}
                >
                    {productos.map((producto) => (
                        <ProductoFila
                            key={producto.id}
                            producto={producto}
                            abierto={abiertoId === producto.id}
                            modoHover={modoHover}
                            animar={animar}
                            onAbrir={() => setAbiertoId(producto.id)}
                            onCerrar={() => setAbiertoId((actual) => (actual === producto.id ? null : actual))}
                            onAlternar={() => setAbiertoId((actual) => (actual === producto.id ? null : producto.id))}
                        />
                    ))}
                </motion.ul>
            )}

            <div className="carta__divisor" aria-hidden="true"><span>◆</span></div>

            <footer className="carta__pie">
                <p className="carta__firma">¡Hechas al momento!</p>
                <p className="carta__legal">Precios sujetos a cambios.</p>
            </footer>
        </>
    )

    return (
        <>
            {animar && (
                <div className="aurora-fondo" aria-hidden="true">
                    <Aurora
                        colorStops={auroraColores}
                        amplitude={1.1}
                        blend={0.55}
                        speed={0.8}
                    />
                </div>
            )}

            {animar && (
                <div className="ruido-fondo" aria-hidden="true">
                    <Noise patternAlpha={10} patternRefreshInterval={14} />
                </div>
            )}

            <main className="carta">
                <motion.header
                    className="carta__marca"
                    initial={animar ? 'oculta' : false}
                    animate="visible"
                    variants={marcaVariants}
                >
                    <img
                        className="carta__logo"
                        src="/images/logo-gordo-arepas.png"
                        alt=""
                        width="120"
                        height="111"
                        loading="eager"
                    />
                    <BlurText
                        tag="h1"
                        className="carta__titulo"
                        text="Gordo Arepas"
                        animateBy="letters"
                        direction="top"
                        delay={40}
                        stepDuration={0.3}
                    />
                    <p className="carta__sub">
                        <ShinyText
                            text="— arepas artesanales —"
                            color="#E9D8BE"
                            shineColor="#FED05F"
                            speed={3}
                            spread={100}
                            disabled={!animar}
                        />
                    </p>
                    <p className="carta__nota" aria-hidden="true">Hechas con amor</p>
                </motion.header>

                {animar ? (
                    <ClickSpark
                        sparkColor="#FED05F"
                        sparkSize={9}
                        sparkRadius={18}
                        sparkCount={9}
                        duration={480}
                        easing="ease-out"
                    >
                        {contenido}
                    </ClickSpark>
                ) : (
                    contenido
                )}
            </main>
        </>
    )
}