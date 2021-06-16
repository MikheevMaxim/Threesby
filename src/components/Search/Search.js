import React from "react"
import style from "./Search.module.css"


const Search = (props) => {
    let inputValue = React.createRef()
    let changeInputValue = () => {
        let addNewElement = inputValue.current.value
        props.changeSearchName(addNewElement)
    }
    if (Object.keys(props.users).length == 0) {
        props.downloadUsers()
    }
    return (
        <div className={style.Search}>
            <div className={style.Top}>
                <p onClick={props.history.goBack}>Назад</p>
                <input
                    onChange={changeInputValue}
                    ref={inputValue}
                    autoFocus="autoFocus"
                    placeholder="Поиск"
                    type="text" value={props.searchName}
                />
            </div>
            <div className={style.Results}>
                {Object.values(props.users).map((user, key) => {
                    let searchName = props.searchName
                    let userName = user.name
                    let result = ""
                    for (let i = 0; searchName.length > i; i++) {
                        result += userName[i]
                    }
                    if (searchName == result) {
                        //if (searchName != "" ) { //не показывает результаты до начала ввода текста
                        if (userName == props.name) {
                            return null
                        } else {
                            return (
                                <div key={key} className={style.Result}>
                                    <p className={style.Name}>{user.name}</p>
                                    {
                                        props.friends.indexOf(user.localId) != -1
                                            ? <div className={style.Friend}><p>В друзьях</p></div>
                                            : <div className={style.Add} onClick={() => {
                                                props.addFriend(user.localId)
                                            }}><p>Добавить в друзья</p></div>
                                    }
                                </div>
                            )
                        }
                    }
                    // }
                })}
            </div>
        </div>
    )
}

export default Search