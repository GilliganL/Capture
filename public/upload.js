
(() => {
    $('.uploadPhoto').on('change', event => {
        const files = event.target.files;
        const file = files[0];

        const fileType = file.type;
        const validFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if(validFileTypes.find(i => i == fileType) == undefined) {
            return alert('Please choose a JPEG, PNG or GIF file')
        }

        if (file == null) {
            return alert('No file selected');
        }
        getSignedRequest(file);
    });
})();

function getSignedRequest(file) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/feed/sign-s3?file-name=${encodeURIComponent(file.name)}&file-type=${encodeURIComponent(file.type)}`);
    xhr.setRequestHeader('authorization', 'bearer ' + localStorage.authToken);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                uploadFile(file, response.signedRequest, response.url);
            } else {
                alert('Could not get signed URL');
            }
        }
    };
    xhr.send();
}

function uploadFile(file, signedRequest, url) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                $('#save-url').val(url);
                $('#upload-label').text('Ready');
                $('#upload-label').css('color', '#FFFFDE');
            } else {
                alert('Could not upload file');
            }
        }
    };
    xhr.send(file);
}

