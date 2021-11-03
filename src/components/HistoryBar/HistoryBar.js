// import { useEffect } from 'react';
import s from './HistoryBar.module.css';
import { useHistory} from 'react-router-dom';
import { IoArrowBackSharp } from "react-icons/io5";
import { IoArrowForwardSharp } from "react-icons/io5";


export default function HistoryBar() {
    const history = useHistory();
    
    const historyBack = () => {
        history.goBack()
    }

    const historyForward = () => {
        history.goForward()
    }


    return (
        <div className={s.HistoryBar}>
            <button type="button" onClick={historyBack} className={s.HistoryButton}>
                <IoArrowBackSharp/>
            </button>
            
            <button type="button" onClick={historyForward} className={s.HistoryButton}>
                <IoArrowForwardSharp/>
            </button>   
            
        </div>
    )
}