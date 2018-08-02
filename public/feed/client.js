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

        let image = "http://lorempixel.com/640/480/food";
        let username = "Eldon.Jerde";
        let caption = 'Ipsam odio deserunt aliquam ea ratione suscipit. Ut sequi ut itaque dicta ea. Accusantium adipisci error sit eum et earum.';

        //required fields

        $.ajax({
            url: '/api/feed/',
            headers: {
                'content-type': 'application/json',
                'authorization': 'bearer ' + localStorage.token
            },
            data: JSON.stringify({
                image, username, caption
            }),
            method: 'post'
        })
        .done(() => getAndDisplayFeedPosts());
    });
}


function getFeedPosts(callback) {
    //setTimeOut for asynchronous call
    setTimeout(function(){callback(MOCK_USER_FEED)}, 1);
}

function displayFeedPosts(data) {
    for (index in data.feedPosts) {
        $('.feedSection').append(
            `<div><p>${data.feedPosts[index].caption}<br>
            ${data.feedPosts[index].username}</p>
            <img src="${data.feedPosts[index].image}">
            </div>`);
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