
//function to get values from form and redirect to feed

function listenForLogin() {
    $('#loginForm').on('submit', event => {
        event.preventDefault();
        let username = $('#usernameLogin').val();
        let password = $('#passwordLogin').val();

        login(username, password);
   
    });
}
function login(username, password) {

        $.ajax({
            url: '/api/auth/login',
            headers: {
                'content-type': 'application/json',
            },
            data: JSON.stringify({
                username, password
            }),
            method: 'post'
        })
        .done((token) => {
            localStorage.authToken = token.authToken
            window.location = '/feed';
        });
}

function listenForSignUpButton() {
    $('#signUpForm').on('submit', event => {
        event.preventDefault();

        let firstName = $('#firstName').val();
        let lastName = $('#lastName').val();
        let username = $('#username').val();
        let password = $('#password').val();
        let city = $('#city').val();
        let state = $('#state').val();
        let email = $('#email').val();

        $.ajax({
            url: '/api/users',
            headers: {
                'content-type': 'application/json',
            },
            data: JSON.stringify({
                firstName, lastName, username, password, city, state, email
            }),
            method: 'post'
        })
        .done((user) => login(username, password))
        // window.location = '/people';
    })
}

$(function() {
    listenForLogin();
    listenForSignUpButton();
})
