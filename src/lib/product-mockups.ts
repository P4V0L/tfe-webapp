export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  colors: string[];
  category: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Vestido Azul',
    price: 45.00,
    image: '/placeholder.svg',
    colors: ['#1E40AF', '#000000', '#FFFFFF'],
    category: 'Mujer'
  },
  {
    id: '2',
    name: 'Camisa Negra',
    price: 30.00,
    image: '/placeholder.svg',
    colors: ['#000000', '#808080', '#1E40AF'],
    category: 'Hombre'
  },
  {
    id: '3',
    name: 'Pantalón Beige',
    price: 35.00,
    image: '/placeholder.svg',
    colors: ['#D2B48C', '#8B4513', '#000000'],
    category: 'Mujer'
  },
  {
    id: '4',
    name: 'Chaqueta Roja',
    price: 60.00,
    image: '/placeholder.svg',
    colors: ['#FF0000', '#000000', '#808080'],
    category: 'Hombre'
  },
  {
    id: '5',
    name: 'Bufanda Verde',
    price: 15.00,
    image: '/placeholder.svg',
    colors: ['#008000', '#000000', '#808080'],
    category: 'Accesorios'
  },
  {
    id: '6',
    name: 'Sombrero Blanco',
    price: 20.00,
    image: '/placeholder.svg',
    colors: ['#FFFFFF', '#000000'],
    category: 'Accesorios'
  },
  {
    id: '7',
    name: 'Bolso Marrón',
    price: 50.00,
    image: '/placeholder.svg',
    colors: ['#8B4513', '#FFA500', '#000000'],
    category: 'Accesorios'
  },
  {
    id: '8',
    name: 'Zapatos Negros',
    price: 75.00,
    image: '/placeholder.svg',
    colors: ['#000000', '#808080', '#4169E1'],
    category: 'Zapatos'
  },
  {
    id: '9',
    name: 'Gafas de Sol',
    price: 25.00,
    image: '/placeholder.svg',
    colors: ['#000000', '#8B4513', '#4169E1'],
    category: 'Accesorios'
  },
  {
    id: '10',
    name: 'Reloj Plateado',
    price: 150.00,
    image: '/placeholder.svg',
    colors: ['#C0C0C0', '#000000', '#4169E1'],
    category: 'Accesorios'
  },
  {
    id: '11',
    name: 'Cinturón Negro',
    price: 20.00,
    image: '/placeholder.svg',
    colors: ['#000000', '#8B4513', '#FFA500'],
    category: 'Accesorios'
  },
  {
    id: '12',
    name: 'Guantes Grises',
    price: 15.00,
    image: '/placeholder.svg',
    colors: ['#808080', '#000000', '#4169E1'],
    category: 'Accesorios'
  }
];

