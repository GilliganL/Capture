
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
    $('.profile-container').on('click', 'button', function(event) {
        event.preventDefault();
        $('.edit-profile').removeClass('hidden');    
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
    $('.profile-container').append(
        `<div class='profile-image'>
            <img class='profile-pic' src='${data.image}'>
        </div>
        <div class='profile-data'>
            <p>First Name: ${data.firstName}<br>
            Last Name: ${data.lastName}<br>
            City: ${data.city}<br>
            State: ${data.state}<br>
            Email: ${data.email}<br>
            </p>
            <button id='profile-button' data-id='${data._id}'>Edit Profile</button>
        </div>`
    );
}

function getAndDisplayProfile() {
    $('.profile-container').empty();
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
        $('.list-container').append(
            `<li class='list-item'>
                <div class='item-left'>
                    <a class='get-user-posts' href=# data-id="${data[index].id}"><img src='${data[index].image}' alt='${data[index].fullName}'s picture' class='profile-pic'></a>
                </div>
                <div class='item-right'>
                    Username: ${data[index].username}<br>Name: ${data[index].fullName}<br>Location: ${data[index].location}
                </div>
            </li>`);
    }
}

function getAndDisplayPeople() {
    $('.list-container').empty();
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