import React from "react"
import style from "./Dialogs.module.css"
import Dialog from "./Dialog/Dialog";
import {NavLink} from "react-router-dom";


const Dialogs = (props) => {
    let downloadDialogData = (number, index) => {
        props.downloadDialogData(number.dialog.id)
        props.deactivateMarker(index)
    }
    return (
        <div className={style.Dialogs}>
            {props.dialogs ? props.dialogs.map((dialog, index) => {
                return (
                    <div onClick={() => downloadDialogData({dialog}, {index})} key={index}>
                        <NavLink to={`/dialogs/dialog-${dialog.id}`}>
                            <Dialog dialog={dialog} name={props.name}/>
                        </NavLink>
                    </div>
                )
            }) : null}
        </div>
    )
}

export default Dialogs