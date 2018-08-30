
(() => {
    $('#uploadPhoto').on('change', event => {    
        const files = event.target.files;
        const file = files[0];
        //change file name on upload

        if(file == null) {
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
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                const response = JSON.parse(xhr.responseText);
                uploadFile(file, response.signedRequest, response.url);
            } else {
                alert('Could not get signed URL');
            }
        }
    };
    xhr.send();
}

function uploadFile(file, signedRequest, url){
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4) {
            if(xhr.status === 200) {
                $('#save-url').val(url);
            } else {
                alert('Could not upload file');
            }
        }
    };
    xhr.send(file);
}

