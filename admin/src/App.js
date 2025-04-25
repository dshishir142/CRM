import './App.css';
import Dashboard from './components/dashboard';
import NavBar from './components/navBar';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import UsersPage from './components/users';
import AddUser from './components/addUser';
import EditUser from './components/editUser';
import Interaction from './components/interactions';
import Email from './components/email';

function App() {

  const location = useLocation();
  return (
    <>
    <NavBar />
    <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/adduser" element={<AddUser />} />
          <Route path="/edituser" element={<EditUser />} />
          <Route path="/interactions" element={<Interaction />} />
          <Route path="/email" element={<Email />} />
        </Routes>
    </>
  );
}

export default App;
