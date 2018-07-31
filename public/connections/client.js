const MOCK_USER_CONNECTIONS = {
    "userConnections" : [
        {
            "id": "00001",
            "username": "Clinton.Bartell",
            "fullName":  "Clinton Bartell",
            "location": "Carolemouth, NC"
        },
        {
            "id": "00002",
            "username": "Caleb.Murphy",
            "fullName": "Caleb Murphy",
            "location": "Gibsonmouth, MS"
        },
        {
            "id": "00003",
            "username": "Kasandra.Schamberger",
            "fullName": "Kasandra Schamberger",
            "location": "Rohanton, IA"
        },
        {
            "id": "00004",
            "username": "Eldon.Jerde",
            "fullName": "Eldon Jerde",
            "location": "Moenburgh, DE"
        },
        {
            "id": "00005",
            "username": "Ottis.Reinger",
            "fullName": "Ottis Reinger",
            "location": "Jeffereyshire, MN"
        }
    ]
};

function getUserConnections(callback) {
    //setTimeOut for asynchronous call
    setTimeout(function(){callback(MOCK_USER_CONNECTIONS)}, 1);
}

function displayUserConnections(data) {
    for (index in data.userConnections) {
        $('body').append(
            `<div><p>${data.userConnections[index].username}<br>
            ${data.userConnections[index].fullName}<br>
            ${data.userConnections[index].location}</p></div>`);
    }
}

function getAndDisplayUserConnections() {
    getUserConnections(displayUserConnections);
}

$(function() {
    getAndDisplayUserConnections();
})