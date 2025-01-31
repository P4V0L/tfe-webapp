import { Prisma, PrismaClient, ProductType, SizeType } from '@prisma/client'
const prisma = new PrismaClient()

function uniqueSuffix() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

async function main() {
    console.log(`\nSeeding database\n`)

    console.log('Truncating tables in DEV/TEST environment...\n')
    await clearDatabase()

    console.log('Creating base data...\n')
    const createdUsers = await createUsers()

    console.log('Creating categories...\n')
    await createCategories()
    const createdCategories = await prisma.category.findMany()

    console.log('Creating sizes...\n')
    await createSizes()
    const createdSizes = await prisma.size.findMany()

    console.log('Creating colors...\n')
    await createColors()

    console.log('Creating products...\n')
    await createAllProducts(createdSizes, createdCategories)

    console.log('Creating testimonials and product reviews (dev/test only)...\n')
    await createTestimonialsAndReviews(createdUsers)

    console.log('\n✅ Seeding completed!\n')
}

async function clearDatabase() {
    await prisma.$transaction([
        prisma.$executeRawUnsafe(`TRUNCATE TABLE "ProductReview" CASCADE`),
        prisma.$executeRawUnsafe(`TRUNCATE TABLE "Testimonial" CASCADE`),
        prisma.$executeRawUnsafe(`TRUNCATE TABLE "OrderItem" CASCADE`),
        prisma.$executeRawUnsafe(`TRUNCATE TABLE "Order" CASCADE`),
        prisma.$executeRawUnsafe(`TRUNCATE TABLE "CartItem" CASCADE`),
        prisma.$executeRawUnsafe(`TRUNCATE TABLE "Cart" CASCADE`),
        prisma.$executeRawUnsafe(`TRUNCATE TABLE "ProductVariant" CASCADE`),
        prisma.$executeRawUnsafe(`TRUNCATE TABLE "ProductImage" CASCADE`),
        prisma.$executeRawUnsafe(`TRUNCATE TABLE "ProductCategory" CASCADE`),
        prisma.$executeRawUnsafe(`TRUNCATE TABLE "Product" CASCADE`),
        prisma.$executeRawUnsafe(`TRUNCATE TABLE "Category" CASCADE`),
        prisma.$executeRawUnsafe(`TRUNCATE TABLE "Size" CASCADE`),
        prisma.$executeRawUnsafe(`TRUNCATE TABLE "Color" CASCADE`),
        prisma.$executeRawUnsafe(`TRUNCATE TABLE "User" CASCADE`),
    ])
}

/**
 * Crear productos de acuerdo a los tipos deseados:
 * - Mercería (botones, hilos, cremalleras, etc.)
 * - Ropa (blusas, batas, calcetines, etc.)
 * - Ropa Interior (masculina y femenina)
 * - Pijamas (infantiles, mujer, hombre)
 */
async function createAllProducts(sizes: any[], categories: any[]) {
    // MERCERÍA (HABERDASHERY)
    const haberdasheryProducts = [
        {
            name: 'Botones de madera',
            slug: 'botones-de-madera',
            description: 'Botones de madera natural, perfectos para proyectos de costura y manualidades.',
            basePrice: 3.5,
            type: ProductType.HABERDASHERY,
            categorySlug: 'merceria',
            allowedSizeTypes: [],
        },
        {
            name: 'Hilo de coser blanco',
            slug: 'hilo-coser-blanco',
            description: 'Hilo resistente de poliéster, ideal para costura a máquina o a mano.',
            basePrice: 1.99,
            type: ProductType.HABERDASHERY,
            categorySlug: 'merceria',
            allowedSizeTypes: [],
        },
        {
            name: 'Cremallera metálica',
            slug: 'cremallera-metalica',
            description: 'Cremallera en color gris plata, de 20 cm de longitud.',
            basePrice: 2.2,
            type: ProductType.HABERDASHERY,
            categorySlug: 'merceria',
            allowedSizeTypes: [],
        },
        {
            name: 'Encaje delicado',
            slug: 'encaje-delicado',
            description: 'Encaje decorativo para detalles finos en prendas o manualidades.',
            basePrice: 3.75,
            type: ProductType.HABERDASHERY,
            categorySlug: 'merceria',
            allowedSizeTypes: [],
        },
        {
            name: 'Cinta elástica',
            slug: 'cinta-elastica',
            description: 'Cinta elástica de 1 cm de ancho para ropa deportiva o arreglos de confección.',
            basePrice: 2.5,
            type: ProductType.HABERDASHERY,
            categorySlug: 'merceria',
            allowedSizeTypes: [],
        },
        {
            name: 'Botones de nácar',
            slug: 'botones-nacar',
            description: 'Botones brillantes de nácar para camisas elegantes o blusas.',
            basePrice: 4.5,
            type: ProductType.HABERDASHERY,
            categorySlug: 'merceria',
            allowedSizeTypes: [],
        },
        {
            name: 'Hilo de bordar multicolor',
            slug: 'hilo-bordar-multicolor',
            description: 'Hilo suave en varios colores para bordados decorativos.',
            basePrice: 2.99,
            type: ProductType.HABERDASHERY,
            categorySlug: 'merceria',
            allowedSizeTypes: [],
        },
        {
            name: 'Cremallera invisible',
            slug: 'cremallera-invisible',
            description: 'Cremallera oculta para faldas o vestidos, 25 cm de longitud.',
            basePrice: 2.9,
            type: ProductType.HABERDASHERY,
            categorySlug: 'merceria',
            allowedSizeTypes: [],
        },
    ]

    // ROPA (CLOTHING)
    const clothingProducts = [
        {
            name: 'Blusa de algodón',
            slug: 'blusa-de-algodon',
            description: 'Blusa fresca y cómoda, ideal para primavera y verano.',
            basePrice: 17.99,
            type: ProductType.CLOTHING,
            categorySlug: 'ropa',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
        {
            name: 'Blusa floreada',
            slug: 'blusa-floreada',
            description: 'Blusa con estampado floral colorido para un look veraniego.',
            basePrice: 19.99,
            type: ProductType.CLOTHING,
            categorySlug: 'ropa',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
        {
            name: 'Bata unisex',
            slug: 'bata-unisex',
            description: 'Bata ligera para casa o trabajo, muy versátil.',
            basePrice: 25.5,
            type: ProductType.CLOTHING,
            categorySlug: 'ropa',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
        {
            name: 'Calcetines de algodón',
            slug: 'calcetines-de-algodon',
            description: 'Calcetines suaves y transpirables para uso diario.',
            basePrice: 4.99,
            type: ProductType.CLOTHING,
            categorySlug: 'ropa',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
        {
            name: 'Blusa manga larga',
            slug: 'blusa-manga-larga',
            description: 'Blusa cómoda de manga larga, ideal para días más frescos.',
            basePrice: 18.9,
            type: ProductType.CLOTHING,
            categorySlug: 'ropa',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
        {
            name: 'Bata sanitaria',
            slug: 'bata-sanitaria',
            description: 'Bata de uso médico o estético, de algodón transpirable.',
            basePrice: 22.0,
            type: ProductType.CLOTHING,
            categorySlug: 'ropa',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
        {
            name: 'Calcetines térmicos',
            slug: 'calcetines-termicos',
            description: 'Calcetines cálidos para invierno.',
            basePrice: 6.5,
            type: ProductType.CLOTHING,
            categorySlug: 'ropa',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
        {
            name: 'Blusa elegante',
            slug: 'blusa-elegante',
            description: 'Blusa con detalles bordados, perfecta para eventos formales.',
            basePrice: 29.99,
            type: ProductType.CLOTHING,
            categorySlug: 'ropa',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
    ]

    // ROPA INTERIOR (UNDERWEAR)
    const underwearProducts = [
        {
            name: 'Calzoncillos de algodón',
            slug: 'calzoncillos-de-algodon',
            description: 'Calzoncillos suaves y transpirables para uso diario.',
            basePrice: 9.99,
            type: ProductType.UNDERWEAR,
            categorySlug: 'ropa-interior',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
        {
            name: 'Bragas de encaje',
            slug: 'bragas-encaje',
            description: 'Bragas femeninas con un toque elegante de encaje.',
            basePrice: 12.5,
            type: ProductType.UNDERWEAR,
            categorySlug: 'ropa-interior',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
        {
            name: 'Bóxer estampado',
            slug: 'boxer-estampado',
            description: 'Bóxer masculino con diseño divertido.',
            basePrice: 10.99,
            type: ProductType.UNDERWEAR,
            categorySlug: 'ropa-interior',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
        {
            name: 'Camiseta interior',
            slug: 'camiseta-interior',
            description: 'Camiseta interior ligera para uso diario.',
            basePrice: 8.99,
            type: ProductType.UNDERWEAR,
            categorySlug: 'ropa-interior',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
        {
            name: 'Sujetador sin aros',
            slug: 'sujetador-sin-aros',
            description: 'Sujetador cómodo, ideal para uso diario o descanso.',
            basePrice: 14.99,
            type: ProductType.UNDERWEAR,
            categorySlug: 'ropa-interior',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
        {
            name: 'Calzoncillos tipo slip',
            slug: 'calzoncillos-slip',
            description: 'Slip ajustado, con buena transpiración.',
            basePrice: 7.99,
            type: ProductType.UNDERWEAR,
            categorySlug: 'ropa-interior',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
        {
            name: 'Bragas hipster',
            slug: 'bragas-hipster',
            description: 'Bragas de tiro medio para mayor comodidad.',
            basePrice: 11.5,
            type: ProductType.UNDERWEAR,
            categorySlug: 'ropa-interior',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
    ]

    // PIJAMAS (HOMEWEAR)
    const homewearProducts = [
        {
            name: 'Pijama infantil con estampado',
            slug: 'pijama-infantil-estampado',
            description: 'Pijama suave y colorido para los más pequeños de la casa.',
            basePrice: 14.99,
            type: ProductType.HOMEWEAR,
            categorySlug: 'pijamas',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
        {
            name: 'Pijama de mujer con encaje',
            slug: 'pijama-mujer-encaje',
            description: 'Pijama elegante para mujer con detalles de encaje.',
            basePrice: 24.99,
            type: ProductType.HOMEWEAR,
            categorySlug: 'pijamas',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
        {
            name: 'Pijama de hombre de franela',
            slug: 'pijama-hombre-franela',
            description: 'Pijama cálido y confortable para invierno.',
            basePrice: 27.99,
            type: ProductType.HOMEWEAR,
            categorySlug: 'pijamas',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
        {
            name: 'Bata polar unisex',
            slug: 'bata-polar-unisex',
            description: 'Bata de tejido polar muy abrigada para las noches frías.',
            basePrice: 19.99,
            type: ProductType.HOMEWEAR,
            categorySlug: 'pijamas',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
        {
            name: 'Pijama infantil animalitos',
            slug: 'pijama-infantil-animalitos',
            description: 'Pijama para niños con estampados divertidos de animales.',
            basePrice: 15.49,
            type: ProductType.HOMEWEAR,
            categorySlug: 'pijamas',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
        {
            name: 'Pijama de mujer algodón',
            slug: 'pijama-mujer-algodon',
            description: 'Pijama ligero y cómodo, perfecto para verano.',
            basePrice: 21.99,
            type: ProductType.HOMEWEAR,
            categorySlug: 'pijamas',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
        {
            name: 'Pijama de hombre rayas',
            slug: 'pijama-hombre-rayas',
            description: 'Pijama con diseño clásico a rayas, muy suave al tacto.',
            basePrice: 23.99,
            type: ProductType.HOMEWEAR,
            categorySlug: 'pijamas',
            allowedSizeTypes: [SizeType.CLOTHING_SIZES],
        },
    ]

    // Agrupamos todos los productos en un solo array
    const allProducts = [
        ...haberdasheryProducts,
        ...clothingProducts,
        ...underwearProducts,
        ...homewearProducts,
    ]

    // Creamos/actualizamos cada producto
    for (const productData of allProducts) {
        await createProduct(productData, sizes, categories)
    }
}

async function createProduct(
    productData: {
        name: string
        slug: string
        description: string
        basePrice: number
        type: ProductType
        categorySlug: string
        allowedSizeTypes: SizeType[]
    },
    sizes: any[],
    categories: any[]
) {
    const suffix = uniqueSuffix()

    // Generamos un nombre y slug únicos para evitar colisiones
    const uniqueName = `${productData.name} - ${suffix}`
    const uniqueSlug = `${productData.slug}-${suffix}`

    // Buscamos la categoría
    const category = categories.find((c) => c.slug === productData.categorySlug)
    if (!category) {
        console.error(`❌ Category '${productData.categorySlug}' not found. Skipping product "${productData.name}".`)
        return
    }

    // Creamos (o actualizamos) el producto
    await prisma.product.upsert({
        where: { name: uniqueName },
        update: { updatedAt: new Date() },
        create: {
            name: uniqueName,
            description: productData.description,
            basePrice: productData.basePrice,
            type: productData.type,
            slug: uniqueSlug,
            allowedSizeTypes: productData.allowedSizeTypes,
            images: {
                create: createImages(3),
            },
            // Creamos variantes según si usa tallas o no
            variants: {
                create:
                    productData.allowedSizeTypes.includes(SizeType.CLOTHING_SIZES)
                        ? // Si el producto requiere tallas (ropa, ropa interior, pijamas, etc.)
                        sizes.map((size) => ({
                            size: { connect: { value: size.value } },
                            color: { connect: { name: randomColor() } },
                            stock: 50,
                            price: productData.basePrice,
                            sku: `SKU-${size.value}-${uniqueSuffix()}`,
                        }))
                        : // Si es de mercería (sin tallas)
                        [
                            {
                                stock: 100,
                                price: productData.basePrice,
                                sku: `SKU-UNIQUE-${uniqueSuffix()}`,
                                color: { connect: { name: randomColor() } },
                            },
                        ],
            },
            categories: {
                create: [{ category: { connect: { id: category.id } } }],
            },
        },
    })
}

// ==================================================================
// Resto de funciones auxiliares
// ==================================================================

async function createUsers() {
    const userData: Prisma.UserCreateManyInput[] = [
        { name: 'Ana López', email: 'ana@example.com', password: 'Test1234', emailVerified: new Date() },
        { name: 'Carlos Ruiz', email: 'carlos@example.com', password: 'Test1234', emailVerified: new Date() },
        { name: 'Elena García', email: 'elena@example.com', password: 'Test1234', emailVerified: new Date() },
        { name: 'Juan Pérez', email: 'juan@example.com', password: 'Test1234', emailVerified: new Date() },
        { name: 'Pedro Sánchez', email: 'pedro@example.com', password: 'Test1234', emailVerified: new Date() },
        { name: 'Pablo Montón', email: 'pablo@example.com', password: 'Test1234', emailVerified: new Date() },
        { name: 'Luis Pérez', email: 'luis@example.com', password: 'Test1234', emailVerified: new Date() },
        { name: 'María López', email: 'maria@example.com', password: 'Test1234', emailVerified: new Date() },
        { name: 'Laura García', email: 'laura@example.com', password: 'Test1234', emailVerified: new Date() },
    ]

    await prisma.user.createMany({ data: userData, skipDuplicates: true })
    return prisma.user.findMany()
}

async function createCategories() {
    const categoriesData: Prisma.CategoryCreateManyInput[] = [
        { name: 'Ropa', slug: 'ropa', description: 'Ropa de todo tipo' },
        { name: 'Mercería', slug: 'merceria', description: 'Artículos de mercería' },
        { name: 'Ropa Interior', slug: 'ropa-interior', description: 'Ropa interior masculina y femenina' },
        { name: 'Pijamas', slug: 'pijamas', description: 'Pijamas y ropa de dormir' },
    ]

    await prisma.category.createMany({ data: categoriesData, skipDuplicates: true })
    return prisma.category.findMany()
}

async function createSizes() {
    const sizesData: Prisma.SizeCreateManyInput[] = [
        { value: 'S', type: 'CLOTHING_SIZES' },
        { value: 'M', type: 'CLOTHING_SIZES' },
        { value: 'L', type: 'CLOTHING_SIZES' },
        { value: 'XL', type: 'CLOTHING_SIZES' },
    ]

    await prisma.size.createMany({ data: sizesData, skipDuplicates: true })
    return prisma.size.findMany()
}

async function createColors() {
    const colorsData: Prisma.ColorCreateManyInput[] = [
        { name: 'Rojo', hexCode: '#FF0000' },
        { name: 'Azul', hexCode: '#0000FF' },
        { name: 'Negro', hexCode: '#000000' },
        { name: 'Blanco', hexCode: '#FFFFFF' },
    ]

    await prisma.color.createMany({ data: colorsData, skipDuplicates: true })
    return prisma.color.findMany()
}

async function createTestimonialsAndReviews(users: any[]) {
    const testimonialData: Prisma.TestimonialCreateManyInput[] = [
        { userId: users[0].id, content: 'Es una tienda fantástica', rating: 5, approved: true },
        { userId: users[1].id, content: 'La calidad es increíble', rating: 4, approved: true },
        { userId: users[2].id, content: 'Encuentro todo lo que necesito', rating: 5, approved: true },
        { userId: users[3].id, content: 'Buenos precios y envíos rápidos', rating: 4, approved: true },
        { userId: users[4].id, content: 'Excelente atención al cliente', rating: 5, approved: true },
    ]

    await prisma.testimonial.createMany({ data: testimonialData, skipDuplicates: true })
}

function createImages(count: number) {
    return Array(count)
        .fill(null)
        .map((_, i) => ({
            url: `https://picsum.photos/seed/${Date.now()}-${i}/600/600`,
            altText: `Imagen ${i + 1}`,
            order: i + 1,
        }))
}

function randomColor() {
    const colors = ['Rojo', 'Azul', 'Negro', 'Blanco']
    return colors[Math.floor(Math.random() * colors.length)]
}

// Ejecuta main() y gestiona errores
main()
    .catch((e) => {
        console.error('❌ Seed error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })