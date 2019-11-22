function uploadEmbeddingSpace(){
    const form = document.querySelector('form');
    console.log(form);
    const url = 'http://127.0.0.1:5000/REST/own-embedding-space';
    var formData = new FormData();
    form.addEventListener('submit', e => {
        e.preventDefault()
        var file = document.querySelector('[type=file]').files;
        console.log(file);
        
        formData.append('file', file);
        console.log(formData);
    });

    try{
        fetch(url, {
            method: 'PUT',
            body: formData,
            mode: 'cors',
            headers: {
             'Content-Type': 'multipart/form-data',
             'Accept': '*/*',
             'Access-Control-Allow-Origin': '*',
            }
            }).then(response => {
            console.log(response)
            })
    }
    catch(error){
        console.log(error)
    }
}
document.getElementById("submit").addEventListener("click", function() { uploadEmbeddingSpace()});

function uploadWordsAsJson(){}

function uploadVectorsAsJson(){}