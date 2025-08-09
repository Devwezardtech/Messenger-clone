import { useState } from "react";
import { useNavigate } from "react-router-dom";

const User = () => {
   const [users, setUsers] = useState([
    { id: 1, name: "Alice", message: " hey how are you" },
    { id: 2, name: "Bob", message: "nice to meet you here" },
    { id: 3, name: "Charlie", message: "hello I am dev" }
  ]);
  const navigate = useNavigate();

  const goToUser = () => {
   navigate("/usermessage")
  }

   return(
      <>
      <div className="flex justify-between pt-4 px-8">
         <h3 className="text-lg">Messenger</h3>
         <button>***</button>
      </div>
      <div className="pt-8">
         <div>
            <input className="border border-gray-400 rounded-md p-1 px-4 mx-12 w-full" type="search" name="search" placeholder="Search" />
         </div>
         <div>
            <button onClick={goToUser}>
       <div className="flex overflow-x-auto space-x-4 p-2">
  {users.map((user) => (
    <div key={user.id} className="flex flex-col items-center">
      <img
        className="border rounded-full p-1 w-16 h-16"
        src=""
        alt="Photo"
      />
      <p className="font-bold pt-2">{user.name}</p>
    </div>
  ))}
</div>

         </button>
         </div>
         <button onClick={goToUser}>
         {users.map((user) => (
            <div key={user.id} className="p-2">
               <div className="flex">
                  <img  className="border rounded-full p-1 w-12 h-12 mx-2" src="" alt="Photo" />
               <p className="font-bold pt-4">{user.name}</p>
            <p className="text-gray-600 p-4">{user.message}</p>
            </div>
         
            </div>
         ))}
         </button>
      </div>
      </>
   )
   
}

export default User;