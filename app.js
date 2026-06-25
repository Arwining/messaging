let currentUser =
    localStorage.getItem(
        "userId"
    );

if(
    !currentUser
){

    currentUser =
        prompt(
            "Choose username"
        );

    localStorage.setItem(
        "userId",
        currentUser
    );

}

let currentDM =
    null;

const messagesDiv =
    document.getElementById(
        "messages"
    );

const usersDiv =
    document.getElementById(
        "users"
    );

const sendBtn =
    document.getElementById(
        "sendBtn"
    );

const messageInput =
    document.getElementById(
        "messageInput"
    );

const newDM =
    document.getElementById(
        "newDM"
    );

openDatabase()
.then(()=>{

    connectSocket(
        currentUser
    );

    loadMessages()
    .then(messages=>{

        messages.forEach(
            addMessageToUI
        );

    });

});

newDM.onclick =
    ()=>{

    const user =
        prompt(
            "Username?"
        );

    if(
        !user
    ) return;

    createUserButton(
        user
    );

};

function createUserButton(
    username
){

    const div =
        document.createElement(
            "div"
        );

    div.className =
        "user";

    div.textContent =
        username;

    div.onclick =
        ()=>{

        currentDM =
            username;

    };

    usersDiv.appendChild(
        div
    );

}

sendBtn.onclick =
    ()=>{

    if(
        !currentDM
    ){

        alert(
            "Select DM"
        );

        return;

    }

    const text =
        messageInput.value
            .trim();

    if(
        !text
    ) return;

    sendDM(
        currentDM,
        text
    );

    messageInput.value =
        "";

};

function addMessageToUI(
    msg
){

    const div =
        document.createElement(
            "div"
        );

    div.className =
        "message";

    div.innerHTML =
        "<b>" +
        msg.from +
        "</b>: " +
        msg.text;

    messagesDiv.appendChild(
        div
    );

    messagesDiv.scrollTop =
        messagesDiv.scrollHeight;

}