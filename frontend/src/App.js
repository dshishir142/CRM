import './App.css';
import Clients from './components/clients';
import Email from './components/email';
import Home from './components/Home';
import Interactions from './components/interactions';
import Profile from './components/profile';
import UserLogin from './components/userlogin';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';
import NavBar from './components/dashboardComponents/navBar';
import UserSignin from './components/userSignin';
import EditUser from './components/editUser';
import AddClient from './components/addclient';
import AddInteraction from './components/addInteraction';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/email" element={<PageWrapper><Email /></PageWrapper>} />
        <Route path="/interactions" element={<PageWrapper><Interactions /></PageWrapper>} />
        <Route path="/clients" element={<PageWrapper><Clients /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
        <Route path="/userlogin" element={<PageWrapper><UserLogin /></PageWrapper>} />
        <Route path="/usersignin" element={<PageWrapper><UserSignin /></PageWrapper>} />
        <Route path="/edituser" element={<PageWrapper><EditUser /></PageWrapper>} />
        <Route path="/addclient" element={<PageWrapper><AddClient /></PageWrapper>} />
        <Route path="/addinteraction" element={<PageWrapper><AddInteraction /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const location = useLocation();
  const hideNavOnRoutes = ["/userlogin", "/usersignin", "/edituser"]; 

  return (
    <>
      {!hideNavOnRoutes.includes(location.pathname) && <NavBar />}
      <AnimatedRoutes />
    </>
  );
}

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default App;
