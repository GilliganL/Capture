
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
  
    for (index in data) {
        if(index % 2 == 0){
        $('.feedSection').append(
            `<div class='postDiv flex-item'>
                <div class='flex-item-hidden'></div>
                <div class='flex-item-date'></div>
                <div class='flex-item-content'>
                <h3 class='poster'> ${data[index].user}</h3>
                <p class='postCaption'>${data[index].caption}</p>
                <img class='postImage' src="${data[index].image}">
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
                    <img class='postImage' src="${data[index].image}">
                    </div>
                </div>`);

        }
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