import React from "react"
import style from "./Auth.module.css"
import axios from "axios"

const Auth = (props) => {
    let loginInput = React.createRef()
    let loginInputChange = () => {
        let text = loginInput.current.value
        props.UpdateLoginInputValue(text)
    }
    let passwordInput = React.createRef()
    let passwordInputChange = () => {
        let text = passwordInput.current.value
        props.UpdatePasswordInputValue(text)
    }
    let loginHandler = async () => {
        const authData = {
            email: loginInput.current.value,
            password: passwordInput.current.value,
            returnSecureToken: true
        }
        let registered = false
        props.downloadChangeTrue()
        if (props.validLogin & props.validPassword) {
            try {
                const response = await axios.post(
                    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBx7Ean7H1f9Zrs5oAtX-asQZ9wR2F2EDI",
                    authData
                )
                let data = response.data
                data.registered ? registered = true : registered = false
                let text = response.data.localId
                props.localIdValue(text, registered)
            } catch (e) {
                console.log(e)
                alert("Email не зарегистрирован")
            }
        }
        if (!props.validLogin & props.validPassword) {
            alert("Не коректный Email")
        }
        if (props.validLogin & !props.validPassword) {
            alert("Не коректный Пароль")
        }
        if (!props.validLogin & !props.validPassword) {
            alert("Не коректный Email и Пароль")
        }
        props.downloadChangeFalse()
    }

    let registerHandler = async () => {
        let nameCounter = await axios.get("https://threesby-c4746-default-rtdb.firebaseio.com/NameCounter.json")
        const authData = {
            email: loginInput.current.value,
            password: passwordInput.current.value,
            returnSecureToken: true
        }
        props.downloadChangeTrue()
        if (props.validLogin & props.validPassword) {
            try {
                let names = (await axios.get(
                    "https://threesby-c4746-default-rtdb.firebaseio.com/Names.json")
                ).data
                const response = await axios.post(
                    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBx7Ean7H1f9Zrs5oAtX-asQZ9wR2F2EDI",
                    authData
                )
                const data = await axios.put(
                    `https://threesby-c4746-default-rtdb.firebaseio.com/Users/User-${response.data.localId}.json`,
                    {
                    localId: response.data.localId,
                    dialogs: {},
                    name: "Аноним" + `${nameCounter.data.length + 1}`,
                    friends: {}
                })
                nameCounter.data.push(nameCounter.data.length + 1)
                let newNameCounter = {"NameCounter": nameCounter.data}
                await axios.patch(
                    'https://threesby-c4746-default-rtdb.firebaseio.com/.json',
                    newNameCounter
                )
                names.push("Аноним" + `${nameCounter.data.length}`)
                let dataNames = {"Names": names}
                await axios.patch(
                    'https://threesby-c4746-default-rtdb.firebaseio.com/.json',
                    dataNames
                )
                alert("Вы успешно зарегистрировались")
            } catch (e) {
                console.log(e)
                alert("Такой Email уже зарегистрирован")
            }
        }
        if (!props.validLogin & props.validPassword) {
            alert("Не коректный Email")
        }
        if (props.validLogin & !props.validPassword) {
            alert("Не коректный Пароль")
        }
        if (!props.validLogin & !props.validPassword) {
            alert("Не коректный Email и Пароль")
        }
        props.downloadChangeFalse()
    }


    return (
        <div className={style.Auth}>
            <form className={style.AuthForm}>
                <div className={style.AuthFormDiv}>
                    <p className={style.AuthText}>Авторизация</p>
                    <input onChange={loginInputChange} ref={loginInput} placeholder="Email"
                           value={props.loginInputValue}/>
                    {!props.validLogin & props.loginInputValue.length > 0 ?
                        <p className={style.ValidEmail}>Введен не коректный Email</p> : null}
                    <input onChange={passwordInputChange} ref={passwordInput} placeholder="Пароль"
                           value={props.passwordInputValue}/>
                    {!props.validPassword & props.passwordInputValue.length > 0 ?
                        <p className={style.ValidPassword}>Не менее 6 символов</p> : null}
                    <div className={style.Buttons}>
                        <div onClick={loginHandler}><p>Войти</p></div>
                        <div onClick={registerHandler} className={style.buttonReg}><p>Регистрация</p></div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Auth