
//handle get user posts link

function listenForSubmitForm() {
    $('.edit-profile-form').on('submit', event => {
        event.preventDefault();
    //use user ID of logged in person for PUT
    const id = '5b70ccf1393d310b26657bb2';
    let image = $('#save-url').val();
    let firstName = $('#firstName').val();
    let lastName = $('#lastName').val();
    let city = $('#city').val();
    let state = $('#state').val();
    let email = $('#email').val();

    //check for empty fields on backend
    
    $.ajax({
        url: `/api/users/${id}`,
        headers: {
            'content-type': 'application/json',
            'authorization': 'bearer' + localStorage.token
        },
        data: JSON.stringify({
            id, image, firstName, lastName, city, state, email
        }),
        method: 'put'
    })
    .done(() => getAndDisplayProfile());
    })
}

function listenForEditProfile() {
    $('.profile').on('click', 'button', function(event) {
        event.preventDefault();
        $('.edit-profile-form').removeClass('hidden');    
    });
}

function getProfile(id, callback) {
    $.ajax({
        url: `/api/users/${id}`,
        headers: {
            'content-type': 'application/json',
            'authorization': 'bearer' + localStorage.token
        },
        type: 'GET'
    })
    .done((data) => callback(data));
}

function displayProfile(data) {
    $('.profile').append(
        `<img src='${data.image}'>
        <p>First Name: ${data.firstName}<br>
        Last Name: ${data.lastName}<br>
        City: ${data.city}<br>
        State: ${data.state}<br>
        Email: ${data.email}<br>
        <button data-id='${data._id}'>Edit Profile</button>
        </p>`
    );
}

function getAndDisplayProfile() {
    $('.profile').empty();
    //id of logged in user 
    const userId = '5b70ccf1393d310b26657bb2';
    getProfile(userId, displayProfile);
}

function getPeople(callback) {
    $.ajax({
        url: '/api/users',
        headers: {
            'content-type': 'application/json',
            'authorization': 'bearer' + localStorage.token
        },
        type: 'GET'
    })
    .done((data) => callback(data));
}

function displayPeople(data) {
    // fullName:"Lynsey Powell"
    // id:"5b70b6842e1f2b53280b2374"
    // location:"Denver, CO"
    // userName:"lynsey"

    for (index in data) {
        $('.user-list').append(
            `<li class='user-item'><a class='get-user-posts' href=# data-id="${data[index].id}"><img src='${data[index].image}'></a><br>
            Username: ${data[index].userName}<br>
            Name: ${data[index].fullName}<br>
            Location: ${data[index].location}</li>`);
         
    }
}

function getAndDisplayPeople() {
    $('.user-list').empty();
    getPeople(displayPeople);
}

$(function() {
    getAndDisplayPeople();
    getAndDisplayProfile();
    listenForEditProfile();
    listenForSubmitForm();
});


// function listenForSearchButton() {
//     $('#searchForm').on('submit', event => {
//         event.preventDefault();
//         //turn user input into RegExp that checks for special characters also?
//         let searchTerm = new RegExp('Liz', 'i');
//         const resultsArray =  MOCK_SEARCH_people.userpeople.filter(item => item.fullName.match(searchTerm));

//         getSearchResults(displaySearchResults, resultsArray);
        
//     });
// }

// function getSearchResults(callback, data) {
//     //best place for list-section empty? Add getAndDisplay function?
//     $('.list-section').empty();
//     setTimeout(function(){callback(data)}, 1);
// }

// function displaySearchResults(data) {
//     for (index in data) {
//         $('.list-section').append(
//             `<div><p>${data[index].username}<br>
//             ${data[index].fullName}<br>
//             ${data[index].location}</p></div>`);
//     }
// }