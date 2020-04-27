var uploadJumbo = document.getElementById('uploadJumbo');

var progress = document.getElementById("progressBar");
var progressContainer = document.getElementById("progressContainer");
var uploadButton = document.getElementById('uploadButton');
var inputVecs = document.getElementById('inputVecs');
var inputVecsLabel = document.getElementById('inputVecsLabel');
var inputVocab = document.getElementById('inputVocab');
var inputVocabLabel = document.getElementById('inputVocabLabel');

var switcher = document.getElementById('binarySwitch');
var uploadVocab = document.getElementById('uploadVocab');

var init = document.getElementById('initSuccess');

function upload(){  
    //console.log('here')
    progressContainer.removeAttribute('hidden');
    var binary = false;
    var url = 'http://127.0.0.1:5000/REST/uploads/embedding-spaces' ;

    if (!inputVecs.value) {
        console.log('ERROR NO FILE SELECTED');
        showDangerAlert(uploadJumbo, 'No vector file selected.');
    }
    if (switcher.checked == true){
        if (!inputVecs.value || !inputVocab.value){
            showDangerAlert(uploadJumbo, 'No vocab file and no vector file selected.');
        }
    }
    var data = new FormData();
    var request = new XMLHttpRequest();
    request.responseType = 'json';

    var vecFile = inputVecs.files[0];
    var vecFileName = vecFile.name;
    var vecFileSize = vecFile.size;
    
    if (switcher.checked == true) {
        var vocabFile = inputVocab.files[0];
        var vocabFileName = vocabFile.name;
        var vocabFileSize = vocabFile.size;
        data.append('vocab', vocabFile);
        data.append('vecs', vecFile);
        binary = true;
    }
    else{
        data.append('vectorFile', vecFile);
    }

    request.upload.addEventListener('progress', function(e){
        var loaded = e.loaded;
        var total = e.total;

        var percentageComplete = (loaded / total) *100;

        progress.setAttribute("style", `width: ${Math.floor(percentageComplete)}%`)
        progress.innerHTML = `${Math.floor(percentageComplete)}%`;

    });

    request.addEventListener("load", function(e) {
        if (request.status == 201) {
            console.log('SUCCESSFULL UPLOADED')
            console.log(`${request.response.message}`)
            if (binary){
                showSuccessAlert(uploadJumbo, 'Uploaded Files Successfully');
                
            }
            else{
                showSuccessAlert(uploadJumbo, 'Uploaded File Successfully');
            }
            initializeUpload();   
        }
        else {
            console.log('ERROR IN UPLOAD');
            showDangerAlert(uploadJumbo, 'Error in file upload. Please check selected files and retry the upload.')
            
        }
    });

    request.addEventListener("error", function(e) {
        console.log('ERROR CREATED')
        showDangerAlert(uploadJumbo, 'Error in file upload. Please check selected files and retry the upload.')
    });

    request.open("POST", url);
    request.send(data);
}

function initializeUpload(){
    uploadJumbo.innerHTML += `<div class="d-flex justify-content-center mt-2" id="initSpinner"><div class="spinner-border text-info" role="status"><span class="sr-only">Initializing uploaded files...</span></div></div>`; 
    var url = 'http://127.0.0.1:5000/REST/uploads/initialize?' ;
    var statusFlag = 200;
    var vecFile = inputVecs.files[0];
    var vecFileName = vecFile.name;
    if (switcher.checked == true) {
        var vocabFile = inputVocab.files[0];
        var vocabFileName = vocabFile.name;
        url += 'vocab=' + vocabFileName + '&vecs=' + vecFileName;
    }
    else{
        url += 'file=' + vecFileName;
    }

    fetch(url, { method: 'GET'})
        .then((res) => {
            if (!res.ok){
                statusFlag = res.status;
                let output = `<div class="alert alert-danger mt-4 mb-0" role="alert">Could not initialize File</div>`;
                document.getElementById('initSpinner').remove();
                uploadJumbo.innerHTML += output;
            }
                return res.json();
        })
        .then((data) => {
            let output = '';
            if (statusFlag != 200){
                output += `<div class="alert alert-danger mt-4 mb-0" role="alert"> ${data.message}</div>`;
            }
            else{
                output += `<div class="alert alert-success mt-4 mb-0" role="alert"> ${data.message}</div>`;
            }
            document.getElementById('initSpinner').remove();
            uploadJumbo.innerHTML += output;
            init.innerText = vecFileName; 
    });
}

function showDangerAlert(target, message){
    target.innerHTML += `<div class="alert alert-danger mt-4 mb-0" role="alert"> ${message}</div>`;
}

function showSuccessAlert(target, message){
    target.innerHTML += `<div class="alert alert-success mt-4 mb-0" role="alert"> ${message}</div>`
}

uploadButton.addEventListener('click', function() {upload()});

inputVecs.onchange = function () {
    inputVecsLabel.innerText = (inputVecs.files[0].name);
    if (switcher.checked == false){
        uploadButton.removeAttribute('disabled');
    }
    if (switcher.checked == true && inputVocabLabel.innerText != "Choose vocab file"){
        uploadButton.removeAttribute('disabled');
    }    
}

inputVocab.onchange = function () {
    inputVocabLabel.innerText = (inputVocab.files[0].name);
    if (inputVecsLabel.innerText != "Choose vector file"){
        uploadButton.removeAttribute('disabled');
    }
}

switcher.onchange = function () {
    if (switcher.checked == false){
        uploadVocab.setAttribute('hidden', true);
    }
    else if (switcher.checked == true){
        uploadVocab.removeAttribute('hidden');
    }
};