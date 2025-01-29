import './App.css';
import userLogin from './user/userLogin/userlogin';
import UserSignin from './user/userSignin/userSignin';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path='/userSignin' element={<UserSignin />}></Route>
    </Routes>
  );
}

export default App;
