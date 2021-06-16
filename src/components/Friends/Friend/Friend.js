import React from "react"
import style from "./Friend.module.css"


const Friend = (props) => {
    let addDialog = () => {
        props.addDialog(props.localId, props.name)
    }
    return (
        <div className={style.Friend}>
            <div className={style.NameDiv}><p className={style.Name}>{props.name}</p></div>
            <p onClick={addDialog} className={style.runDialog}>
                Создать диалог
            </p>
            <p onClick={() => {
                props.deleteFriend(props.localId)
            }} className={style.Delete}>Удалить из друзей</p>
        </div>
    )
}

export default Friend