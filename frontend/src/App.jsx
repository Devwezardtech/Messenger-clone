import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Messenger from './messenger';
import User from './users/user';
import SignUp from './users/signup';
import Login from './users/login';
import UserMessage from './users/usermessage';

  function App() {
    
  return (
   
     <Routes>
      <Route path='/' element={ <Messenger />} />
      <Route path='/user' element={ <User />} />
      <Route path='/signup' element={ <SignUp />} />
      <Route path='/login' element={ <Login />} />
      <Route path='/user/:id' element={ <UserMessage />} />
     </Routes>
  );
}

export default App;

