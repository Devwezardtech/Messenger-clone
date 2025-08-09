import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
   const [name, Setname] = useState("");
   const [password, Setpassword] = useState("");

   const navigate = useNavigate();

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
      const response = await axios.post("http://localhost:5000/api/", { name, password })
      console.log("Data submitted", response.data)
      Setname("")
      Setpassword("")
   }
   catch(err){
      console.error("no data:", err.message)
   }
}

const login = () => {
   navigate("/login");
}

const back =() => {
   navigate("/login")
}
      
   return (
      <div>
         <button className="flex px-8 pt-4" onClick={back}>X</button>
      <div className="flex justify-center item-center p-16">
         <div >
            <div className="flex justify-center item-center">
         <h1 className="text-lg p-8">Regester</h1>
         </div>
         

         <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 justify-center items-center">
               <input className="text-black p-1 rounded border border-gray-400" type="text" placeholder="name" value={name} onChange={(e) => Setname(e.target.value)} required />

               <input className="text-black p-1 rounded border border-gray-400" type="password" placeholder="password" value={ password } onChange={(e) => Setpassword(e.target.value)} required />

               <button className="bg-green-400 w-20 text-white rounded" type="submit">Submit</button> 
            </div>
         </form>

<div className="flex">
   <h5>already have an account? </h5>
         <button className="bg-green-100 rounded-md px-2 mx-1 w-20" onClick={login}>  login</button>
 </div>
     </div>
      </div>
      </div>
   )



}

export default SignUp;