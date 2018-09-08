
//handle get user posts on click on profile pick


function listenForSubmitForm() {
    $('.profile-form').on('submit', event => {
        event.preventDefault();
        $('#submit-error-row').addClass('hidden');
        let image = $('#save-url').val();
        let firstName = $('#firstName').val().trim();
        let lastName = $('#lastName').val().trim();
        let city = $('#city').val().trim();
        let state = $('#state').val().trim();
        let email = $('#email').val().trim();

        $('#upload-span').text('Upload a Photo');
        $('#upload-label').css('color', '#372D3B');

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
                $('#submit-error').html(res.responseJSON.error);
                $('#submit-error-row').removeClass('hidden');
            }
        });
    });
}

function listenForEditProfile() {
    $('.profile-container').on('click', 'button', function (event) {
        event.preventDefault();
        $('.edit-profile-section').toggleClass('hidden');

        if ($('.edit-profile-section').hasClass('hidden')) {
            $('.edit-profile-section').prop('hidden', true);
            $(this).html('Edit Profile');
        } else {
            $('.edit-profile-section').prop('hidden', false);
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
        error: () => {
            window.location = '/';
        }
    });
}

function displayProfile(data) {
    if ($('.edit-profile-section').hasClass('hidden')) {
        $('.profile-container').append(
            `<div class='profile-image'>
            <img class='profile-pic' src='${data.image}' alt='profile picture of ${data.fullName}'>
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
                <img class='profile-pic' src='${data.image}' alt='profile picture of ${data.fullName}'>
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
        error: () => {
            window.location = '/';
        }
    });
}

function displayPeople(data) {
    for (index in data) {
        $('.list-container').append(
            `<li class='user-row'>
                    <div class='user-left'>
                        <img src='${data[index].image}' alt='${data[index].fullName}'s profile picture' class='profile-pic'>
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