
const inputFile = document.getElementById('inputFile');
const btnUpload = document.getElementById('btnUpload');

function uploadEmbeddingSpace(){
    const formData = new FormData();
    console.log(inputFile.files);
    const file = inputFile.files[0];
    formData.append("uploadFile", file);
    for (const [key, value] of formData){
        console.log(`Key: ${key}`);
        console.log(`Value: ${value}`);
    }
    fetch("http://127.0.0.1:5000/REST/own-embedding-space", {
        method: "post",
        body: formData
    }).catch(console.error);
}

btnUpload.addEventListener("click", function() { uploadEmbeddingSpace() });