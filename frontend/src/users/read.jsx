import { useState, useEffect } from "react";
import axios from "axios";

const Read = () => {
   const [users, setUsers] = useState([]);

   useEffect(() => {
      const fetchUsers = async () => {
         try {
            const response = await axios.get("http://localhost:5000/api/user", {
            });
            setUsers(response.data);
         }
         catch (error) {
            console.error("Errpr fetching users:", error);
         }
      }
      fetchUsers();
   }, []);

   


   return (
      <div>
         <h1>Read Operation</h1>
         <table>
            <thead>
               <tr>
                  <th>
                     name
                  </th>
                  <th>
                     password
                  </th>
               </tr>
            </thead>
            <tbody>
               {users.map((user) => (
                  <tr key={user._id}>
                     <td>
                        {user.name}
                     </td>
                     <td>
                        {user.password}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   )
}

export default Read;