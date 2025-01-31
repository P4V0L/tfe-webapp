import {Card, CardContent} from "@/components/ui/card";

interface ProductoDestacadoProps {
    product: {
        id: number
        name: string
        image: string
        basePrice: number
        color: string
    }
}

const ProductoDestacado = ({product}: ProductoDestacadoProps) => {
    return (
        <Card key={product.id} className="overflow-hidden">
            <CardContent className="p-0">
                <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                />
                <div className="p-4">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-lg font-semibold text-primary">{product.basePrice}€</p>
                    <div className="flex items-center mt-2">
                        <div className="w-4 h-4 rounded-full bg-primary" />
                        <span className="ml-2 text-sm">{product.color}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default ProductoDestacado;