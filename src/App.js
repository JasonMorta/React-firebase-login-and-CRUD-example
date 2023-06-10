import logo from './logo.svg';
import './App.css';
import { Auth } from './components/Auth';
import Data from './components/Data';
import { useState } from 'react';

function App() {

  const [userData, setUserData] = useState();

  const transferUserData = (user) => {
    setUserData(user)
  };

  return (
    <div className="App">
     <Auth passUser={transferUserData} />
     <Data userData={userData} />
    </div>
  );
}

export default App;
