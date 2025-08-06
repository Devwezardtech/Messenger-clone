import React from 'react';
import Crud from './users/crud';
import Login from './users/login';
import SignUp from './users/signup';

  function Messenger() {
    
  return (
    <div className="flex-col  min-h-screen bg-blue-500 text-white flex items-center justify-center">
      { /*<Crud /> */}
      <Login />
      <SignUp />
     
    </div>
  );
}

export default Messenger;

