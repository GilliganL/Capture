const MOCK_USER_FEED = {
    "feedPosts" : [
        {
            "username": "Clinton.Bartell",
            "image": "http://lorempixel.com/640/480/nightlife",
            "caption": "Perspiciatis sequi esse harum." 
        },
        {
            "username": "Caleb.Murphy",
            "image": "http://lorempixel.com/640/480/people",
            "caption": "Quo velit quasi corporis. Ducimus unde et laudantium quo consequuntur. Velit eveniet sed dolor cum. Aut id facere consequuntur." 
        },
        {
            "username": "Kasandra.Schamberger",
            "image": "http://lorempixel.com/640/480/nature",
            "caption": "Error qui praesentium dolor ut beatae ipsam tempore perferendis. Quis odio sunt." 
        },
        {
            "username": "Eldon.Jerde",
            "image": "http://lorempixel.com/640/480/city",
            "caption": "Consectetur quam suscipit consectetur provident ea facilis enim ut. Et pariatur cupiditate molestiae dolor numquam laboriosam ea tempore quo. Cupiditate et sapiente. Sapiente quam enim perspiciatis provident suscipit deserunt ea. Fugiat nam aliquam accusamus quibusdam nihil voluptate qui. Modi est ullam minima nulla autem." 
        },
        {
            "username": "Ottis.Reinger",
            "image": "http://lorempixel.com/640/480/food",
            "caption": "Consequatur autem quo odio et rerum sequi aut vero sequi." 
        }
    ]
};

function listenForSubmitPost() {
    $('#postForm').on('submit', event => {
        event.preventDefault();

        let image = $('#postPhoto').val();
        let caption = $('#caption').val();
        let userId = '5b70ccf1393d310b26657bb2'

        $('#postPhoto').val('');
        $('#caption').val('');
        //required fields

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
    });
}


function getFeedPosts(callback) {
    //setTimeOut for asynchronous call
    $.ajax({
        url: '/api/feed/',
        headers: {
            'content-type': 'application/json',
            // 'authorization': 'bearer' + localStorage.token
        },
        type: 'GET'
    })
    .done((data) => callback(data));
}

function displayFeedPosts(data) {
//returned data, create hidden section to store userId for future searches?
    // caption    :"some caption"
    // created:"2018-08-18T23:25:21.742Z"
    // id : "5b71b5871080d01629dc0e97"
    //userId: "xxxxx",
    // image : "some image file"
    // user : "Lynsey Powell"
  
    for (index in data) {
        $('.feedSection').append(
            `<div class='postDiv'>
                <h3 class='poster'> ${data[index].user}</h3>
                <p class='postCaption'>${data[index].caption}</p>
                <img class='postImage' src="${data[index].image}">
                <span
            </div>`);
        //create variable with userId to use later to pull all posts by user?
    }
}

function getAndDisplayFeedPosts() {
    $('.feedSection').empty();
    getFeedPosts(displayFeedPosts);
}

$(function() {
    listenForSubmitPost();
    getAndDisplayFeedPosts();
})