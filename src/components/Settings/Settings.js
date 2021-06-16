import React from "react"
import style from "./Settings.module.css"


const Settings = (props) => {
    let nameInput = React.createRef()
    let changeName = () => {
        let text = nameInput.current.value
        props.updateName(text)
    }


    return (
        <div className={style.Settings}>
            <div className={style.Top}>
                <p className={style.Back} onClick={props.history.goBack}>Назад</p>
                <div className={style.title}>
                    <p>Изменить имя</p>
                </div>
                <p className={style.Back} onClick={changeName}>Применить</p>
            </div>
            <form>
                <input autoFocus ref={nameInput}/>
            </form>
        </div>
    )
}

export default Settings