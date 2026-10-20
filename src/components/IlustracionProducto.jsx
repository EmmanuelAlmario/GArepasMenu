function tipoDe(nombre) {
    const n = nombre.toLowerCase()
    if (n.includes('queso')) return 'arepa-queso'
    if (n.includes('huevo')) return 'arepa-huevo'
    if (n.includes('arepa')) return 'arepa'
    if (n.includes('chocolate')) return 'chocolate'
    if (n.includes('gaseosa') || n.includes('bebida') || n.includes('jugo')) return 'gaseosa'
    return 'generico'
}

function BaseArepa({ plana = false }) {
    return (
        <>
            <ellipse cx="60" cy="82" rx="36" ry="10" fill="rgba(42, 15, 10, .18)" />
            <ellipse cx="60" cy="74" rx="36" ry={plana ? 11 : 15} fill="#D89A4E" />
            <ellipse cx="60" cy={plana ? 72 : 70} rx="36" ry={plana ? 9 : 13} fill="#F2C97F" />
        </>
    )
}

function MarcasDePlancha() {
    return (
        <g stroke="#9A5B2B" strokeWidth="3" strokeLinecap="round" opacity=".75">
            <line x1="40" y1="74" x2="48" y2="68" />
            <line x1="54" y1="76" x2="64" y2="66" />
            <line x1="70" y1="74" x2="78" y2="68" />
            <line x1="46" y1="78" x2="52" y2="74" />
            <line x1="68" y1="78" x2="74" y2="74" />
        </g>
    )
}

export default function IlustracionProducto({ nombre }) {
    const tipo = tipoDe(nombre)

    return (
        <svg className="producto__ilustracion" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
            <circle cx="60" cy="60" r="52" fill="rgba(192, 67, 11, .06)" />
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(192, 67, 11, .22)" />

            {tipo === 'arepa-queso' && (
                <g>
                    <BaseArepa />
                    <path
                        d="M42 68 c6 -9 30 -9 36 0 c-4 7 -12 10 -18 9 c-6 1 -14 -2 -18 -9 Z"
                        fill="#FED05F"
                    />
                    <path d="M61 77 c2 6 1 10 -1 12 c-3 -2 -3 -7 -1 -12 Z" fill="#FED05F" />
                    <ellipse cx="52" cy="65" rx="6" ry="3" fill="rgba(255, 255, 255, .35)" />
                </g>
            )}

            {tipo === 'arepa-huevo' && (
                <g>
                    <BaseArepa />
                    <path
                        d="M42 62 c2 -8 10 -12 18 -12 c9 0 17 5 18 12 c1 7 -7 13 -18 13 c-11 0 -19 -6 -18 -13 Z"
                        fill="#FFF7E8"
                    />
                    <circle cx="60" cy="60" r="7.5" fill="#F2A93B" />
                    <circle cx="57.5" cy="57.5" r="2.2" fill="rgba(255, 255, 255, .4)" />
                </g>
            )}

            {tipo === 'arepa' && (
                <g>
                    <BaseArepa plana />
                    <MarcasDePlancha />
                </g>
            )}

            {tipo === 'chocolate' && (
                <g>
                    <ellipse cx="60" cy="96" rx="26" ry="7" fill="rgba(42, 15, 10, .18)" />
                    <path
                        d="M80 58 c10 0 16 5 16 12 c0 7 -6 12 -16 12"
                        fill="none"
                        stroke="#6B5F57"
                        strokeWidth="6"
                        strokeLinecap="round"
                    />
                    <path d="M40 46 h40 v26 c0 12 -8 20 -20 20 s-20 -8 -20 -20 Z" fill="#F3E4C8" stroke="#6B5F57" strokeWidth="2" />
                    <rect x="40" y="58" width="40" height="7" fill="#C0430B" opacity=".9" />
                    <ellipse cx="60" cy="46" rx="20" ry="6" fill="#5C2E1A" />
                    <g fill="none" stroke="rgba(107, 95, 87, .55)" strokeWidth="3" strokeLinecap="round">
                        <path d="M51 36 q5 -6 0 -12" />
                        <path d="M60 32 q5 -6 0 -12" />
                        <path d="M69 36 q5 -6 0 -12" />
                    </g>
                </g>
            )}

            {tipo === 'gaseosa' && (
                <g>
                    <ellipse cx="60" cy="97" rx="22" ry="6" fill="rgba(42, 15, 10, .18)" />
                    <rect x="54" y="22" width="12" height="8" rx="2" fill="#C0430B" />
                    <rect x="56" y="30" width="8" height="12" fill="#C95B4A" />
                    <rect x="48" y="40" width="24" height="54" rx="10" fill="#C95B4A" />
                    <rect x="52" y="60" width="16" height="3" rx="1.5" fill="#FDF3E3" opacity=".9" />
                    <rect x="52" y="66" width="16" height="3" rx="1.5" fill="#FDF3E3" opacity=".9" />
                    <rect x="52" y="72" width="10" height="3" rx="1.5" fill="#FDF3E3" opacity=".75" />
                    <rect x="53" y="46" width="4" height="40" rx="2" fill="rgba(255, 255, 255, .22)" />
                    <circle cx="43" cy="40" r="2.5" fill="rgba(254, 208, 95, .55)" />
                    <circle cx="78" cy="46" r="2" fill="rgba(254, 208, 95, .45)" />
                    <circle cx="45" cy="52" r="1.8" fill="rgba(254, 208, 95, .4)" />
                </g>
            )}

            {tipo === 'generico' && (
                <g>
                    <ellipse cx="60" cy="78" rx="34" ry="12" fill="#E8D5B5" opacity=".95" />
                    <ellipse cx="60" cy="76" rx="23" ry="7.5" fill="rgba(42, 15, 10, .35)" />
                    <path
                        d="M60 30 l4.5 11 11 4.5 -11 4.5 -4.5 11 -4.5 -11 -11 -4.5 11 -4.5 Z"
                        fill="#C0430B"
                    />
                </g>
            )}
        </svg>
    )
}