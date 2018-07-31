
//function to get values from form and redirect to feed

function listenForLoginButton() {
    $('#loginForm').on('submit', event => {
        event.preventDefault();
        let username = $('#usernameLogin').val();
        let password = $('#passwordLogin').val();
        console.log(username, password);
        window.location = '/feed';
    });
}

function listenForSignUpButton() {
    $('#signUpForm').on('submit', event => {
        event.preventDefault();
        let firstName = $('#firstName').val();
        let lastName = $('#lastName').val();
        console.log(firstName, lastName);
        window.location = '/connections';
    })
}

$(function() {
    listenForLoginButton();
    listenForSignUpButton();
})
