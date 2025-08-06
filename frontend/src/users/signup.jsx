import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const SignUp = () => {
   const [name, Setname] = useState("");
   const [password, Setpassword] = useState("");

    useEffect(() => {
         const fetchUsers = async () => {
            try {
               const response = await axios.get("http://localhost:5000/api/auth");
               setUsers(response.data);
               
            } catch (error) {
               console.error("Error fetching users:", error);
            }
         };
   
         fetchUsers();
      }, []);
   
const handleSubmit = async (e) => {
   e.preventDefault();

   try{
      const response = await axios.post("http://localhost:5000/api/auth", { name, password })
      console.log("Data submitted", response.data)
      Setname("")
      Setpassword("")
   }
   catch(err){
      console.error("no data:", err.message)
   }
}
      
   return (
      <div>
         <h1>Regester</h1>
         <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 justify-center items-center">
               <input className="text-black p-1 rounded" type="text" placeholder="Enter your name" value={name} onChange={(e) => Setname(e.target.value)} required />

               <input className="text-black p-1 rounded" type="password" placeholder="Enter your password" value={ password } onChange={(e) => Setpassword(e.target.value)} required />

               <button className="bg-green-400 w-20 rounded" type="submit">Submit</button> 
            </div>
         </form>
      </div>
   )



}

export default SignUp;