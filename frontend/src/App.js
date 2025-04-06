import { ToastContainer } from 'react-toastify';
import { WebSocketClient, closeWebSocket } from './components/webSocketUtils';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import NavBar from './components/dashboardComponents/navBar';
import Home from './components/Home';
import Clients from './components/clients';
import Email from './components/email';
import Interactions from './components/interactions';
import Profile from './components/profile';
import UserLogin from './components/userlogin';
import UserSignin from './components/userSignin';
import EditUser from './components/editUser';
import AddClient from './components/addclient';
import AddInteraction from './components/addInteraction';
import ComposeMail from './components/composeMail';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem('user'));
    const user_id = localData.user_id;
    WebSocketClient(user_id);

    return () => {
      closeWebSocket();
    }
  }, []);


  const location = useLocation();
  const hideNavOnRoutes = ["/userlogin", "/usersignin", "/edituser"]; 

  return (
    <>
      {!hideNavOnRoutes.includes(location.pathname) && <NavBar />}
      
      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/email" element={<Email />} />
          <Route path="/interactions" element={<Interactions />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/userlogin" element={<UserLogin />} />
          <Route path="/usersignin" element={<UserSignin />} />
          <Route path="/edituser" element={<EditUser />} />
          <Route path="/addclient" element={<AddClient />} />
          <Route path="/addinteraction" element={<AddInteraction />} />
          <Route path="/composeMail" element={<ComposeMail />} />
        </Routes>
      </AnimatePresence>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        toastStyle={{
          backgroundColor: "#1e1e1e",
          color: "white",
          borderRadius: "10px",
          padding: "12px",
          fontSize: "14px",
        }}
      />
    </>
  );
}

export default App;
