import React from "react"
import style from "./Dialog.module.css"


const Dialog = (props) => {
    let dialogName = ""
    if (props.dialog.firstName === props.name) {
        dialogName = props.dialog.secondName
    } else {
        dialogName = props.dialog.firstName
    }


    return (
        <div className={style.Dialog}>
            {/*<div className={style.Ava}><img
            src={"https://omoro.ru/wp-content/uploads/2018/05/prikilnie-kartinki-na-avatarky-dlia-devyshek-12.jpg"}
            /></div>*/}
            <p className={style.Info}>{dialogName}</p>
            {props.dialog.marker ? <span className={style.Mark}>&#8226;</span> : null}
        </div>
    )
}

export default Dialog