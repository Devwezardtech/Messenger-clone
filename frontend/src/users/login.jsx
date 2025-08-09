import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"
import User from "./user";


const Login = () => {
   const [name, Setname] = useState("");
   const [password, Setpassword] = useState("");
   

   const navigate = useNavigate();
   
const handleSubmit = async (e) => {
   e.preventDefault();

   try{
      console.log( { name, password });
      const response = await axios.post("http://localhost:5000/api/login", { name, password })
   if (response?.data?.user) {
  navigate("/user");
} else {
  navigate("/unauthorized");
}

   }
   catch(err){
      console.error("no data:", err.message)
   }
}

const signUp = () => {
   navigate("/signup")
}

const back =() => {
   navigate("/signup")
}
      
   return (
      <div>
         <button className="flex px-8 pt-4" onClick={back}>X</button>
      <div className="flex justify-center item-center p-16">
         
         <div >
            <div className="flex justify-center item-center">
         <h1 className="text-lg p-8">Login</h1>
         </div>
         

         <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 justify-center items-center">
               <input className="text-black p-1 rounded border border-gray-400" type="text" placeholder="name" value={name} onChange={(e) => Setname(e.target.value)} required />

               <input className="text-black p-1 rounded border border-gray-400" type="password" placeholder="password" value={ password } onChange={(e) => Setpassword(e.target.value)} required />

               <button className="bg-green-400 w-20 text-white rounded" type="submit">Submit</button> 

               <button className="py-4">Forgot password?</button>
            </div>
            

            
            
         </form>
         

<div className="flex">
   <h5>already have an account? </h5>
         <button className="bg-green-100 rounded-md px-2 mx-1 w-20" onClick={signUp}> SignUp</button>
 </div>
     </div>
      </div>
      </div>
   )



}

export default Login;