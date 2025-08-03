import React from 'react';
import Crud from './users/crud';
import Read  from './users/read'
  function App() {
  return (
    <div className="flex-col  min-h-screen bg-blue-500 text-white flex items-center justify-center">
      <Crud />
      <Read />
    </div>
  );
}

export default App;

