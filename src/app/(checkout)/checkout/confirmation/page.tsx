import type { Metadata } from "next"
import {ConfirmationContent} from "@/components/confirmation/ConfirmationContent";
import {OrderSummary} from "@/components/confirmation/OrderSummary";

export const metadata: Metadata = {
    title: "Pedido Confirmado - Conchi Gimeno",
    description: "Gracias por tu compra en Conchi Gimeno",
}

export default function ConfirmationPage() {
    return (
        <div className="min-h-screen bg-secondary">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-5">
                    <div className="lg:col-span-3">
                        <ConfirmationContent />
                    </div>
                    <div className="lg:col-span-2">
                        <OrderSummary />
                    </div>
                </div>
            </div>
        </div>
    )
}

