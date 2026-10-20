export const detallesPorProducto = {
    'Arepa de queso asada': {
        descripcion: 'Arepa gruesa asada en plancha: crujiente por fuera y con el queso derretido por dentro.',
        ingredientes: ['Harina de maíz', 'Queso campesino', 'Mantequilla', 'Sal'],
    },
    'Arepa plana': {
        descripcion: 'La clásica de siempre: delgada, dorada en la plancha y perfecta para acompañar.',
        ingredientes: ['Harina de maíz', 'Aceite de girasol', 'Sal'],
    },
    'Arepa de huevo': {
        descripcion: 'Abierta a la mitad y rellena con huevo frito y queso fundido. Desayuno de campeones.',
        ingredientes: ['Harina de maíz', 'Huevo', 'Queso campesino', 'Sal'],
    },
    'Chocolate caliente': {
        descripcion: 'Bebida espesa y reconfortante, con chocolate tradicional disuelto a fuego lento.',
        ingredientes: ['Chocolate en polvo', 'Azúcar', 'Agua'],
    },
    'Gaseosa 400 ml': {
        descripcion: 'Bien fría, directa de la nevera. El acompañante clásico de una arepa caliente.',
        ingredientes: [],
    },
}

const DETALLE_GENERICO = {
    descripcion: 'Preparado en casa con ingredientes frescos, al momento de tu pedido.',
    ingredientes: [],
}

export function detalleDe(producto) {
    return detallesPorProducto[producto.nombre] ?? DETALLE_GENERICO
}