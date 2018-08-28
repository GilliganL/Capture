
//handle get user posts on click on profile pick


function listenForSubmitForm() {
    $('.profile-form').on('submit', event => {
        event.preventDefault();

        let image = $('#save-url').val();
        let firstName = $('#firstName').val().trim();
        let lastName = $('#lastName').val().trim();
        let city = $('#city').val().trim();
        let state = $('#state').val().trim();
        let email = $('#email').val().trim();

        $.ajax({
            url: `/api/users/myuser`,
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + localStorage.authToken
            },
            data: JSON.stringify({
                image, firstName, lastName, city, state, email
            }),
            type: 'PUT',
            success: () => getAndDisplayProfile(),
            error: (res) => {
                console.log(res);
            }
        });
    });
}

function listenForEditProfile() {
    $('.profile-container').on('click', 'button', function (event) {
        event.preventDefault();
        $('.edit-profile-section').toggleClass('hidden');

        if ($('.edit-profile-section').hasClass('hidden')) {
            $(this).html('Edit Profile');
        } else {
            $(this).html('Close');
        }
    });
}

function getProfile(callback) {
    $.ajax({
        url: `/api/users/myuser`,
        headers: {
            'content-type': 'application/json',
            'authorization': 'bearer ' + localStorage.authToken
        },
        type: 'GET',
        success: (data) => callback(data),
        error: (res) => {
            alert(res.responseText);
        }
    });
}

function displayProfile(data) {
    if ($('.edit-profile-section').hasClass('hidden')) {
        $('.profile-container').append(
            `<div class='profile-image'>
            <img class='profile-pic' src='${data.image}'>
        </div>
        <div class='profile-data'>
            <p class='username-p'><b>${data.username}</b></p>
            <p><span class='field-label'>Name:</span> ${data.fullName}</p>
            <p><span class='field-label'>City: </span> ${data.location}</p>
            <button id='profile-button' data-id='${data._id}'>Edit Profile</button>
        </div>`
        );
    } else {
        $('.profile-container').append(
            `<div class='profile-image'>
                <img class='profile-pic' src='${data.image}'>
            </div>
            <div class='profile-data'>
                <p class='username-p'><b>${data.username}</b></p>
                <p><span class='field-label'>Name:</span> ${data.fullName}</p>
                <p><span class='field-label'>City: </span> ${data.location}</p>
                <button id='profile-button' data-id='${data._id}'>Close</button>
            </div>`
        )
    };
}

function getAndDisplayProfile() {
    $('.profile-container').empty();
    getProfile(displayProfile);
}

function getPeople(callback) {
    $.ajax({
        url: '/api/users',
        headers: {
            'content-type': 'application/json',
            'authorization': 'bearer ' + localStorage.authToken
        },
        type: 'GET',
        success: (data) => callback(data),
        error: (res) => {
            alert(res.responseText);
        }
    });
}

function displayPeople(data) {
    for (index in data) {
            $('.list-container').append(
                `<li class='user-row'>
                    <div class='user-left'>
                        <a class='get-user-posts' href=# data-id="${data[index].id}"><img src='${data[index].image}' alt='${data[index].fullName}'s picture' class='profile-pic'></a>
                    </div>
                    <div class='user-right'>
                        <p class='username-p'><b>${data[index].username}</b></p>
                        <p><span class='field-label'>Name:    </span> ${data[index].fullName}</p>
                        <p><span class='field-label'>Location:</span> ${data[index].location}</p>
                    </div>
                </li>`);
    }
}

function getAndDisplayPeople() {
    $('.list-container').empty();
    getPeople(displayPeople);
}

$(function () {
    getAndDisplayPeople();
    getAndDisplayProfile();
    listenForEditProfile();
    listenForSubmitForm();
});