
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
        let userId = '5b7e0986786ee64b34216382';

        $('#uploadPhoto').val('');
        $('#caption').val('');

        $.ajax({
            url: '/api/feed/',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + localStorage.authToken
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
            'authorization': 'bearer ' + localStorage.authToken
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

    for (index in data) {
        if (index == 0) {
            $('.feed-section').append(
                `<div class='postDiv flex-item'>
                    <div class='flex-item-hidden'></div>
                    <div class='flex-item-date' id='flex-item-date-0'></div>
                    <div class='flex-item-content'>
                    <a class='getById' href=# data-id="${data[index].userId}"><h3 class='poster'> ${data[index].user}</h3></a>
                    <div class='card-right'>
                        <a class='show-caption' href='#'>X</a>
                        <img class='postImage' src="${data[index].image}">
                        <div class='postCaption'><p>${data[index].caption}</p></div>
                        </div>
                    </div>
                </div>`);
        } else if (index % 2 == 0) {
            $('.feed-section').append(
                `<div class='postDiv flex-item move-up'>
                    <div class='flex-item-hidden'></div>
                    <div class='flex-item-date'></div>
                    <div class='flex-item-content'>
                    <a class='getById' href=# data-id="${data[index].userId}"><h3 class='poster'> ${data[index].user}</h3></a>
                    <div class='card-right'>
                        <a class='show-caption' href='#'>X</a>
                        <img class='postImage' src="${data[index].image}">
                        <div class='postCaption'><p>${data[index].caption}</p></div>
                        </div>
                    </div>
                </div>`);
        } else {
            $('.feed-section').append(
                `<div class='postDiv flex-item flex-item-flipped move-up'>
                    <div class='flex-item-hidden'></div>
                    <div class='flex-item-date'></div>
                    <div class='flex-item-content'>
                    <a class='getById' href=# data-id="${data[index].userId}"><h3 class='poster'> ${data[index].user}</h3></a>
                        <div class='card-left'>
                        <a class='show-caption' href='#'>X</a>
                        <img class='postImage' src="${data[index].image}">
                        <div class='postCaption'><p>${data[index].caption}</p></div>
                        </div>
                    </div>
                </div>`);

        }
    }

    //add if statement for screen size
    $('.feed-section').find('.postCaption').each(function () {
        let img;
        img = $(this).siblings('img');
        $(this).css('width', img.width());
        $(this).css('height', img.height());
        $(this).css('margin-top', -(img.height() + 10));
    })
}


function displayCaption() {
    $('.feed-section').on('click', '.show-caption', function (event) {
        event.preventDefault();
        let img = $(this).siblings('.postImage');
        let caption = $(this).siblings('.postCaption');

        if (!($(this).hasClass('showing'))) {
            $(this).addClass('showing');
            img.css('z-index', 5);
            img.css('opacity', 0);
            caption.css('z-index', 10);
            caption.css('opacity', 1);
        } else {

            $(this).removeClass('showing');
            img.css('z-index', 10);
            img.css('opacity', 1);
            caption.css('z-index', 5);
            caption.css('opacity', 0);
        }
    });
}

// function displayFeedPostsById(data) {
//     //return array of same data listed above
//     //put in lightbox to display
//     console.log(data);

// }

// function getFeedPostsById(id, callback) {
//     $.ajax({
//         url: `/api/feed/${id}`,
//         headers: {
//             'content-type': 'application/json',
//             'authorization': 'bearer ' + localStorage.authToken
//         },
//         type: 'GET'
//     })
//     .done((data) => callback(data));
// }

// function listenForGetById() {
//     $('.feed-section').on('click', 'a', function(event) {
//         event.preventDefault();
//         const userId = $(this).data('id');

//         getFeedPostsById(userId, displayFeedPostsById);
//     })
// }

function getAndDisplayFeedPosts() {
    $('.feed-section').empty();
    getFeedPosts(displayFeedPosts);
}

$(function () {
    listenForNewPost();
    listenForSubmitPost();
    getAndDisplayFeedPosts();
    //listenForGetById();
    displayCaption();
})