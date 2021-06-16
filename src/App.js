import React, {Component} from 'react'
import style from "./App.module.css"
import Navbar from "./components/Navbar/Navbar"
import Menu from "./components/Menu/Menu"
import Dialogs from "./components/Dialogs/Dialogs"
import Search from "./components/Search/Search"
import Friends from "./components/Friends/Friends"
import {Route, withRouter} from "react-router-dom"
import {createBrowserHistory} from "history"
import ActiveDialog from "./components/Dialogs/Dialog/ActiveDialog/ActiveDialog"
import Auth from "./components/Auth/Auth"
import axios from "axios"
import Settings from "./components/Settings/Settings"
import Download from "./components/Download/Download"


const history = createBrowserHistory()
class App extends Component {
    state = {
        download: false,
        login: "",
        password: "",
        loginInputValue: "",
        passwordInputValue: "",
        validLogin: false,
        validPassword: false,
        activeDialog: "",
        name: "",
        secondName: "",
        dialogs: [],
        dialogsData: [],
        markerNewMessageForMenu: false,
        messages: {},
        messageValue: "",
        users: {},
        searchName: "",
        friends: [],
        friendsData: [],
        textareaCounterSymbols: 1,
        User: {
            auth: false,
            localId: ""
        },
        Menu: {
            dialogs: false,
            friends: false,
            settings: false,
            exit: false,
            auth: true
        },
        Search: {
            users: {1: {name: 1}, 2: {name: 2}},
            searchName: ""
        }
    }

    downloadChangeTrue = () => {
        this.setState({download: true})
    }

    downloadChangeFalse = () => {
        this.setState({download: false})
    }

    downloadsDialogsData = async () => {
        let dialogs = this.state.dialogs
        let dialogsData = this.state.dialogsData
        if (dialogsData.length === 0) {
            if (dialogs.length > 0) {
                for (let i = 0; dialogs.length > i; i++) {
                    let data = await axios.get(`https://threesby-c4746-default-rtdb.firebaseio.com/AllDialogs/dialog-${dialogs[i].id}.json`)
                    dialogsData.push(data.data)
                }
            }
        }
        this.setState({dialogsData: dialogsData})
    }

    checkingForNewMessages = async () => {
        if (this.state.Menu.dialogs) {
            let dialogsBase = []
            try {
                dialogsBase = (
                    await axios.get(`https://threesby-c4746-default-rtdb.firebaseio.com/Users/User-${localStorage.localId}/dialogs.json`)
                ).data
            } catch (e) {
                console.log(e)
                dialogsBase = []
            }
            let marker = false
            let change = false
            if (dialogsBase != null) {
                dialogsBase.map((dialog) => {
                    if (document.location.pathname === `/dialogs/dialog-${dialog.id}`) {
                        if (dialog.marker) {
                            change = true
                        }
                        dialog.marker = false
                    }
                    if (dialog.marker === true) {
                        marker = true
                    }
                })
                if (marker || change || this.state.markerNewMessageForMenu != marker) {
                    this.setState({dialogs: dialogsBase, markerNewMessageForMenu: marker})
                }

                if (change) {
                    await axios.put(
                        `https://threesby-c4746-default-rtdb.firebaseio.com/Users/User-${localStorage.localId}/dialogs.json`,
                        dialogsBase
                    )
                }
            }
        }
        setTimeout(this.checkingForNewMessages, 3000)
    }

    deactivateMarker = async (index) => {
        let dialogs = this.state.dialogs
        dialogs[index.index].marker = false
        this.setState({dialogs: dialogs})
        await axios.put(
            `https://threesby-c4746-default-rtdb.firebaseio.com/Users/User-${localStorage.localId}/dialogs.json`,
            dialogs
        )
    }

    emptyFunction() {
    }

    localIdValue = (text, registered) => {
        this.setState({User: {localId: text, auth: registered}})
        registered ? this.downloadUserData(text) : this.emptyFunction()
        registered ? this.downloadsDialogsData() : this.emptyFunction()
        !localStorage.registered ? history.goBack() : this.emptyFunction()
        registered ? this.setState({
            Menu: {
                dialogs: true,
                friends: true,
                settings: true,
                exit: true,
                auth: false
            }
        }) : this.emptyFunction()
    }

    exit = () => {
        this.setState({
            Menu: {
                dialogs: false,
                friends: false,
                settings: false,
                exit: false,
                auth: true
            },
            name: "",
            login: "",
            password: "",
            dialogs: [],
            myMessages: [],
            messagesFrom: [],
            messageValue: "",
            friends: [],
            friendsData: []
        })
        localStorage.clear()
    }

    UpdateLoginInputValue = (text) => {
        this.setState({loginInputValue: text})
        let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
        if (reg.test(text) == false) {
            this.setState({validLogin: false})
        } else {
            this.setState({validLogin: true})
        }
    }

    UpdatePasswordInputValue = (text) => {
        this.setState({passwordInputValue: text})
        if (text.length < 6) {
            this.setState({validPassword: false})
        } else {
            this.setState({validPassword: true})
        }
    }

    UpdateMessageValue = (text, textareaCounterSymbols) => {
        if (textareaCounterSymbols == 0) {
            this.setState({messageValue: text})
        } else {
            this.setState({messageValue: text,
                textareaCounterSymbols: textareaCounterSymbols})
        }
    }

    AddMessage = async () => {
        let state = this.state
        let newMessagesObject = {message: state.messageValue, name: state.name}
        await axios.post(
            `https://threesby-c4746-default-rtdb.firebaseio.com/AllDialogs/dialog-${state.activeDialog}/messages.json`,
            newMessagesObject
        )
        let data = await axios.get(
            `https://threesby-c4746-default-rtdb.firebaseio.com/AllDialogs/dialog-${state.activeDialog}.json`
        )
        let localIdSecondUser = ""
        if (data.data.firstLocalId === localStorage.localId) {
            localIdSecondUser = data.data.secondLocalId
        }
        if (data.data.secondLocalId === localStorage.localId) {
            localIdSecondUser = data.data.firstLocalId
        }
        let dialogsDataSecondUser = (await axios.get(
            `https://threesby-c4746-default-rtdb.firebaseio.com/Users/User-${localIdSecondUser}/dialogs.json`)
        ).data
        dialogsDataSecondUser.map((dialog) => {
            if (dialog.id === this.state.activeDialog) {
                dialog.marker = true
            }
        })
        await axios.put(
            `https://threesby-c4746-default-rtdb.firebaseio.com/Users/User-${localIdSecondUser}/dialogs.json`,
            dialogsDataSecondUser
        )
        this.setState({
            messages: data.data.messages,
            messageValue: ""
        })
    }

    registerHandler = async () => {
        const authData = {
            email: this.state.Auth.loginInputValue,
            password: this.state.Auth.passwordInputValue,
            returnSecureToken: true
        }
        try {
            const response = await axios.post(
                "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBx7Ean7H1f9Zrs5oAtX-asQZ9wR2F2EDI",
                authData
            )
            await axios.post(
                `https://threesby-c4746-default-rtdb.firebaseio.com/Users.json`,
                `User-${response.data.localId}`
            )
            console.log(response.data)
        } catch (e) {
            console.log(e)
        }
    }

    downloadUserData = async (text) => {
        this.setState({download: true})
        let data = await axios.get(
            `https://threesby-c4746-default-rtdb.firebaseio.com/Users/User-${text}.json`
        )
        data.data.dialogs ? this.setState({dialogs: data.data.dialogs}) : this.emptyFunction()
        data.data.friends ? this.setState({friends: data.data.friends}) : this.emptyFunction()
        this.setState({name: data.data.name})
        localStorage.setItem("login", data.data.login)
        localStorage.setItem("password", data.data.password)
        localStorage.setItem("localId", this.state.User.localId)
        localStorage.setItem("registered", this.state.User.auth)
        this.setState({login: data.data.login})
        this.setState({password: data.data.password})
        this.downloadFriendsData()
        this.setState({download: false})
    }

    changeMyNameAllDialogs = async (oldName) => {
        let stateDialogs = this.state.dialogs
        stateDialogs.map(async (dialog) => {
            let data = await axios.get(
                `https://threesby-c4746-default-rtdb.firebaseio.com/AllDialogs/dialog-${dialog.id}.json`
            )
            if (data.data.firstName === oldName) {
                data.data.firstName = this.state.name
            }
            if (data.data.secondName === oldName) {
                data.data.secondName = this.state.name
            }
            if (data.data.messages) {
                Object.values(data.data.messages).map((message) => {
                    if (message.name === oldName) {
                        message.name = this.state.name
                    }
                })
            }
            await axios.patch(
                `https://threesby-c4746-default-rtdb.firebaseio.com/AllDialogs/dialog-${dialog.id}.json`,
                data.data
            )
        })
    }

    changeMyNameMyDialogs = async (oldName) => {
        let stateFriends = this.state.friends
        let stateDialogs = this.state.dialogs
        let newStateDialogs = []
        stateDialogs.map((dialog) => {
            if (dialog.firstName === oldName) {
                dialog.firstName = this.state.name
            }
            if (dialog.secondName === oldName) {
                dialog.secondName = this.state.name
            }
            newStateDialogs.push(dialog)
        })
        this.setState({dialogs: newStateDialogs})
        await axios.patch(
            `https://threesby-c4746-default-rtdb.firebaseio.com/Users/User-${localStorage.localId}.json`,
            {dialogs: newStateDialogs}
        )
        for (let i = 0; stateFriends.length > i; i++) {
            let dataFriend = await axios.get(
                `https://threesby-c4746-default-rtdb.firebaseio.com/Users/User-${stateFriends[i]}.json`
            )
            let newDialogs = []
            if (dataFriend.data.dialogs) {
                dataFriend.data.dialogs.map((dialog) => {
                    if (dialog.firstName === oldName) {
                        dialog.firstName = this.state.name
                    }
                    if (dialog.secondName === oldName) {
                        dialog.secondName = this.state.name
                    }
                    newDialogs.push(dialog)
                })
            }
            if (newDialogs.length > 0) {
                await axios.patch(
                    `https://threesby-c4746-default-rtdb.firebaseio.com/Users/User-${stateFriends[i]}.json`,
                    {dialogs: newDialogs}
                )
            }
        }
    }

    downloadDialogData = async (number) => {
        this.setState({download: true})
        try {
            let data = await axios.get(
                `https://threesby-c4746-default-rtdb.firebaseio.com/AllDialogs/dialog-${number}.json`
            )
            let secondName = ""
            if (data.data.secondName === this.state.name) {
                secondName = data.data.firstName
            } else {
                secondName = data.data.secondName
            }
            this.setState({
                messages: data.data.messages,
                activeDialog: number,
                secondName: secondName
            })
            localStorage.setItem("activeDialog", number)
        } catch (e) {
            console.log(e)
        }
        this.downloadsDialogsData()
        this.setState({download: false})
    }

    updateMessages = async () => {
        let messages = await axios.get(
            `https://threesby-c4746-default-rtdb.firebaseio.com/AllDialogs/dialog-${this.state.activeDialog}/messages.json`
        )
        if (this.state.messages != undefined) {
            if (Object.values(this.state.messages).length != Object.values(messages.data).length) {
                this.setState({messages: messages.data})
            }
        }
    }

    autoLogin = () => {
        this.setState({download: true})
        let text = localStorage.getItem("localId")
        let registered = localStorage.getItem("registered")
        let number = localStorage.getItem("activeDialog")
        this.localIdValue(text, registered)
        if (number) {
            this.downloadDialogData(number)
        }
        this.setState({download: false})
    }

    updateName = async (text) => {
        this.setState({download: true})
        let oldName = this.state.name
        let names = (await axios.get(
            "https://threesby-c4746-default-rtdb.firebaseio.com/Names.json")
        ).data
        let theNameExists = false
        names.map((name) => {
            if (name === text) {
                return (
                    theNameExists = true
                )
            }
        })
        if (theNameExists) {
            alert("Такое имя уже есть")
        } else {
            let newNames = []
            names.map((name, key) => {
                if (name != oldName) {
                    return (
                        newNames.push(name)
                    )
                }
            })
            newNames.push(text)
            let dataNames = {"Names": newNames}
            await axios.patch(
                'https://threesby-c4746-default-rtdb.firebaseio.com/.json',
                dataNames
            )
            this.setState({name: text})
            let data = {"name": text}
            await axios.patch(
                `https://threesby-c4746-default-rtdb.firebaseio.com/Users/User-${localStorage.localId}.json`,
                data
            )
            alert("Имя успешно изменено")
            this.changeMyNameAllDialogs(oldName)
            this.changeMyNameMyDialogs(oldName)
            this.setState({download: false})
        }

    }

    downloadUsers = async () => {
        let data = await axios.get(
            "https://threesby-c4746-default-rtdb.firebaseio.com/Users.json"
        )
        this.setState({users: data.data})
    }

    changeSearchName = (text) => {
        this.setState({searchName: text})
    }

    componentDidMount() {
        this.autoLogin()
        this.checkingForNewMessages()
    }

    addFriend = async (localId) => {
        this.setState({download: true})
        let stateFriends = this.state.friends
        stateFriends.push(localId)
        this.setState({friends: stateFriends})
        await axios.put(
            `https://threesby-c4746-default-rtdb.firebaseio.com/Users/User-${localStorage.localId}/friends.json`,
            stateFriends
        )
        this.downloadFriendsData()
        this.setState({download: false})
    }

    deleteFriend = async (localId) => {
        this.setState({download: true})
        let stateFriends = this.state.friends
        let newStateFriends = []
        stateFriends.map((friend) => {
            if (friend != localId) {
                newStateFriends.push(friend)
            }
        })
        this.setState({friends: newStateFriends})
        await axios.put(
            `https://threesby-c4746-default-rtdb.firebaseio.com/Users/User-${localStorage.localId}/friends.json`,
            newStateFriends
        )
        this.downloadFriendsData()
        this.setState({download: false})
    }

    addDialog = async (localId, secondName) => {
        this.setState({download: true})
        let allowAddDialog = true
        let dialogId = 0
        let stateDialogsCheck = this.state.dialogs
        stateDialogsCheck.map((dialog) => {
            if (
                dialog.firstName === secondName
                || dialog.firstName === this.state.name
                & dialog.secondName === this.state.name
                || dialog.secondName === secondName
            ) {
                allowAddDialog = false
                dialogId = dialog.id
            }
        })
        if (allowAddDialog) {
            let dialogsCounter = await axios.get(
                "https://threesby-c4746-default-rtdb.firebaseio.com/DialogCounter.json"
            )
            let dialogsSecondName = await axios.get(
                `https://threesby-c4746-default-rtdb.firebaseio.com/Users/User-${localId}/dialogs.json`
            )
            let stateDialogs = this.state.dialogs
            stateDialogs.push({
                id: dialogsCounter.data.length + 1,
                firstName: this.state.name,
                secondName: secondName,
                marker: false
            })
            if (dialogsSecondName.data === 1) {
                dialogsSecondName.data = []
            }
            if (dialogsSecondName.data === null) {
                dialogsSecondName.data = []
            }
            dialogsSecondName.data.push({
                id: dialogsCounter.data.length + 1,
                firstName: this.state.name,
                secondName: secondName,
                marker: true
            })
            dialogsCounter.data.push(dialogsCounter.data.length + 1)
            this.setState({dialogs: stateDialogs})
            await axios.put(
                `https://threesby-c4746-default-rtdb.firebaseio.com/AllDialogs/dialog-${dialogsCounter.data.length}.json`,
                {
                firstName: this.state.name,
                secondName: secondName,
                messages: {},
                id: dialogsCounter.data.length,
                firstLocalId: localStorage.localId,
                secondLocalId: localId
            })
            await axios.put(
                `https://threesby-c4746-default-rtdb.firebaseio.com/Users/User-${localStorage.localId}/dialogs.json`,
                stateDialogs
            )
            await axios.put(
                `https://threesby-c4746-default-rtdb.firebaseio.com/Users/User-${localId}/dialogs.json`,
                dialogsSecondName.data
            )
            await axios.patch(
                'https://threesby-c4746-default-rtdb.firebaseio.com/.json',
                {"DialogCounter": dialogsCounter.data}
            )
            this.downloadDialogData(dialogsCounter.data.length)
            alert('Диалог успешно создан, перейдите во вкладку "Диалоги"')
        } else {
            alert('Этот диалог уже создан, перейдите во вкладку "Диалоги"')
        }
        this.setState({download: false})
        // this.downloadDialogData(dialogId)
    }


    downloadFriendsData = async () => {
        this.setState({download: true})
        let friendsData = []
        let friendsLocalId = this.state.friends
        for (let i = 0; friendsLocalId.length > i; i++) {
            let data = await axios.get(
                `https://threesby-c4746-default-rtdb.firebaseio.com/Users/User-${friendsLocalId[i]}.json`
            )
            friendsData.push(data.data)
        }
        this.setState({friendsData: friendsData})
        localStorage.setItem("friends", this.state.friends)
        this.setState({download: false})
    }


    render() {
        return (
            <div className={style.App}>
                {this.state.download ? <Download/> : null}
                <Route path={"/"} render={() => <Navbar
                    history={history}
                    downloadUsers={this.downloadUsers}
                />}/>
                <Route exact path={"/dialogs"} render={() => <Dialogs
                    history={history}
                    dialogs={this.state.dialogs}
                    downloadDialogData={this.downloadDialogData}
                    name={this.state.name}
                    deactivateMarker={this.deactivateMarker}
                />}/>
                <Route exact path={"*/dialog-*"} render={() => <ActiveDialog
                    history={history}
                    messages={this.state.messages}
                    messageValue={this.state.messageValue}
                    UpdateMessageValue={this.UpdateMessageValue}
                    AddMessage={this.AddMessage}
                    myName={this.state.name}
                    secondName={this.state.secondName}
                    updateMessages={this.updateMessages}
                    textareaCounterSymbols={this.state.textareaCounterSymbols}
                />}/>
                <Route exact path="/search" render={() => <Search
                    history={history}
                    downloadUsers={this.downloadUsers}
                    users={this.state.users}
                    changeSearchName={this.changeSearchName}
                    searchName={this.state.searchName}
                    name={this.state.name}
                    addFriend={this.addFriend}
                    friends={this.state.friends}
                />}/>
                <Route path="/auth" render={() => <Auth
                    history={history}
                    UpdateLoginInputValue={this.UpdateLoginInputValue}
                    UpdatePasswordInputValue={this.UpdatePasswordInputValue}
                    registerHandler={this.registerHandler}
                    localIdValue={this.localIdValue}
                    validLogin={this.state.validLogin}
                    validPassword={this.state.validPassword}
                    loginInputValue={this.state.loginInputValue}
                    passwordInputValue={this.state.passwordInputValue}
                    downloadChangeTrue={this.downloadChangeTrue}
                    downloadChangeFalse={this.downloadChangeFalse}
                />}/>
                <Route path="/menu" render={() => <Menu
                    history={history}
                    name={this.state.name}
                    menu={this.state.Menu}
                    exit={this.exit}
                    markerNewMessageForMenu={this.state.markerNewMessageForMenu}
                />}/>
                <Route path="/settings" render={() => <Settings
                    history={history}
                    updateName={this.updateName}
                />}/>
                <Route path="/friends" render={() => <Friends
                    friendsData={this.state.friendsData}
                    friends={this.state.friends}
                    downloadFriendsData={this.downloadFriendsData}
                    deleteFriend={this.deleteFriend}
                    addDialog={this.addDialog}
                />}/>
            </div>
        )
    }
}

export default withRouter(App)
