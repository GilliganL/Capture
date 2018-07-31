const MOCK_USER_CONNECTIONS = {
    "userConnections" : [
        {
            "username": "Clinton.Bartell",
            "fullName":  "Clinton Bartell",
            "location": "Carolemouth, NC"
        },
        {
            "username": "Caleb.Murphy",
            "fullName": "Caleb Murphy",
            "location": "Gibsonmouth, MS"
        },
        {
            "username": "Kasandra.Schamberger",
            "fullName": "Kasandra Schamberger",
            "location": "Rohanton, IA"
        },
        {
            "username": "Eldon.Jerde",
            "fullName": "Eldon Jerde",
            "location": "Moenburgh, DE"
        },
        {
            "username": "Ottis.Reinger",
            "fullName": "Ottis Reinger",
            "location": "Jeffereyshire, MN"
        }
    ]
};

const MOCK_SEARCH_CONNECTIONS = {
    "userConnections" : [
        {
            "username": "Elizabeth.Bartell",
            "fullName":  "Elizabeth Bartell",
            "location": "Carolemouth, NC"
        },
        {
            "username": "Caleb.Murphy",
            "fullName": "Caleb Murphy",
            "location": "Gibsonmouth, MS"
        },
        {
            "username": "Liz.Smith",
            "fullName": "Liz Schamberger",
            "location": "Rohanton, IA"
        },
        {
            "username": "Eliza.Jordan",
            "fullName": "Eliza Jordan",
            "location": "Moenburgh, DE"
        },
        {
            "username": "Ottis.Reinger",
            "fullName": "Ottis Reinger",
            "location": "Jeffereyshire, MN"
        }
    ]
};

function listenForSearchButton() {
    $('#searchForm').on('submit', event => {
        event.preventDefault();
        //turn user input into RegExp that checks for special characters also?
        let searchTerm = new RegExp('Liz', 'i');
        const resultsArray =  MOCK_SEARCH_CONNECTIONS.userConnections.filter(item => item.fullName.match(searchTerm));

        getSearchResults(displaySearchResults, resultsArray);
        
    });
}

function getSearchResults(callback, data) {
    //best place for listSection empty? Add getAndDisplay function?
    $('.listSection').empty();
    setTimeout(function(){callback(data)}, 1);
}

function displaySearchResults(data) {
    for (index in data) {
        $('.listSection').append(
            `<div><p>${data[index].username}<br>
            ${data[index].fullName}<br>
            ${data[index].location}</p></div>`);
    }
}

function getUserConnections(callback, data) {
    //setTimeOut for asynchronous call
    setTimeout(function(){callback(data)}, 1);
}

function displayUserConnections(data) {
    for (index in data.userConnections) {
        $('.listSection').append(
            `<div><p>${data.userConnections[index].username}<br>
            ${data.userConnections[index].fullName}<br>
            ${data.userConnections[index].location}</p></div>`);
    }
}

function getAndDisplayUserConnections() {
    $('.listSection').empty();
    getUserConnections(displayUserConnections, MOCK_USER_CONNECTIONS);
}

$(function() {
    listenForSearchButton();
    getAndDisplayUserConnections();
});