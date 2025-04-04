import NavBar from "./dashboardComponents/navBar";
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import style from "../style/home.module.css";

export default function Dashboard(){
    function notificationTest(){
        toast('Wow so easy!', {
            position: "top-right",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: 0.5,
            theme: "light",
            });
    }
      
    return(
        <div>
            <NavBar />
            <h1>Hello There</h1>
            <button onClick={notificationTest}>Click</button>
        </div>
    )
}