
const inputFile = document.getElementById('inputFile');
const btnUpload = document.getElementById('btnUpload');

function uploadEmbeddingSpace(){
    const formData = new FormData();
    const file = inputFile.files[0];
    console.log(file.name);
    document.getElementById("inputLabel").innerHTML = file.name;
    formData.append("uploadFile", file);
    for (const [key, value] of formData){
        console.log(`Key: ${key}`);
        console.log(`Value: ${value}`);
    }
    document.getElementById("uploadState").removeAttribute('hidden');
    document.getElementById("uploadState").innerHTML = `<div class="d-flex justify-content-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>`;
    try{
        fetch("http://127.0.0.1:5000/REST/own-embedding-space", {
            method: "post",
            body: formData
        }).then((res) => res.json())
        .then((data) => {
            console.log(data);
            document.getElementById("uploadState").removeAttribute('hidden');
            document.getElementById("uploadState").innerHTML = data['message'];
        })
        //document.getElementById("inputFileView").removeAttribute('hidden');
        document.getElementById("inputFileInput").setAttribute("placeholder", file.name);
    }
    catch(error){
        console.log(error);
    }

    
    
}

btnUpload.addEventListener("click", function() { uploadEmbeddingSpace() });