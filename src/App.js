import './App.css';
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';

import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';

function App() {

  const loggedIn = window.sessionStorage.getItem("auth_token") ? true : false; 

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/login' element={<Login />} />
          <Route path='/' element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
