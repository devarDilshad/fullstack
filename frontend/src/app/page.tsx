"use client"
import CardComponent from "@/components/CardComponent";
import axios from "axios";
import { revalidatePath } from "next/cache";
import React, { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

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

  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [updateUser, setUpdateUser] = useState({ id: '', name: '', email: '' });
  const [paymentId, setPaymentId] = useState({ id: '' });
  const [invoiceId, setInvoiceId] = useState('');
  const [orders, setOrders] = useState([]);

  //fetch users
  // useEffect(() => {
  //   const getUsers = async () => {
  //     try {
  //       const response = await axios.get(`${url}/users`);
  //       setUsers(response.data.reverse());

  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getUsers();
  // }, [url]);

  //add user
  const addUser = async (event: any) => {
    event.preventDefault()
    // try-catch to create a new user
    try {
      const response = await axios.post(`${url}/users`, newUser);
      setUsers([response.data, ...users]);
      setNewUser({ name: '', email: '' });
    } catch (error) {
      console.log(error);
    }
  };

  //update user
  const updateUserHandler = async (event: any) => {
    event.preventDefault()
    //  try-catch update user
    try {
      await axios.put(`${url}/users/${updateUser.id}`, { name: updateUser.name, email: updateUser.email });
      setUpdateUser({ id: '', name: '', email: '' });
      setUsers(
        users.map((user) =>
          user.id === parseInt(updateUser.id)
            ? { ...user, name: updateUser.name, email: updateUser.email }
            : user
        )
      );
    } catch (error) {
      console.log("error updaating user" + error);
    }
  };

  //delete user
  const deleteUser = async (id: number) => {
    await axios.delete(`${url}/users/${id}`)
      .then((res) => {
        setUsers(users.filter((user) => user.id !== id));
        console.log(res);

      })
      .catch((err) => {
        console.log(err);
      });
  };

  //process invoice payment by posting id to /process-payment/:paymentId
  // const processPayment = async (e: any) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post(`${url}/process-payment/${paymentId.id}`);
  //     console.log(response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  //process invoice payment by posting id to /process-payment/:paymentId

  // get all orders for an invoice
  const getOrders = async (e: any) => {
    e.preventDefault();
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
      // revalidate this path
      const updateOrders = await axios.get(`${url}/orders/${invoiceId}`);
      setOrders(updateOrders.data)
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="space-y-4 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 text-center">User Management App</h1>

        {/* create a user form */}
        {/* <form onSubmit={addUser} className="p-4 bg-blue-100 rounded shadow">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
          <input type="text" id="name" name="name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="mb-2 w-full p-2 border border-gray-300 rounded" required />
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input type="text" id="email" name="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="mb-2 w-full p-2 border border-gray-300 rounded" required />
          <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600">Create</button>
        </form> */}

        {/* update a user form */}
        {/* <form onSubmit={updateUserHandler} className="p-4 bg-green-100 rounded shadow">
          <label htmlFor="id" className="text-sm font-medium text-gray-700">id</label>
          <input type="text" id="id" name="id" value={updateUser.id} onChange={(e) => setUpdateUser({ ...updateUser, id: e.target.value })} className="mb-2 w-full p-2 border border-gray-300 rounded" required />

          <label htmlFor="new name" className="text-sm font-medium text-gray-700">New Name</label>
          <input type="text" id="new name" name="new name" value={updateUser.name} onChange={(e) => setUpdateUser({ ...updateUser, name: e.target.value })} className="mb-2 w-full p-2 border border-gray-300 rounded" required />

          <label htmlFor="email" className="text-sm font-medium text-gray-700">New Email</label>
          <input type="text" id="email" name="email" value={updateUser.email} onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })} className="mb-2 w-full p-2 border border-gray-300 rounded" required />
          <button type="submit" className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600">Update</button>
        </form> */}

        {/* auto payment process */}
        {/* <form onSubmit={processPayment} className="p-4 bg-green-100 rounded shadow">
          <label htmlFor="paymentId" className="text-sm font-medium text-gray-700">id</label>
          <input type="text" id="paymentId" name="paymentId" value={paymentId.id} onChange={(e) => setPaymentId({ ...paymentId, id: e.target.value })} className="mb-2 w-full p-2 border border-gray-300 rounded" required />
          <button type="submit" className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600">process payment</button>
        </form> */}

        {/* Product Return Procces */}
        <form onSubmit={getOrders} className="p-4 bg-blue-100 rounded shadow">
          <label htmlFor="InvoiceID" className="text-sm font-medium text-gray-700">Invoice ID</label>
          <input type="text" id="InvoiceID" name="InvoiceID" placeholder="insert the invoice number" value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} className="mb-2 w-full p-2 border border-gray-300 rounded" required />
          <button type="submit" className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600"> Return the Invoice</button>
        </form>

        {/* generete a table like view for showing all orders for an invoice */}
        <table className="w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Item</th>
              <th className="border border-gray-300 p-2">Order ID</th>
              <th className="border border-gray-300 p-2">Invoice No.</th>
              <th className="border border-gray-300 p-2">Product ID</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Desc</th>
              <th className="border border-gray-300 p-2">Unit Price</th>
              <th className="border border-gray-300 p-2">quantity</th>
              <th className="border border-gray-300 p-2">Total Price</th>
              <th className="border border-gray-300 p-2">Order Status</th>
              <th className="border border-gray-300 p-2">{" "}</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order: any, index) => (
              <tr className="bg-blue-100" key={index}>
                <td className="border border-gray-300 p-2"> {index} </td>
                <td className="border border-gray-300 p-2">{order.order_id}</td>
                <td className="border border-gray-300 p-2">{order.invoice_id}</td>
                <td className="border border-gray-300 p-2">{order.product_id}</td>
                <td className="border border-gray-300 p-2">{order.order_date}</td>
                <td className="border border-gray-300 p-2">{order.order_desc}</td>
                <td className="border border-gray-300 p-2">{order.unit_price}</td>
                <td className="border border-gray-300 p-2">{order.quantity}</td>
                <td className="border border-gray-300 p-2">{(order.unit_price * order.quantity)}</td>
                <td className="border border-gray-300 p-2">{order.order_status}</td>
                <td className="border border-gray-300 p-2">
                  <button onClick={() => cancelOrder(order.order_id)} className="bg-red-500 text-white px-1">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Display users */}
        {/* <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
              <CardComponent card={user} />
              <button onClick={() => deleteUser(user.id)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                Delete User
              </button>
            </div>
          ))}

        </div> */}
      </div>
    </main>
  );
}
