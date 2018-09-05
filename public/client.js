
function listenForLogin() {
    $('#login-form').on('submit', event => {
        event.preventDefault();

        let username = $('#login-username').val().trim();
        let password = $('#login-password').val().trim();

        login(username, password);

    });
}

function login(username, password) {
    $.ajax({
        url: '/api/auth/login',
        headers: {
            'content-type': 'application/json'
        },
        data: JSON.stringify({
            username, password
        }),
        method: 'post',
        success: ((token) => {
            localStorage.authToken = token.authToken;
            localStorage.id = token.id;
            window.location = '/feed';
        }),
        error: () => {
            alert('Please enter a valid username and password');
        }
    });
}

function listenForLogoutButton() {
    $('#logout').on('click', 'button', function (event) {
        event.preventDefault();

        $.ajax({
            url: '/api/auth/logout',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + localStorage.authToken
            },
            type: 'GET',
            success: () => {
                delete localStorage.authToken;
                delete localStorage.id;
                window.location = '/';
            },
            error: (res) => {
                alert(res.responseText);
            }
        });
    });
}

function listenForSignUpButton() {
    $('#sign-up-form').on('submit', event => {
        event.preventDefault();

        let firstName = $('#firstName').val().trim();
        let lastName = $('#lastName').val().trim();
        let username = $('#username').val();
        let password = $('#password').val();
        let city = $('#city').val().trim();
        let state = $('#state').val().trim();
        let email = $('#email').val().trim();

        $.ajax({
            url: '/api/users',
            headers: {
                'content-type': 'application/json'
            },
            data: JSON.stringify({
                firstName, lastName, username, password, city, state, email
            }),
            type: 'POST',
            success: () => {
                login(username, password);
            },
            error: (res) => {
                alert(res.responseText);
            }
        });
    });
}

function listenForDemoButton() {
    $('.nav-bar').on('click', '#demo-button', function(event) {
        event.preventDefault();

        console.log('view demo ran')
        let username = 'lynsey';
        let password = 'password';

        login(username, password);
    });
}

$(function () {
    listenForLogin();
    listenForSignUpButton();
    listenForLogoutButton();
    listenForDemoButton();
})
