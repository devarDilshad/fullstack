"use client"
import CreateOrder from "@/components/CreateOrder";
import axios from "axios";
import React, { useState } from "react";

interface User {
    id: number;
    name: string;
    email: string;
}

// interface product {
//     product_id: number;
//     name: string;
//     price: number;
// }

//  interface for order
interface Order {
    id: number;
    userId: number;
    orderDate: string;
    total: number;
}

export default function Home() {
    // define api url process env next publix || port 4000 local
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    const [invoiceId, setInvoiceId] = useState();
    const [orders, setOrders] = useState([]);
    // product state with type product object
    const [product, setProduct] = useState({ product_id: '', name: '', price: '' });

    // get all orders for an invoice
    const getOrders = async (invoiceId: Number) => {
        // e.preventDefault();
        try {
            const response = await axios.get(`${url}/orders/${invoiceId}`);
            setOrders(response.data)
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    // Cancel an order 
    const cancelOrder = async (id: string) => {
        try {
            const response = await axios.post(`${url}/cancel-order/${id}`);
            // refresh orders
            const updateOrders = await axios.get(`${url}/orders/${invoiceId}`);
            setOrders(updateOrders.data)
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    // delete order
    const deleteOrder = async (id: string) => {
        try {
            const response = await axios.delete(`${url}/orders/${id}`);
            const updateOrders = await axios.get(`${url}/orders/${invoiceId}`);
            setOrders(updateOrders.data)
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <div className="space-y-4 w-full">
                <h1 className="text-2xl font-bold text-gray-800 text-center">#Invoice</h1>

                {/* Create new order for this invoice */}
                <CreateOrder refreshInvoice={getOrders} setProduct={setProduct} />

                {/* generete a table like view for showing all orders for an invoice */}
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">Item</th>
                            <th className="border border-gray-300 p-2">Product Name</th>
                            <th className="border border-gray-300 p-2">Desc</th>
                            <th className="border border-gray-300 p-2">Unit Price</th>
                            <th className="border border-gray-300 p-2">quantity</th>
                            <th className="border border-gray-300 p-2">Total Price</th>

                        </tr>
                    </thead>
                    <tbody>
                        {orders?.map((order: any, index) => (
                            <tr className="bg-blue-100" key={index}>
                                <td className="border border-gray-300 p-2"> {index + 1} </td>
                                <td className="border border-gray-300 p-2">{product.name}</td>
                                <td className="border border-gray-300 p-2">{order.order_desc}</td>
                                <td className="border border-gray-300 p-2">{order.unit_price}</td>
                                <td className="border border-gray-300 p-2">{order.quantity}</td>
                                <td className="border border-gray-300 p-2">{(order.unit_price * order.quantity)}</td>
                                <td className="border border-gray-300 p-2">
                                    <button onClick={() => cancelOrder(order.order_id)} className="text-white bg-red-500 px-1 rounded py-0.5">
                                        &#128465;
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
