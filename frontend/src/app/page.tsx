"use client"
import CardComponent from "@/components/CardComponent";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  // define api url process env next publix || port 4000 local
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [updateUser, setUpdateUser] = useState({ id: '', name: '', email: '' });

  //fetch users
  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(`${url}/users`);
        setUsers(response.data.reverse());
        console.log(response.data);

      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, [url]);

  //add user
  const addUser = async (event: any) => {
    event.preventDefault()
    // try-catch to create a new user
    try {
      const response = await axios.post(`${url}/users`, newUser);
      setUsers([...users, response.data]);
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
        users.map((user) => {
          if (user.id === parseInt(updateUser.id)) {
            return { ...user, name: updateUser.name, email: updateUser.email }
          }
          return user;
        })
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


  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="space-y-4 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 text-center">User Management App</h1>

        {/* create a user form */}
        <form onSubmit={addUser} className="p-4 bg-blue-100 rounded shadow">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
          <input type="text" id="name" name="name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="mb-2 w-full p-2 border border-gray-300 rounded" required />
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input type="text" id="email" name="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="mb-2 w-full p-2 border border-gray-300 rounded" required />
          <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600">Create</button>
        </form>

        {/* update a user form */}
        <form onSubmit={updateUserHandler} className="p-4 bg-green-100 rounded shadow">
          <label htmlFor="id" className="text-sm font-medium text-gray-700">id</label>
          <input type="text" id="id" name="id" value={updateUser.id} onChange={(e) => setUpdateUser({ ...updateUser, id: e.target.value })} className="mb-2 w-full p-2 border border-gray-300 rounded" required />

          <label htmlFor="new name" className="text-sm font-medium text-gray-700">New Name</label>
          <input type="text" id="new name" name="new name" value={updateUser.name} onChange={(e) => setUpdateUser({ ...updateUser, name: e.target.value })} className="mb-2 w-full p-2 border border-gray-300 rounded" required />

          <label htmlFor="email" className="text-sm font-medium text-gray-700">New Email</label>
          <input type="text" id="email" name="email" value={updateUser.email} onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })} className="mb-2 w-full p-2 border border-gray-300 rounded" required />
          <button type="submit" className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600">Update</button>
        </form>

        {/* Display users */}
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
              <CardComponent card={user} />
              <button onClick={() => deleteUser(user.id)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                Delete User
              </button>
            </div>
          ))}

        </div>
      </div>
    </main>
  );
}
