import { useCallback, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import Aurora from './components/reactbits/Aurora.jsx'
import BlurText from './components/reactbits/BlurText.jsx'
import ClickSpark from './components/reactbits/ClickSpark.jsx'
import Noise from './components/reactbits/Noise.jsx'
import ShinyText from './components/reactbits/ShinyText.jsx'
import TarjetaProducto, { filaVariants } from './components/TarjetaProducto.jsx'
import BotonWhatsApp from './components/BotonWhatsApp.jsx'

// URL del backend Spring Boot (GArepasAppV2).
// Orden de prioridad:
//   1. window.__API_URL__  → lo inyecta el contenedor al arrancar (config.js)
//   2. VITE_API_URL        → util para desarrollo local
//   3. localhost:8080      → por defecto
const API_URL =
    (typeof window !== 'undefined' && window.__API_URL__) ||
    import.meta.env.VITE_API_URL ||
    'http://localhost:8080'

// La aurora y el grano son decorativos: con "reducir movimiento" no se montan.
const auroraColores = ['#7A2E1F', '#F67D14', '#FED05F']

const listaVariants = {
    oculta: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
}

const marcaVariants = {
    oculta: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function App() {
    const [estado, setEstado] = useState('cargando') // cargando | listo | error | vacio
    const [productos, setProductos] = useState([])
    const [animar, setAnimar] = useState(
        () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    )

    const cargar = useCallback(async () => {
        setEstado('cargando')
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
                        <TarjetaProducto key={producto.id} producto={producto} />
                    ))}
                </motion.ul>
            )}

            <div className="carta__divisor" aria-hidden="true"><span>◆</span></div>

            {estado === 'listo' && (
                <div className="carta__pedido-desktop">
                    <p className="carta__pedido-rotulo">
                        Los pedidos salen calientes: escríbenos y lo tienes.
                    </p>
                    <BotonWhatsApp />
                </div>
            )}

            <footer className="carta__pie">
                <img
                    className="carta__pie-logo"
                    src="/images/logo-gordo-arepas.png"
                    alt=""
                    width="44"
                    height="41"
                    loading="lazy"
                />
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

            {/* Barra de pedido fija en móvil: el CTA nunca se pierde. */}
            {estado === 'listo' && (
                <div className="pedido-barra">
                    <BotonWhatsApp className="pedido-barra__boton" />
                </div>
            )}
        </>
    )
}
