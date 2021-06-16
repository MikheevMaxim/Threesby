import React from "react"
import style from "./Friends.module.css"
import Friend from "./Friend/Friend"


const Friends = (props) => {
    return (
        <div className={style.Friends}>
            {props.friendsData ?
                props.friendsData.map((friend, key) => {
                    return (
                        <Friend key={key}
                                name={friend.name}
                                localId={friend.localId}
                                addDialog={props.addDialog}
                                deleteFriend={props.deleteFriend}
                        />
                    )
                }) : null
            }
        </div>
    )
}

export default Friends