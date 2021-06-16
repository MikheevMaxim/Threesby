import React from "react"
import style from "./Menu.module.css"
import {NavLink} from "react-router-dom"


const Menu = (props) => {
    return (
        <div className={style.MenuWindow}>
            <div onClick={props.history.goBack} className={style.background}>
            </div>
            <div className={style.Menu}>
                <div className={style.info}>
                    <div className={style.Ava}>
                        <div className={style.exit}>
                            <p onClick={props.history.goBack}>Закрыть</p>
                        </div>
                        {/*<img
                         src={"https://omoro.ru/wp-content/uploads/2018/05/prikilnie-kartinki-na-avatarky-dlia-devyshek-12.jpg"}
                         />*/}
                        <p className={style.name}>{props.name}</p>
                    </div>
                </div>
                <div className={style.items}>
                    {props.menu.friends ? <NavLink to="/friends">Друзья</NavLink> : null}
                    {props.menu.dialogs ? <NavLink to="/dialogs">Диалоги
                        {props.markerNewMessageForMenu ? <span className={style.Mark}>&#8226;</span> : null}
                    </NavLink> : null}
                    {props.menu.settings ? <NavLink to="/settings">Изменить имя</NavLink> : null}
                    {props.menu.exit ? <NavLink to="/menu"><p onClick={props.exit}>Выйти</p></NavLink> : null}
                    {props.menu.auth ? <NavLink to="/auth">Войти</NavLink> : null}
                </div>
            </div>
        </div>
    )
}

export default Menu