"use client"

import LiveSearch from "@/components/LiveSearch";
import LiveWithKeys from "@/components/LiveWithKeys";
import axios from "axios";
import React, { useEffect, useState } from "react";

export interface Product {
    id: number;
    name: string;
    product_id: number;
}

export default function Home() {
    // define api url process env next publix || port 4000 local
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    const [products, setProducts] = useState<Product[]>([]);
    const [productId, setProducId] = useState(0);
    const [formData, setFormData] = useState({
        invoice_id: undefined,
        product_id: productId,
        order_desc: '',
        quantity: undefined,
        unit_price: undefined,
    });


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${url}/products`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, [url]);

    // form input
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
            product_id: productId,
        });
    };

    // creating a new order request
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/orders`, formData);
            // reset forData state
            setFormData({
                invoice_id: undefined,
                product_id: productId,
                order_desc: '',
                quantity: undefined,
                unit_price: undefined,
            });
            // update the newly added order to yhe UI of the invoice in the future 
            // or just refetch the invoice(easier not better, making unneccesary network calls. data existed when res is success!)
            console.log('Order created successfully:', response.data);
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    console.log(`on mounte id ${productId}`);

    return (
        <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Create an order for an invoice</h2>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>

                {/* Live Search Component */}
                {/* <LiveSearch items={products} setProducId={setProducId} /> */}

                {/* Live Search Component with keyboard interactivity */}
                <LiveWithKeys items={products} setProductId={setProducId} />

                {/* Invoice*/}
                <div className="mb-4">
                    <label className="block text-gray-700 my-2">Invoice ID</label>
                    <input
                        required
                        type="number"
                        name="invoice_id"
                        value={formData.invoice_id}
                        onChange={handleChange}
                        className="mt-1 ps-2 block w-full rounded-sm border-gray-300 shadow-sm focus:ring-2 focus:outline-0 focus:ring-slate-400 focus:ring-opacity-50"
                    />
                </div>
                {/* Qty */}
                <div className="mb-4">
                    <label className="block text-gray-700 my-2">Quantity</label>
                    <input
                        required
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="mt-1 ps-2 block w-full rounded-sm border-gray-300 shadow-sm focus:ring-2 focus:outline-0 focus:ring-slate-400 focus:ring-opacity-50"
                    />
                </div>
                {/* Price */}
                <div className="mb-4">
                    <label className="block text-gray-700">Unit Price</label>
                    <input
                        required
                        type="number"
                        name="unit_price"
                        value={formData.unit_price}
                        onChange={handleChange}
                        className="mt-1 ps-2 block w-full rounded-sm border-gray-300 shadow-sm focus:ring-2 focus:outline-0 focus:ring-slate-400 focus:ring-opacity-50"
                    />
                </div>
                {/* Order Description */}
                <div className="mb-4">
                    <label className="block text-gray-700">Order Description</label>
                    <input
                        type="text"
                        name="order_desc"
                        value={formData.order_desc}
                        onChange={handleChange}
                        className="mt-1 ps-2 block w-full rounded-sm border-gray-300 shadow-sm focus:ring-2 focus:outline-0 focus:ring-slate-400 focus:ring-opacity-50"
                    />
                </div>
                {/* Submit */}
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Create Order
                </button>
            </form>
        </div>
    );
};