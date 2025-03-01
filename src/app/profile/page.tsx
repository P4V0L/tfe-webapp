import { redirect } from "next/navigation"
import Image from "next/image"
import {auth} from "@/auth";
import {getCompleteUser} from "@/actions/user";
import OrdersTable from "@/components/profile/OrdersTable";

export default async function ProfilePage() {
    const session = await auth()

    if (!session) {
        redirect("/api/auth/signin")
    }

    const userId = session?.user?.id || ""

    const user = await getCompleteUser(userId)

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
                <OrdersTable orders={user.orders} />
            )}
        </div>
    )
}

