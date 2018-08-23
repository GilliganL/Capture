
//handle get user posts link

//Submit edit profile form
function listenForSubmitForm() {
    $('.edit-profile-form').on('submit', event => {
        event.preventDefault();
    //use user ID of logged in person for PUT
    const id = '5b7e0857786ee64b3421637b';
    let image = $('#save-url').val();
    let firstName = $('#firstName').val();
    let lastName = $('#lastName').val();
    let city = $('#city').val();
    let state = $('#state').val();
    let email = $('#email').val();
    
    $.ajax({
        url: `/api/users/${id}`,
        headers: {
            'content-type': 'application/json',
            'authorization': 'bearer ' + localStorage.authToken
        },
        data: JSON.stringify({
            id, image, firstName, lastName, city, state, email
        }),
        method: 'put'
    })
    .done(() => getAndDisplayProfile());
    })
}


//show edit profile form
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
            'authorization': 'bearer ' + localStorage.authToken
        },
        type: 'GET'
    })
    .done((data) => callback(data));
}

function displayProfile(data) {
    $('.profile').append(
        `<img class='profile-image' src='${data.image}'>
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
    console.log(localStorage);
    const userId = '5b7e0857786ee64b3421637b';
    getProfile(userId, displayProfile);
}

function getPeople(callback) {
    $.ajax({
        url: '/api/users',
        headers: {
            'content-type': 'application/json',
            'authorization': 'bearer ' + localStorage.authToken
        },
        type: 'GET'
    })
    .done((data) => callback(data));
}

function displayPeople(data) {
    for (index in data) {
        $('.user-list').append(
            `<li class='user-item'>
                <div class='user-left'>
                    <a class='get-user-posts' href=# data-id="${data[index].id}"><img src='${data[index].image}' alt='${data[index].fullName}'s picture' class='profile-image'></a>
                </div>
                <div class='user-right'>
                    username: ${data[index].username}<br>
                    Name: ${data[index].fullName}<br>
                    Location: ${data[index].location}
                </div>
            </li>`);
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