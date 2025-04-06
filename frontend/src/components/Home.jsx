import NavBar from "./dashboardComponents/navBar";
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import style from "../style/home.module.css";

export default function Dashboard(){

      
    return(
        <div>
            <NavBar />
            <h1>Hello There</h1>
        </div>
    )
}