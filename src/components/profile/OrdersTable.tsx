"use client"

import {Fragment, useState} from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { format } from "date-fns"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { OrderStatus } from "@prisma/client"
import type { ExtendedOrder } from "@/models/order"

export default function OrderTable({ orders }: { orders: ExtendedOrder[] }) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

    const toggleRow = (orderId: string) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(orderId)) {
                newSet.delete(orderId)
            } else {
                newSet.add(orderId)
            }
            return newSet
        })
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount)
    }

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case "PENDIENTE":
                return "bg-yellow-500"
            case "PROCESANDO":
                return "bg-blue-500"
            case "ENVIADO":
                return "bg-purple-500"
            case "ENTREGADO":
                return "bg-green-500"
            case "CANCELADO":
                return "bg-red-500"
            default:
                return "bg-gray-500"
        }
    }

    // Sort orders by createdAt descending (newest first)
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return (
        <Table className="bg-primary rounded-sm">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead className="text-muted">ID del Pedido</TableHead>
                    <TableHead className="text-muted">Estado</TableHead>
                    <TableHead className="text-muted">Items</TableHead>
                    <TableHead className="text-muted">Total</TableHead>
                    <TableHead className="text-muted">Fecha de Creación</TableHead>
                    <TableHead className="text-muted">Última Actualización</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedOrders.map((order) => (
                    <Fragment key={order.id}>
                        <TableRow
                            className="cursor-pointer bg-secondary-foreground text-muted"
                            onClick={() => toggleRow(order.id)}
                        >
                            <TableCell>
                                <Button variant="ghost" size="sm">
                                    {expandedRows.has(order.id) ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </Button>
                            </TableCell>
                            <TableCell>{order.id.substring(0, 8)}...</TableCell>
                            <TableCell>
                                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                            </TableCell>
                            <TableCell>{order.items.length}</TableCell>
                            <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                            <TableCell>{format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}</TableCell>
                            <TableCell>{format(new Date(order.updatedAt), "dd/MM/yyyy HH:mm")}</TableCell>
                        </TableRow>
                        {expandedRows.has(order.id) && (
                            <TableRow className="bg-muted">
                                <TableCell colSpan={7} className="p-0">
                                    <div className="bg-muted/10 p-4 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <h3 className="font-medium text-lg">Resumen del Pedido</h3>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="text-muted-foreground">Subtotal:</div>
                                                    <div>{formatCurrency(order.subtotal)}</div>
                                                    <div className="text-muted-foreground">Impuestos:</div>
                                                    <div>{formatCurrency(order.tax)}</div>
                                                    <div className="text-muted-foreground">Envío:</div>
                                                    <div>{formatCurrency(order.shippingCost)}</div>
                                                    {order.discount > 0 && (
                                                        <>
                                                            <div className="text-muted-foreground">Descuento:</div>
                                                            <div className="text-green-600">-{formatCurrency(order.discount)}</div>
                                                        </>
                                                    )}
                                                    <div className="text-muted-foreground font-medium">Total:</div>
                                                    <div className="font-medium">{formatCurrency(order.totalAmount)}</div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="font-medium text-lg">Información Adicional</h3>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="text-muted-foreground">ID:</div>
                                                    <div className="break-all">{order.id}</div>
                                                    <div className="text-muted-foreground">Fecha de Creación:</div>
                                                    <div>{format(new Date(order.createdAt), "dd/MM/yyyy HH:mm:ss")}</div>
                                                    <div className="text-muted-foreground">Última Actualización:</div>
                                                    <div>{format(new Date(order.updatedAt), "dd/MM/yyyy HH:mm:ss")}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-medium text-lg">Productos</h3>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Nombre</TableHead>
                                                        <TableHead>Color</TableHead>
                                                        <TableHead>Talla</TableHead>
                                                        <TableHead>Cantidad</TableHead>
                                                        <TableHead>Precio</TableHead>
                                                        <TableHead>Subtotal</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {order.items.map((item) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell className="flex items-center space-x-2">
                                                                <img
                                                                    src={item.image || "/placeholder.svg"}
                                                                    alt={item.name}
                                                                    className="w-10 h-10 object-cover rounded"
                                                                />
                                                                <span>{item.name.split("-")[0]}</span>
                                                            </TableCell>
                                                            <TableCell>{item.color.name}</TableCell>
                                                            <TableCell>{item.size?.value || "N/A"}</TableCell>
                                                            <TableCell>{item.quantity}</TableCell>
                                                            <TableCell>{formatCurrency(item.price)}</TableCell>
                                                            <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </Fragment>
                ))}
            </TableBody>
        </Table>
    )
}