
function listenForNewPost() {
    $('#new-post').on('click', event => {
        event.preventDefault();
        $('.new-post-form').toggleClass('hidden');
    });
}


function listenForSubmitPost() {
    $('#post-form').on('submit', event => {
        event.preventDefault();

        let image = $('#save-url').val();
        let caption = $('#caption').val();
        let userId = '5b70ccf1393d310b26657bb2';

        $('#postPhoto').val('');
        $('#caption').val('');

        $.ajax({
            url: '/api/feed/',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + localStorage.token
            },
            data: JSON.stringify({
                image, userId, caption
            }),
            method: 'post'
        })
        .done(() => getAndDisplayFeedPosts());
        //prepend instead of new get?
    });
}

//add function to delete a post if it's your own

function getFeedPosts(callback) {
    $.ajax({
        url: '/api/feed/',
        headers: {
            'content-type': 'application/json',
            'authorization': 'bearer' + localStorage.token
        },
        type: 'GET'
    })
    .done((data) => callback(data));
}

function displayFeedPosts(data) {
//returned data, create hidden section or variable to store userId for future searches?
    // caption    :"some caption"
    // created:"2018-08-18T23:25:21.742Z"
    // id : "5b71b5871080d01629dc0e97"
    //userId: "xxxxx",
    // image : "some image file"
    // user : "Lynsey Powell"
    data.reverse();
  
    for (index in data) {
        if(index == 0) {
            $('.feedSection').append(
                `<div class='postDiv flex-item'>
                    <div class='flex-item-hidden'></div>
                    <div class='flex-item-date' id='flex-item-date-0'></div>
                    <div class='flex-item-content'>
                    <h3 class='poster'> ${data[index].user}</h3>
                    <p class='postCaption'>${data[index].caption}</p>
                    <a class='getById' href=# data-id="${data[index].userId}"><img class='postImage' src="${data[index].image}"></a>
                    </div>
                </div>`);
        } else if(index % 2 == 0) {
            $('.feedSection').append(
                `<div class='postDiv flex-item'>
                    <div class='flex-item-hidden'></div>
                    <div class='flex-item-date'></div>
                    <div class='flex-item-content'>
                    <h3 class='poster'> ${data[index].user}</h3>
                    <p class='postCaption'>${data[index].caption}</p>
                    <a class='getById' href=# data-id="${data[index].userId}"><img class='postImage' src="${data[index].image}"></a>
                    </div>
                </div>`);
        } else {
            $('.feedSection').append(
                `<div class='postDiv flex-item flex-item-flipped'>
                    <div class='flex-item-hidden'></div>
                    <div class='flex-item-date'></div>
                    <div class='flex-item-content'>
                    <h3 class='poster'> ${data[index].user}</h3>
                    <p class='postCaption'>${data[index].caption}</p>
                    <a class='getById' href=# data-id="${data[index].userId}"><img class='postImage' src="${data[index].image}"></a>
                    </div>
                </div>`);

        }
    }
}

function displayFeedPostsById(data) {
    //return array of same data listed above
    console.log(data);
}

function getFeedPostsById(id, callback) {
    $.ajax({
        url: `/api/feed/${id}`,
        headers: {
            'content-type': 'application/json',
            'authorization': 'bearer' + localStorage.token
        },
        type: 'GET'
    })
    .done((data) => callback(data));
}

function listenForGetById() {
    $('.feedSection').on('click', 'a', function(event) {
        event.preventDefault();
        const userId = $(this).data('id');

        getFeedPostsById(userId, displayFeedPostsById);
    })
}

function getAndDisplayFeedPosts() {
    $('.feedSection').empty();
    getFeedPosts(displayFeedPosts);
}

$(function() {
    listenForNewPost();
    listenForSubmitPost();
    getAndDisplayFeedPosts();
    listenForGetById();
})