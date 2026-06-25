let socket;

function connectSocket(userId) {

    socket = new WebSocket(
        "wss://YOUR_RENDER_URL.onrender.com"
    );

    socket.onopen = () => {

        socket.send(
            JSON.stringify({
                type:"login",
                userId:userId
            })
        );

    };

    socket.onmessage =
        event => {

        const msg =
            JSON.parse(
                event.data
            );

        if(
            msg.type === "dm"
        ){

            saveMessage(msg);

            addMessageToUI(
                msg
            );

            socket.send(
                JSON.stringify({
                    type:"ack",
                    userId:
                        currentUser,
                    messageId:
                        msg.id
                })
            );

        }

    };

    socket.onclose =
        () => {

        setTimeout(
            ()=>{
                connectSocket(
                    userId
                );
            },
            3000
        );

    };

}

function sendDM(
    target,
    text
){

    const msg = {

        type:"dm",

        id:
            crypto.randomUUID(),

        from:
            currentUser,

        to:
            target,

        text:
            text,

        timestamp:
            Date.now()

    };

    saveMessage(msg);

    addMessageToUI(msg);

    socket.send(
        JSON.stringify(msg)
    );

}