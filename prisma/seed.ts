import { Prisma, PrismaClient, ProductType, SizeType } from '@prisma/client'
const prisma = new PrismaClient()

// Generates a unique suffix string for product names and slugs
function uniqueSuffix() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

// Helper to shuffle an array in-place (Fisher-Yates shuffle)
function shuffle<T>(array: T[]): T[] {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

async function main() {
    console.log("\nSeeding database\n")

    console.log("Truncating tables...\n")
    await clearDatabase()

    console.log("Creating base data...\n")
    const createdUsers = await createUsers()

    console.log("Creating categories...\n")
    await createCategories()
    const createdCategories = await prisma.category.findMany()

    console.log("Creating sizes...\n")
    await createSizes()
    const createdSizes = await prisma.size.findMany()

    console.log("Creating colors...\n")
    await createColors()

    console.log("Creating products...\n")
    await createAllProducts(createdSizes, createdCategories)

    console.log("Creating product reviews...\n")
    await createProductReviewsForEveryProduct()

    console.log("Creating testimonials...\n")
    await createTestimonials(createdUsers)

    console.log("\n✅ Seeding completed!\n")
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

async function createAllProducts(sizes: any[], categories: any[]) {
    // -----------------------------
    // 10 Mercería products
    // -----------------------------
    const haberdasheryProducts = [
        {
            name: 'Botones de madera',
            slug: 'botones-de-madera',
            description: 'Botones de madera natural, perfectos para proyectos de costura y manualidades.',
            basePrice: 3.5,
            type: ProductType.MERCERIA,
            categorySlug: 'merceria',
            allowedSizeTypes: [],
        },
        {
            name: 'Hilo de coser blanco',
            slug: 'hilo-de-coser-blanco',
            description: 'Hilo resistente de poliéster, ideal para costura a máquina o a mano.',
            basePrice: 1.99,
            type: ProductType.MERCERIA,
            categorySlug: 'merceria',
            allowedSizeTypes: [],
        },
        {
            name: 'Cremallera metálica',
            slug: 'cremallera-metalica',
            description: 'Cremallera en metal para proyectos de costura, duradera y confiable.',
            basePrice: 2.5,
            type: ProductType.MERCERIA,
            categorySlug: 'merceria',
            allowedSizeTypes: [],
        },
        {
            name: 'Encaje delicado',
            slug: 'encaje-delicado',
            description: 'Encaje decorativo de alta calidad para detalles finos en prendas.',
            basePrice: 4.0,
            type: ProductType.MERCERIA,
            categorySlug: 'merceria',
            allowedSizeTypes: [],
        },
        {
            name: 'Cinta elástica',
            slug: 'cinta-elastica',
            description: 'Cinta elástica resistente para ajustes precisos en confecciones.',
            basePrice: 2.2,
            type: ProductType.MERCERIA,
            categorySlug: 'merceria',
            allowedSizeTypes: [],
        },
        {
            name: 'Botones de nácar',
            slug: 'botones-de-nacar',
            description: 'Botones elegantes de nácar, ideales para prendas de vestir refinadas.',
            basePrice: 3.0,
            type: ProductType.MERCERIA,
            categorySlug: 'merceria',
            allowedSizeTypes: [],
        },
        {
            name: 'Hilo de bordar multicolor',
            slug: 'hilo-de-bordar-multicolor',
            description: 'Hilo vibrante y duradero, perfecto para bordados decorativos.',
            basePrice: 2.8,
            type: ProductType.MERCERIA,
            categorySlug: 'merceria',
            allowedSizeTypes: [],
        },
        {
            name: 'Cremallera invisible',
            slug: 'cremallera-invisible',
            description: 'Cremallera diseñada para un acabado discreto en prendas elegantes.',
            basePrice: 2.9,
            type: ProductType.MERCERIA,
            categorySlug: 'merceria',
            allowedSizeTypes: [],
        },
        {
            name: 'Agujas de coser',
            slug: 'agujas-de-coser',
            description: 'Agujas finas y afiladas para costuras precisas en tejidos delicados.',
            basePrice: 1.5,
            type: ProductType.MERCERIA,
            categorySlug: 'merceria',
            allowedSizeTypes: [],
        },
        {
            name: 'Tijeras de sastre',
            slug: 'tijeras-de-sastre',
            description: 'Tijeras profesionales de sastre para cortes precisos y limpios.',
            basePrice: 8.0,
            type: ProductType.MERCERIA,
            categorySlug: 'merceria',
            allowedSizeTypes: [],
        },
    ]

    // -----------------------------
    // 10 Ropa products
    // -----------------------------
    const clothingProducts = [
        {
            name: 'Blusa de algodón',
            slug: 'blusa-de-algodon',
            description: 'Blusa fresca y cómoda, ideal para climas cálidos.',
            basePrice: 17.99,
            type: ProductType.ROPA,
            categorySlug: 'ropa',
            allowedSizeTypes: [SizeType.TALLAS_ROPA],
        },
        {
            name: 'Blusa floreada',
            slug: 'blusa-floreada',
            description: 'Blusa con estampado floral vibrante para un look veraniego.',
            basePrice: 19.99,
            type: ProductType.ROPA,
            categorySlug: 'ropa',
            allowedSizeTypes: [SizeType.TALLAS_ROPA],
        },
        {
            name: 'Bata unisex',
            slug: 'bata-unisex',
            description: 'Bata ligera y versátil, perfecta para estar en casa o en el trabajo.',
            basePrice: 25.5,
            type: ProductType.ROPA,
            categorySlug: 'ropa',
            allowedSizeTypes: [SizeType.TALLAS_ROPA],
        },
        {
            name: 'Calcetines de algodón',
            slug: 'calcetines-de-algodon',
            description: 'Calcetines suaves y transpirables para uso diario.',
            basePrice: 4.99,
            type: ProductType.ROPA,
            categorySlug: 'ropa',
            allowedSizeTypes: [SizeType.TALLAS_ROPA],
        },
        {
            name: 'Blusa manga larga',
            slug: 'blusa-manga-larga',
            description: 'Blusa elegante y cómoda para días frescos.',
            basePrice: 18.9,
            type: ProductType.ROPA,
            categorySlug: 'ropa',
            allowedSizeTypes: [SizeType.TALLAS_ROPA],
        },
        {
            name: 'Bata sanitaria',
            slug: 'bata-sanitaria',
            description: 'Bata de algodón transpirable, ideal para entornos médicos.',
            basePrice: 22.0,
            type: ProductType.ROPA,
            categorySlug: 'ropa',
            allowedSizeTypes: [SizeType.TALLAS_ROPA],
        },
        {
            name: 'Calcetines térmicos',
            slug: 'calcetines-termicos',
            description: 'Calcetines cálidos, ideales para mantener los pies calientes en invierno.',
            basePrice: 6.5,
            type: ProductType.ROPA,
            categorySlug: 'ropa',
            allowedSizeTypes: [SizeType.TALLAS_ROPA],
        },
        {
            name: 'Blusa elegante',
            slug: 'blusa-elegante',
            description: 'Blusa con detalles refinados, perfecta para ocasiones especiales.',
            basePrice: 29.99,
            type: ProductType.ROPA,
            categorySlug: 'ropa',
            allowedSizeTypes: [SizeType.TALLAS_ROPA],
        },
        {
            name: 'Vestido veraniego',
            slug: 'vestido-veraniego',
            description: 'Vestido fresco y ligero, ideal para el verano.',
            basePrice: 34.99,
            type: ProductType.ROPA,
            categorySlug: 'ropa',
            allowedSizeTypes: [SizeType.TALLAS_ROPA],
        },
        {
            name: 'Camisa formal',
            slug: 'camisa-formal',
            description: 'Camisa de vestir elegante, perfecta para reuniones de negocio.',
            basePrice: 39.99,
            type: ProductType.ROPA,
            categorySlug: 'ropa',
            allowedSizeTypes: [SizeType.TALLAS_ROPA],
        },
    ]

    // -----------------------------
    // 5 Ropa Interior products
    // -----------------------------
    const underwearProducts = [
        {
            name: 'Calzoncillos de algodón',
            slug: 'calzoncillos-de-algodon',
            description: 'Calzoncillos cómodos y transpirables para el día a día.',
            basePrice: 9.99,
            type: ProductType.ROPA_INTERIOR,
            categorySlug: 'ropa-interior',
            allowedSizeTypes: [SizeType.TALLAS_ROPA_INTERIOR],
        },
        {
            name: 'Bragas de encaje',
            slug: 'bragas-de-encaje',
            description: 'Bragas elegantes con detalles de encaje.',
            basePrice: 12.5,
            type: ProductType.ROPA_INTERIOR,
            categorySlug: 'ropa-interior',
            allowedSizeTypes: [SizeType.TALLAS_ROPA_INTERIOR],
        },
        {
            name: 'Bóxer estampado',
            slug: 'boxer-estampado',
            description: 'Bóxer masculino con estampados modernos.',
            basePrice: 10.99,
            type: ProductType.ROPA_INTERIOR,
            categorySlug: 'ropa-interior',
            allowedSizeTypes: [SizeType.TALLAS_ROPA_INTERIOR],
        },
        {
            name: 'Camiseta interior',
            slug: 'camiseta-interior',
            description: 'Camiseta interior suave para usar debajo de cualquier prenda.',
            basePrice: 8.99,
            type: ProductType.ROPA_INTERIOR,
            categorySlug: 'ropa-interior',
            allowedSizeTypes: [SizeType.TALLAS_ROPA_INTERIOR],
        },
        {
            name: 'Sujetador sin aros',
            slug: 'sujetador-sin-aros',
            description: 'Sujetador cómodo y sin aros, ideal para uso diario.',
            basePrice: 14.99,
            type: ProductType.ROPA_INTERIOR,
            categorySlug: 'ropa-interior',
            allowedSizeTypes: [SizeType.TALLAS_ROPA_INTERIOR],
        },
    ]

    // -----------------------------
    // 5 Pijamas products
    // -----------------------------
    const homewearProducts = [
        {
            name: 'Pijama infantil con estampado',
            slug: 'pijama-infantil-estampado',
            description: 'Pijama suave y colorido para niños.',
            basePrice: 14.99,
            type: ProductType.PIJAMAS,
            categorySlug: 'pijamas',
            allowedSizeTypes: [SizeType.TALLAS_ROPA],
        },
        {
            name: 'Pijama de mujer con encaje',
            slug: 'pijama-mujer-encaje',
            description: 'Pijama elegante para mujer con detalles de encaje.',
            basePrice: 24.99,
            type: ProductType.PIJAMAS,
            categorySlug: 'pijamas',
            allowedSizeTypes: [SizeType.TALLAS_ROPA],
        },
        {
            name: 'Pijama de hombre de franela',
            slug: 'pijama-hombre-franela',
            description: 'Pijama cálido de franela para hombres en invierno.',
            basePrice: 27.99,
            type: ProductType.PIJAMAS,
            categorySlug: 'pijamas',
            allowedSizeTypes: [SizeType.TALLAS_ROPA],
        },
        {
            name: 'Bata polar unisex',
            slug: 'bata-polar-unisex',
            description: 'Bata de tejido polar, perfecta para noches frías.',
            basePrice: 19.99,
            type: ProductType.PIJAMAS,
            categorySlug: 'pijamas',
            allowedSizeTypes: [SizeType.TALLAS_ROPA],
        },
        {
            name: 'Pijama de mujer algodón',
            slug: 'pijama-mujer-algodon',
            description: 'Pijama ligero y cómodo, ideal para el verano.',
            basePrice: 21.99,
            type: ProductType.PIJAMAS,
            categorySlug: 'pijamas',
            allowedSizeTypes: [SizeType.TALLAS_ROPA],
        },
    ]

    // Combine all product arrays into one
    const allProducts = [
        ...haberdasheryProducts,
        ...clothingProducts,
        ...underwearProducts,
        ...homewearProducts,
    ]

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
    const uniqueName = `${productData.name} - ${suffix}`
    const uniqueSlug = `${productData.slug}-${suffix}`

    // Find the category by its slug
    const category = categories.find((c) => c.slug === productData.categorySlug)
    if (!category) {
        console.error(`❌ Category '${productData.categorySlug}' not found. Skipping "${productData.name}".`)
        return
    }

    // We will shuffle the set of colors so each product can have a unique order of colors:
    const availableColors = ['Rojo', 'Azul', 'Negro', 'Blanco']
    const shuffledColors = shuffle(availableColors)

    // Build the "variants" creation array depending on whether the product uses sizes or not
    let variantsData: Prisma.ProductVariantCreateWithoutProductInput[] = []

    // If product has clothing or underwear sizes:
    if (
        productData.allowedSizeTypes.includes(SizeType.TALLAS_ROPA) ||
        productData.allowedSizeTypes.includes(SizeType.TALLAS_ROPA_INTERIOR)
    ) {
        // Each size gets a different color from the shuffled list (cycling if more sizes than colors)
        variantsData = sizes.map((size, idx) => ({
            size: { connect: { value: size.value } },
            color: { connect: { name: shuffledColors[idx % shuffledColors.length] } },
            stock: 50,
            price: productData.basePrice,
            sku: `SKU-${size.value}-${uniqueSuffix()}`,
        }))
    } else {
        // No sizes, just one variant with a unique color
        variantsData = [
            {
                stock: 100,
                price: productData.basePrice,
                sku: `SKU-UNIQUE-${uniqueSuffix()}`,
                color: { connect: { name: shuffledColors[0] } }, // pick first color
            },
        ]
    }

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
                create: createImages(productData.name, 3),
            },
            variants: {
                create: variantsData,
            },
            categories: {
                create: [{ category: { connect: { id: category.id } } }],
            },
        },
    })
}

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
        // TALLAS_ROPA
        { value: 'S', type: 'TALLAS_ROPA' },
        { value: 'M', type: 'TALLAS_ROPA' },
        { value: 'L', type: 'TALLAS_ROPA' },
        { value: 'XL', type: 'TALLAS_ROPA' },
        // You could also add TALLAS_ROPA_INTERIOR here if you want:
        // { value: 'S', type: 'TALLAS_ROPA_INTERIOR' },
        // { value: 'M', type: 'TALLAS_ROPA_INTERIOR' },
        // ...
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

async function createTestimonials(users: any[]) {
    const testimonialData: Prisma.TestimonialCreateManyInput[] = [
        { userId: users[0].id, content: 'Es una tienda fantástica', rating: 5, approved: true },
        { userId: users[1].id, content: 'La calidad es increíble', rating: 4, approved: true },
        { userId: users[2].id, content: 'Encuentro todo lo que necesito', rating: 5, approved: true },
        { userId: users[3].id, content: 'Buenos precios y envíos rápidos', rating: 4, approved: true },
        { userId: users[4].id, content: 'Excelente atención al cliente', rating: 5, approved: true },
    ]
    await prisma.testimonial.createMany({ data: testimonialData, skipDuplicates: true })
}

function createImages(productName: string, count: number) {
    return Array(count)
        .fill(null)
        .map((_, i) => ({
            url: `https://picsum.photos/seed/${encodeURIComponent(productName)}-${i}/600/600`,
            altText: `${productName} image ${i + 1}`,
            order: i + 1,
        }))
}

async function createProductReviewsForEveryProduct() {
    const products = await prisma.product.findMany()
    const users = await prisma.user.findMany()

    // For each product, assign between 2 and 5 reviews from unique users
    for (const product of products) {
        const reviewCount = Math.min(Math.floor(Math.random() * 4) + 2, users.length)
        const shuffledUsers = [...users].sort(() => Math.random() - 0.5)
        const selectedUsers = shuffledUsers.slice(0, reviewCount)

        const reviews = selectedUsers.map((user) => ({
            productId: product.id,
            userId: user.id,
            rating: Math.floor(Math.random() * 4) + 2, // Rating between 2 and 5
            comment: randomReviewContent(),
            createdAt: new Date(),
        }))

        await prisma.productReview.createMany({
            data: reviews,
            skipDuplicates: true,
        })
    }
}

function randomReviewContent() {
    const possibleReviews = [
        "¡Gran producto, lo disfruté mucho!",
        "La calidad es decente por el precio.",
        "No está mal, podría mejorar en algunos aspectos.",
        "¡Superó mis expectativas!",
        "Lo recomendaría a mis amigos.",
        "Muy satisfecho con mi compra.",
        "Podría ser mejor, pero está bien en general.",
    ]
    return possibleReviews[Math.floor(Math.random() * possibleReviews.length)]
}

// Execute the seed script
main()
    .catch((e) => {
        console.error("❌ Seed error:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })