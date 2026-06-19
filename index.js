const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const wss = new WebSocket.Server({
    server
});

const onlineUsers = new Map();

/*
offlineMessages structure

{
    userId: [
        {
            id,
            from,
            to,
            text,
            timestamp
        }
    ]
}
*/

const offlineMessages = new Map();

function sendToUser(userId, data) {
    const client = onlineUsers.get(userId);

    if (
        client &&
        client.readyState === WebSocket.OPEN
    ) {
        client.send(JSON.stringify(data));
        return true;
    }

    return false;
}

wss.on("connection", ws => {

    let currentUser = null;

    ws.on("message", raw => {

        try {

            const data =
                JSON.parse(raw.toString());

            switch (data.type) {

                case "login":

                    currentUser = data.userId;

                    onlineUsers.set(
                        data.userId,
                        ws
                    );

                    const pending =
                        offlineMessages.get(
                            data.userId
                        ) || [];

                    pending.forEach(msg => {
                        ws.send(
                            JSON.stringify(msg)
                        );
                    });

                    break;

                case "dm":

                    const dmMessage = {
                        type: "dm",
                        id: data.id,
                        from: data.from,
                        to: data.to,
                        text: data.text,
                        timestamp:
                            data.timestamp
                    };

                    const delivered =
                        sendToUser(
                            data.to,
                            dmMessage
                        );

                    if (!delivered) {

                        if (
                            !offlineMessages.has(
                                data.to
                            )
                        ) {
                            offlineMessages.set(
                                data.to,
                                []
                            );
                        }

                        offlineMessages
                            .get(data.to)
                            .push(dmMessage);
                    }

                    break;

                case "ack":

                    const queue =
                        offlineMessages.get(
                            data.userId
                        );

                    if (!queue) return;

                    offlineMessages.set(
                        data.userId,
                        queue.filter(
                            msg =>
                                msg.id !==
                                data.messageId
                        )
                    );

                    break;
            }

        } catch (err) {

            console.error(err);

        }

    });

    ws.on("close", () => {

        if (currentUser) {

            onlineUsers.delete(
                currentUser
            );

        }

    });

});

app.get("/", (req, res) => {

    res.json({
        status: "online",
        users: onlineUsers.size
    });

});

const PORT =
    process.env.PORT || 3000;

server.listen(PORT, () => {

    console.log(
        `Server running on ${PORT}`
    );

});