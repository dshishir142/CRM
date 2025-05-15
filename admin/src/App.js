import './App.css';
import React from 'react';
import Login from './components/login';
import Dashboard from './components/dashboard';
import NavBar from './components/navBar';
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import UsersPage from './components/users';
import AddUser from './components/addUser';
import EditUser from './components/editUser';
import Interaction from './components/interactions';
import Email from './components/email';
import Product from './components/product';
import AddProduct from './components/addProduct';
import { AuthContext } from './authContext.js';
import Clients from './components/clients.jsx';
import EditClient from './components/editClient.jsx';
import AssignTask from './components/assignTask.jsx';

const ProtectedRoute = ({ component: Component }) => {
  const { admin } = React.useContext(AuthContext);

  if (!admin) {
    return <Navigate to="/login" />;
  }

  return <Component />;
};

function App() {
  const location = useLocation();

  const hideNavOnRoutes = ["/login"];
  const shouldHideNav = hideNavOnRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNav && <NavBar />}
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute component={Dashboard} />} />
        <Route path="/users" element={<ProtectedRoute component={UsersPage} />} />
        <Route path="/adduser" element={<ProtectedRoute component={AddUser} />} />
        <Route path="/edituser" element={<ProtectedRoute component={EditUser} />} />
        <Route path="/interactions" element={<ProtectedRoute component={Interaction} />} />
        <Route path="/email" element={<ProtectedRoute component={Email} />} />
        <Route path="/product" element={<ProtectedRoute component={Product} />} />
        <Route path="/addproduct" element={<ProtectedRoute component={AddProduct} />} />
        <Route path="/clients" element={<ProtectedRoute component={Clients} />} />
        <Route path="/assigntask" element={<ProtectedRoute component={AssignTask} />} />
        <Route path="/editclient/:id" element={<ProtectedRoute component={EditClient} />} />
      </Routes>
    </>
  );
}

export default App;
