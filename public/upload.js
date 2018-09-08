
(() => {
    $('.uploadPhoto').on('change', event => {
        const files = event.target.files;
        const file = files[0];

        const fileType = file.type;
        const validFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if(validFileTypes.find(i => i == fileType) == undefined) {
            $('#submit-error').html('Please choose a JPEG, PNG or GIF file');
            $('#submit-error-row').removeClass('hidden');
            return
        }

        if (file == null) {
            $('#submit-error').html('No file selected');
            $('#submit-error-row').removeClass('hidden');
            return
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
                $('#submit-error').html('Something went wrong');
                $('#submit-error-row').removeClass('hidden');
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
                $('#upload-span').text('Ready');
                $('#upload-label').css('color', '#FFFFDE');
            } else {
                $('#submit-error').html('Something went wrong');
                $('#submit-error-row').removeClass('hidden');
            }
        }
    };
    xhr.send(file);
}

