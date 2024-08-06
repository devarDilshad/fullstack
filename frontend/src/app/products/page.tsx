"use client"

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


    const [formData, setFormData] = useState({
        name: '',
        price: 0,
    });

    // form input
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // create new product
    const createProduct = async () => {
        try {
            const response = await axios.post(`${url}/products`, formData);
            console.log(response.data);
        } catch (error) {
            console.error("error");
        }
    }

    // create new product, preventDEfault and reset forData
    const handleCreateProduct = async (e: any) => {
        e.preventDefault();
        try {
            await createProduct();
            setFormData({
                name: '',
                price: 0,
            });
        } catch (error) {
            console.error("error");
        }
    }

    return (
        <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Insert a New Product</h2>
            <form className="flex flex-col gap-6" onSubmit={handleCreateProduct}>


                {/* Name */}
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>


                {/* Price */}
                <div className="mb-4">
                    <label className="block text-gray-700">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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