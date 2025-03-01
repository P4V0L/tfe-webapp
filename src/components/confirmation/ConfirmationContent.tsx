"use client"

import { Button } from "@/components/ui/button"


export function ConfirmationContent() {
    const handleDownloadInvoice = () => {
        const link = document.createElement("a")
        link.href = "/factura.pdf"
        link.download = "factura.pdf"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-6">
            <div className="bg-primary rounded-lg overflow-hidden">
                <div className="flex flex-col items-center justify-center text-white py-16 px-4 text-center">
                    <h1 className="text-4xl font-bold mb-6">¡Gracias por tu compra!</h1>
                    <Button onClick={handleDownloadInvoice} className="bg-accent hover:bg-accent/90 text-white">
                        Descargar factura
                    </Button>
                </div>
            </div>
        </div>
    )
}

