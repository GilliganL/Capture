const MOCK_USER_FEED = {
    "feedPosts" : [
        {
            "id": "00001",
            "username": "Clinton.Bartell",
            "date": "Sun Jul 29 2018 05:42:29 GMT-0600 (Mountain Daylight Time)",
            "image": "http://lorempixel.com/640/480/nightlife",
            "caption": "Perspiciatis sequi esse harum." 
        },
        {
            "id": "00002",
            "username": "Caleb.Murphy",
            "date": "Sun Jul 29 2018 12:49:48 GMT-0600 (Mountain Daylight Time)",
            "image": "http://lorempixel.com/640/480/people",
            "caption": "Quo velit quasi corporis. Ducimus unde et laudantium quo consequuntur. Velit eveniet sed dolor cum. Aut id facere consequuntur." 
        },
        {
            "id": "00003",
            "username": "Kasandra.Schamberger",
            "date": "Sun Jul 29 2018 02:15:32 GMT-0600 (Mountain Daylight Time)",
            "image": "http://lorempixel.com/640/480/nature",
            "caption": "Error qui praesentium dolor ut beatae ipsam tempore perferendis. Quis odio sunt." 
        },
        {
            "id": "00004",
            "username": "Eldon.Jerde",
            "date": "Sat Jul 29 2018 22:47:59 GMT-0600 (Mountain Daylight Time)",
            "image": "http://lorempixel.com/640/480/city",
            "caption": "Consectetur quam suscipit consectetur provident ea facilis enim ut. Et pariatur cupiditate molestiae dolor numquam laboriosam ea tempore quo. Cupiditate et sapiente. Sapiente quam enim perspiciatis provident suscipit deserunt ea. Fugiat nam aliquam accusamus quibusdam nihil voluptate qui. Modi est ullam minima nulla autem." 
        },
        {
            "id": "00005",
            "username": "OttisReinger",
            "date": "Sun Jul 29 2018 11:48:29 GMT-0600 (Mountain Daylight Time)",
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
        let date = new Date(); 
        let caption = $('#caption').val();

        MOCK_USER_FEED.feedPosts.push({username, date, image, caption});

        getAndDisplayFeedPosts();
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