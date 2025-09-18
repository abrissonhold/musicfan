import { useState } from "react";
import "./History.css"
function History(){
    const [visitedItems, setVisitedItems] = useState(() => {
        const parsedHistory = JSON.parse(localStorage.getItem("history"));
    })
    return (
        <>
            <div className="history">

            </div>
        </>
    )
}
export { History };