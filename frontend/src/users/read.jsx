import { useState, useEffect } from "react";
import axios from "axios";

const Read = ( ) => {
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

   const updateUser = async () => {
      try {
         const response = await axios.put(
            `http://localhost:5000/api/user/${selectedUserId}`,
            updateData
         );
         console.log("User updated:", response.data);

         // Reset state
         
         setSelectedUserId(null);
         setUpdateData({ name: "", password: "" });
        

         // Refresh user list
         const updatedUsers = await axios.get("http://localhost:5000/api/user");
         setUsers(updatedUsers.data);
      } catch (error) {
         console.error("Error updating user:", error);
      }
   };

   return (
      <div className="pt-10">
         <h1>Read Operation</h1>
         <table>
            <thead>
               <tr>
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
                  onClick={updateUser}
               >
                  Save
               </button>
            </div>
         )}
      </div>
   );
};

export default Read;
