import React from 'react';
import Crud from './users/crud';
import Login from './users/login';
import SignUp from './users/signup';

  function Messenger() {
    
  return (
    <div className="flex-col  min-h-screen flex items-center justify-center">
      { /*<Crud />
      <SignUp />
       */}
      <Login />
      
     
    </div>
  );
}

export default Messenger;

