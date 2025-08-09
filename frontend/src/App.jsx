import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Messenger from './messenger';
import User from './users/user';
import SignUp from './users/signup';
import Login from './users/login';
import UserMessage from './users/usermessage';

  function App() {
    
  return (
   
     <BrowserRouter>
     <Routes>
      <Route path='/' element={ <Messenger />} />
      <Route path='/user' element={ <User />} />
      <Route path='/signup' element={ <SignUp />} />
      <Route path='/login' element={ <Login />} />
      <Route path='/usermessage' element={ <UserMessage />} />
     </Routes>
     </BrowserRouter>
  );
}

export default App;

