import React from "react"
import style from "./ActiveDialog.module.css"


const ActiveDialog = (props) => {
    let runUpdateMessages = () => {
        props.updateMessages()
        if (document.location.pathname == "/dialogs/dialog-*") {
            setTimeout(runUpdateMessages, 3000)
        }
    }
    setTimeout(runUpdateMessages, 3000)

    let newMessageElement = React.createRef()
    let changeMessageText = () => {
        let text = newMessageElement.current.value
        let scrollHeight = newMessageElement.current.scrollHeight
        let textareaCounterSymbols = 0
        if (scrollHeight > 20 & scrollHeight < 40) {
            textareaCounterSymbols = text.length
        }
        props.UpdateMessageValue(text, textareaCounterSymbols)
    }

    let messageAdd = () => {
        props.AddMessage()
        setTimeout(scrollBottom, 1000)
    }

    let infoDivMessages = React.createRef()
    const scrollBottom = () => {
        let scrollDiv = infoDivMessages.current
        if (scrollDiv != null) {
            scrollDiv.scrollTop = scrollDiv.scrollHeight
        }
    }

    let myName = props.myName
    let messagesElement = props.messages != undefined
        ? Object.values(props.messages).map((data, index) => {
            if (myName === data.name) {
                if (index + 1 === Object.values(props.messages).length) {
                    setTimeout(scrollBottom, 1000)
                }
                return (
                    <div className={style.MyMessages} key={index}>
                        <p>{data.message}</p>
                    </div>
                )
            } else {
                if (index + 1 === Object.values(props.messages).length) {
                    setTimeout(scrollBottom, 1000)
                }
                return (
                    <div className={style.MessagesFrom} key={index}>
                        <p>{data.message}</p>
                    </div>
                )
            }
        })
        : console.log("Messages none")

    let StyleInput = style.Input
    let StyleMessages = style.Messages
    let rows = 1
    if (props.textareaCounterSymbols < props.messageValue.length) {
        StyleInput = style.Input2
        StyleMessages = style.Messages2
        rows = 2
    }
    if (props.textareaCounterSymbols * 2 < props.messageValue.length) {
        StyleInput = style.Input3
        StyleMessages = style.Messages3
        rows = 3
    }
    if (props.textareaCounterSymbols * 3 < props.messageValue.length) {
        StyleInput = style.Input4
        StyleMessages = style.Messages4
        rows = 4
    }
    if (props.textareaCounterSymbols * 4 < props.messageValue.length) {
        rows = 5
    }
    if (props.textareaCounterSymbols * 5 < props.messageValue.length) {
        rows = 6
    }


    return (
        <div className={style.ActiveDialog}>
            <div className={style.Top}>
                <p className={style.Back} onClick={props.history.goBack}>Назад</p>
                <div className={style.Ava}>
                    {/*<img src={"https://omoro.ru/wp-content/uploads/2018/05/prikilnie-kartinki-na-avatarky-dlia-devyshek-12.jpg"}/>*/}
                    <p>{props.secondName}</p>
                </div>
            </div>
            <div ref={infoDivMessages} className={StyleMessages}>
                {messagesElement}
            </div>
            <div className={StyleInput}>
                <textarea rows={rows}
                          id={"textarea"}
                          onChange={changeMessageText}
                          placeholder="Cообщение"
                          ref={newMessageElement}
                          value={props.messageValue}
                ></textarea>
                <p className={style.AddMessage} onClick={messageAdd}>Отправить</p>
            </div>
        </div>
    )
}

export default ActiveDialog