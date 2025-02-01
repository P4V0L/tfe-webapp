import { redirect } from "next/navigation"
import Image from "next/image"
import {auth} from "@/auth";
import {getCompleteUser} from "@/actions/user";

export default async function ProfilePage() {
    const session = await auth()

    if (!session) {
        redirect("/api/auth/signin")
    }

    const userId = session?.user?.id || ""

    const user = await getCompleteUser(userId)

    console.log(user)

    if (!user) {
        return <div>User not found</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Perfil</h1>
            <div className="flex items-center mb-8">
                {user.image && (
                    <Image
                        src={user.image || "/placeholder.svg"}
                        alt={user.name || "Profile picture"}
                        width={100}
                        height={100}
                        className="rounded-full mr-4"
                    />
                )}
                <div>
                    <h2 className="text-2xl font-semibold">{user.name}</h2>
                    <p className="text-gray-600">{user.email}</p>
                </div>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Historial de pedidos</h3>
            {user.orders.length === 0 ? (
                <p>No hay pedidos todavía.</p>
            ) : (
                <ul className="space-y-4">
                    {user.orders.map((order) => (
                        <li key={order.id} className="border p-4 rounded-lg">
                            <p className="font-semibold">Pedido: {order.id}</p>
                            <p>Status: {order.status}</p>
                            <p>Total Amount: €{order.totalAmount.toFixed(2)}</p>
                            <ul className="mt-2">
                                {order.items.map((item) => (
                                    <li key={item.id}>
                                        {item.productVariant.product.name} - Cantidad: {item.quantity}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

