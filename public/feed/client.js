function listenForNewPost() {
    $('#new-post').on('click', event => {
        event.preventDefault();
        $('.new-post-form').toggleClass('hidden');

        if ($('.new-post-form').hasClass('hidden')) {
            $('#new-post').html('<h3>New Post</h3>');
        } else {
            $('#new-post').html('<h3>Close</h3>');
        }
    });
}


function listenForSubmitPost() {
    $('#post-form').on('submit', event => {
        event.preventDefault();

        let image = $('#save-url').val();
        let caption = $('#caption').val();

        $('#upload-label').text('Ready');
        $('#upload-label').css('color', '#372D3B');
        $('#uploadPhoto').val('');
        $('#caption').val('');

        $.ajax({
            url: '/api/feed/',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + localStorage.authToken
            },
            data: JSON.stringify({
                image, caption
            }),
            type: 'POST',
            success: () => getAndDisplayFeedPosts(),
            error: (res) => {
                alert(res.responseJSON.error);
            }
        });
    });
}

function getFeedPosts(callback) {
    $.ajax({
        url: '/api/feed/',
        headers: {
            'content-type': 'application/json',
            'authorization': 'bearer ' + localStorage.authToken
        },
        type: 'GET',
        success: (data) => callback(data),
        error: (res) => {
            alert(res.responseJSON.error);
        }
    });
}

function getAndDisplayFeedPosts() {
    $('.feed-section').empty();
    getFeedPosts(displayFeedPosts);
}

function displayFeedPosts(data) {
    for (index in data) {
        if (index == 0) {
            $('.feed-section').append(
                `<div class=' flex-item'>
                    <div class='flex-item-hidden'></div>
                    <div class='flex-item-date' id='flex-item-date-0'>
                    <div class='line-right'></div></div>
                    <div class='flex-item-content'>
                        <a class='getById' href=# data-id="${data[index].userId}"><h4 class='poster'> ${data[index].user}</h4></a>
                        <img class='postImage' src="${data[index].image}">
                        <div class='postCaption'><p>${data[index].caption}</p></div>
                    </div>
                </div>`);
        } else if (index % 2 == 0) {
            $('.feed-section').append(
                `<div class=' flex-item move-up'>
                    <div class='flex-item-hidden'></div>
                    <div class='flex-item-date'>
                    <div class='line-right'></div></div>
                    <div class='flex-item-content'>
                        <a class='getById' href=# data-id="${data[index].userId}"><h4 class='poster'> ${data[index].user}</h4></a>
                        <img class='postImage' src="${data[index].image}">
                        <div class='postCaption'><p>${data[index].caption}</p></div>
                    </div>
                </div>`);
        } else {
            $('.feed-section').append(
                `<div class=' flex-item move-up flex-item-flipped content-left'>
                    <div class='flex-item-hidden'></div>
                    <div class='flex-item-date'>
                    <div class='line-left'></div></div>
                    <div class='flex-item-content'>
                        <a class='getById' href=# data-id="${data[index].userId}"><h4 class='poster'> ${data[index].user}</h4></a>
                        <img class='postImage' src="${data[index].image}">
                        <div class='postCaption'><p>${data[index].caption}</p></div>
                    </div>
                </div>`);
        }
    }
}

$(function () {
    getAndDisplayFeedPosts();
    listenForNewPost();
    listenForSubmitPost();
})