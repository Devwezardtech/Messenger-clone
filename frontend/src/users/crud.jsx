import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const Crud = () => {
   const [name, Setname] = useState("");
   const [password, Setpassword] = useState("");
   const [users, setUsers] = useState([]);
   const [selectedUserId, setSelectedUserId] = useState(null);
   const [updateData, setUpdateData] = useState({
      name: "",
      password: ""
   });

    useEffect(() => {
         const fetchUsers = async () => {
            try {
               const response = await axios.get("http://localhost:5000/api/user");
               setUsers(response.data);
               
            } catch (error) {
               console.error("Error fetching users:", error);
            }
         };
   
         fetchUsers();
      }, []);
   
      const forDelete = async (id) => {
            try {
               await axios.delete(`http://localhost:5000/api/user/${id}`);
               setUsers(users.filter(user => user._id !== selectedUserId));
               console.log("User deleted successfully");
               // Optionally, refresh the user list   
               const updatedUsers = await axios.get("http://localhost:5000/api/user");
               setUsers(updatedUsers.data);
            }
            catch (error) {
               console.error("Error deleting user:", error);   
         }
      }
   
      const updateUser = async () => {
         try {
            const response = await axios.put(
               `http://localhost:5000/api/user/${selectedUserId}`,
               updateData
            );
   
            setSelectedUserId(null);
      setUpdateData({ name: "", password: "" });
            console.log("User updated:", response.data);
   
            
            
           
           
   
            // Refresh user list
            const updatedUsers = await axios.get("http://localhost:5000/api/user");
            setUsers(updatedUsers.data);
   
         } catch (error) {
            console.error("Error updating user:", error);
         }
      }

const handleSubmit = async (e) => {
   e.preventDefault();

   try{
      const response = await axios.post("http://localhost:5000/api/user", { name, password })
      console.log("Data submitted", response.data)
      Setname("")
      Setpassword("")

       const updatedUsers = await axios.get("http://localhost:5000/api/user");
            setUsers(updatedUsers.data);
   
   }
   catch(err){
      console.error("no data:", err.message)
   }
}
      
   return (
      <div>
         <h1>Crud Operation</h1>
         <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 justify-center items-center">
               <input className="text-black p-1 rounded" type="text" placeholder="Enter your name" value={name} onChange={(e) => Setname(e.target.value)} required />

               <input className="text-black p-1 rounded" type="password" placeholder="Enter your password" value={ password } onChange={(e) => Setpassword(e.target.value)} required />

               <button className="bg-green-400 w-20 rounded" type="submit">Submit</button> 
            </div>
         </form>

          <div className="pt-10">
         <h1>Read Operation</h1>
         <table>
            <thead>
               <tr className="bg-gray-200 text-black">
                  <th>Name</th>
                  <th>Password</th>
                  <th>Action</th>
               </tr>
            </thead>
            <tbody>
               {users.map((user) => (
                  <tr key={user._id}>
                     <td>{user.name}</td>
                     <td>{user.password}</td>
                     <td>
                        <button
                           className="bg-yellow-500 text-white px-4 py-2 rounded"
                           onClick={() => {
                              setSelectedUserId(user._id);
                              setUpdateData({
                                 name: user.name,
                                 password: user.password
                              });
                           }}
                        >
                           Edit
                        </button>
                        <button className="bg-yellow-500 p-2 rounded mx-2" onClick={() => forDelete(user._id)} >delete</button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>

         {/* Only show update form if a user is selected */}
         {selectedUserId && (
            <div className="mt-6 text-back">
               <h2>Update User</h2>
               <input
                  type="text"
                  value={updateData.name}
                  onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                  placeholder="Name"
                  className="border p-2 m-2 text-black"
               />
               <input
                  type="text"
                  value={updateData.password}
                  onChange={(e) => setUpdateData({ ...updateData, password: e.target.value })}
                  placeholder="Password"
                  className="border p-2 m-2 text-black"
               />
               <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={async () => {
   await updateUser();
}}

               >
                  Save
               </button>
            </div>
         )}
      </div>
      </div>
   )



}

export default Crud;