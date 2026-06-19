const DB_NAME = "MessengerDB";
const DB_VERSION = 1;

let db;

function openDatabase() {

    return new Promise((resolve, reject) => {

        const request =
            indexedDB.open(
                DB_NAME,
                DB_VERSION
            );

        request.onupgradeneeded =
            event => {

            db = event.target.result;

            if (
                !db.objectStoreNames.contains(
                    "messages"
                )
            ) {

                db.createObjectStore(
                    "messages",
                    {
                        keyPath: "id"
                    }
                );

            }

        };

        request.onsuccess =
            event => {

            db = event.target.result;

            resolve();

        };

        request.onerror =
            reject;

    });

}

function saveMessage(message) {

    const tx =
        db.transaction(
            ["messages"],
            "readwrite"
        );

    tx.objectStore(
        "messages"
    ).put(message);

}

function loadMessages() {

    return new Promise(resolve => {

        const tx =
            db.transaction(
                ["messages"],
                "readonly"
            );

        const req =
            tx.objectStore(
                "messages"
            ).getAll();

        req.onsuccess =
            () => {

            resolve(
                req.result
            );

        };

    });

}