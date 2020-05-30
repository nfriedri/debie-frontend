//Containers
var mainContainer = document.getElementById('mainContainer')
var selectionJumbo = document.getElementById('selectionJumbo');
var uploadJumbo = document.getElementById('uploadJumbo');
var dEvaluateContainer = document.getElementById('dEvaluateContainer');
var thankYou = document.getElementById('thankYouContainer');

//Buttons
var startButton = document.getElementById('startButton');
var confirmButton = document.getElementById('selectSpaceButton');
var uploadButton = document.getElementById('uploadButton');
var predefinedButton = document.getElementById('preDefinedButton');
var selfdefinedButton = document.getElementById('selfDefinedButton');
var evaluationButton = document.getElementById('evaluationButton');
var sEvaluationButton = document.getElementById('sEvaluationButton');
var continueDebiasing = document.getElementById('continueDebiasing');
var sContinueDebiasing = document.getElementById('sContinueDebiasing');
var dEvaluationButton = document.getElementById('dEvaluationButton');
var debiasingButton = document.getElementById('debiasingButton');

//Cards
var evalCard = document.getElementById('evaluationCard');
var evalCardBody = document.getElementById('evaluationCardBody');
var sEvalCard = document.getElementById('sEvaluationCard');
var sEvalCardBody = document.getElementById('sEvaluationCardBody');
var debiasingCard = document.getElementById('debiasingCard');
var debiasingCardBody = document.getElementById('debiasingCardBody');
var evalCard2 = document.getElementById('evalCard2');
var evalCardBody2 = document.getElementById('evalCardBody2');

//Switches
var augmentSwitch = document.getElementById('augmentSwitch');
var lowerSwitch = document.getElementById('lowerSwitch');
var pcaSwitch = document.getElementById('pcaoffSwitch');
var binarySwitcher = document.getElementById('binarySwitch');

//File Upload
var progress = document.getElementById("progressBar");
var progressContainer = document.getElementById("progressContainer");
var inputVecs = document.getElementById('inputVecs');
var inputVecsLabel = document.getElementById('inputVecsLabel');
var inputVocab = document.getElementById('inputVocab');
var inputVocabLabel = document.getElementById('inputVocabLabel');
var uploadVocab = document.getElementById('uploadVocab');

//Global variables
const element = document.getElementById('tables');
const numberOfResources = 10;
const resourcePath = '/res/test_set';
const resourceType = '.json';
const tables = '';
var tableNameArray = [];
var tableIconArray = [];
var tableContentArray = [];
var tableButtonArray = [];
var evalResponse = null;
var debiasResponse = null;
var predefined = null;
var initSuccess = '';
var counter = 0;

//URL - Replace depending on usage
var mainURL = 'http://127.0.0.1:5000/REST/';
// var mainURL = 'http://wifo5-29.informatik.uni-mannheim.de/';

//Gloabal variables required for URL's
var model = '';
var pca = '';
var space = '';
var method = '';
var uploaded = '';
var json = '';
var lower = 'false';
var debiased = '';

//Format Numbers
const format = (num, decimals) => num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

// --- GENERAL FUNCTIONS ---

//Displays the main container of the application
function expandAppSelection(){
    if (mainContainer.getAttribute('hidden') == null){
        mainContainer.setAttribute('hidden', 'true');
    }
    else {
        mainContainer.removeAttribute('hidden');
    }
}

//Expands a container
function expandContainer(containerID){
    container = document.getElementById(containerID);
    if (container.getAttribute('hidden') == null){
        container.setAttribute('hidden', 'true');
    }
    else {
        container.removeAttribute('hidden');
        container.scrollIntoView({behavior: 'smooth'});
    }
}

//Hides a container
function hideContainer(containerID){
    document.getElementById(containerID).setAttribute('hidden', 'true');
}

//Starts a Spinner in the target element
function startSpinner(object) {
    object.innerHTML += `
    <div class="d-flex justify-content-center"><div class="spinner-border text-info" role="status"><span class="sr-only">Loading...</span></div></div>
    `;
}

//Creates an danger alert and displays it in the target element
function showDangerAlert(target, message) {
    target.innerHTML += `<div class="alert alert-danger mt-4 mb-0" role="alert"> ${message}</div>`;
}

//Creates an success alert and displays it in the target element
function showSuccessAlert(target, message) {
    target.innerHTML += `<div class="alert alert-success mt-4 mb-0" role="alert"> ${message}</div>`
}

//Returns currently selected embedding space and whether pre-defined specs or self-defined specs are used
async function getSelections() {
    space = document.getElementById('spaceToggleGroup').getElementsByClassName('active')[0].id;
    if (space == "upload") {
        if (init.innerText != 'false') {
            space = init.innerText;
            uploaded = "true";
        }
        else {
            showDangerAlert(selectionJumbo, "No File uploaded. Please select a file or choose one of the provided embedding space");
            selectionJumbo.innerHTML += '<div class="alert alert-danger mt-4 mb-0" role="alert" id="noUpload"></div>';
            alert = document.getElementById('noUpload')
            setTimeout(() => { alert.remove() }, 4000);
            return;
        }
    }
    if (predefined){
        if (lowerSwitch.checked == true) {
            lower = 'true';
        }
        else {
            lower = 'false';
        }
    }
    else{
        if (lowerSwitch2.checked == true) {
            lower = 'true';
        }
        else {
            lower = 'false';
        }
    }
}

//Returns selections required for creating evaluation API call
async function getSelectionEvaluation() {
    await getSelections();
    if (predefined){
        evalMethod = document.getElementById('evalMethods').getElementsByClassName('active')[0].id;
    }
    else{
        evalMethod = document.getElementById('sEvalMethods').getElementsByClassName('active')[0].id;
    }
    
    //TODO: ADD JSON QUESTION...
}

//Returns selections required for creating debiasing API call
async function getSelectionDebiasing() {
    await getSelections();
    model = document.getElementById('debiasModel').getElementsByClassName('active')[0].id;
    if (pcaSwitch.checked == true) {
        pca = 'false';
    }
    else {
        pca = 'true'
    }
}

//Returns content for evaluation API call
function getContent() {
    content = {};
    if (debiased == 'true') {
        //console.log('Debiased Content -- Sending JSON file');
        return debiasResponse;
    }
    if (document.getElementById('preDefinedContainer').getAttribute('hidden') == null) {
        predefined = true;
        content['Name'] = document.getElementById('valuesName').innerText;
        content['T1'] = document.getElementById('valuesT1').innerText;
        content['T2'] = document.getElementById('valuesT2').innerText;
        content['A1'] = document.getElementById('valuesA1').innerText;
        content['A2'] = document.getElementById('valuesA2').innerText;
    }
    else {
        predefined = false;
        content['T1'] = document.getElementById('target1').value;
        content['T2'] = document.getElementById('target2').value;
        content['A1'] = document.getElementById('attribute1').value;
        content['A2'] = document.getElementById('attribute2').value;
    }
    
    return content;
}

//Returns content for debiasing API call
function getContentDebiasing() {
    content = {};
    if (evalResponse != null) {
        content = evalResponse;
    }
    else {

        if (document.getElementById('preDefinedContainer').getAttribute('hidden') == null) {
            predefined = true;
            content['Name'] = document.getElementById('valuesName').innerText;
            content['T1'] = document.getElementById('valuesT1').innerText;
            content['T2'] = document.getElementById('valuesT2').innerText;
            content['A1'] = document.getElementById('valuesA1').innerText;
            content['A2'] = document.getElementById('valuesA2').innerText;
        }
        else {
            predefined = false;
            content['T1'] = document.getElementById('target1').value;
            content['T2'] = document.getElementById('target2').value;
            content['A1'] = document.getElementById('attribute1').value;
            content['A2'] = document.getElementById('attribute2').value;
            if (augmentSwitch.checked == true) {
                content['Augmentations1'] = document.getElementById('augmentations1').value;
                content['Augmentations2'] = document.getElementById('augmentations2').value;
            }
        }
    }
    return content;
}

//Create Download File
function download(filename, content){
    var element = document.createElement('a');
    element.style.display = 'none';
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(content)));
    element.setAttribute('download', filename + '.json');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    console.log('Downloaded')
}


// --- FILE UPLOAD ---

//API call for uploading a file
function upload() {
    progressContainer.removeAttribute('hidden');
    var binary = false;
    var url = mainURL + 'uploads/embedding-spaces';

    if (!inputVecs.value) {
        console.log('ERROR NO FILE SELECTED');
        showDangerAlert(uploadJumbo, 'No vector file selected.');
    }
    if (binarySwitcher.checked == true) {
        if (!inputVecs.value || !inputVocab.value) {
            showDangerAlert(uploadJumbo, 'No vocab file and no vector file selected.');
        }
    }
    var data = new FormData();
    var request = new XMLHttpRequest();
    request.responseType = 'json';

    var vecFile = inputVecs.files[0];
    var vecFileName = vecFile.name;
    var vecFileSize = vecFile.size;

    if (binarySwitcher.checked == true) {
        var vocabFile = inputVocab.files[0];
        var vocabFileName = vocabFile.name;
        var vocabFileSize = vocabFile.size;
        data.append('vocab', vocabFile);
        data.append('vecs', vecFile);
        binary = true;
    }
    else {
        data.append('vectorFile', vecFile);
    }

    request.upload.addEventListener('progress', function (e) {
        var loaded = e.loaded;
        var total = e.total;

        var percentageComplete = (loaded / total) * 100;

        progress.setAttribute("style", `width: ${Math.floor(percentageComplete)}%`)
        progress.innerHTML = `${Math.floor(percentageComplete)}%`;

    });

    request.addEventListener("load", function (e) {
        if (request.status == 201) {
            console.log('SUCCESSFULL UPLOADED')
            console.log(`${request.response.message}`)
            if (binary) {
                showSuccessAlert(uploadJumbo, 'Uploaded Files Successfully');

            }
            else {
                showSuccessAlert(uploadJumbo, 'Uploaded File Successfully');
            }
            initializeUpload();
        }
        else {
            console.log('ERROR IN UPLOAD');
            showDangerAlert(uploadJumbo, 'Error in file upload. Please check selected files and retry the upload.')

        }
    });

    request.addEventListener("error", function (e) {
        console.log('ERROR CREATED')
        showDangerAlert(uploadJumbo, 'Error in file upload. Please check selected files and retry the upload.')
    });

    request.open("POST", url);
    request.send(data);
}

//API call for initializing uploaded file
function initializeUpload() {
    uploadJumbo.innerHTML += `<div class="d-flex justify-content-center" id='initSpinner'><div class="spinner-border text-info" role="status"><span class="sr-only">Loading...</span></div></div>`;
    var url = mainURL + 'uploads/initialize?';
    var statusFlag = 200;
    var vecFile = inputVecs.files[0];
    var vecFileName = vecFile.name;
    if (binarySwitcher.checked == true) {
        var vocabFile = inputVocab.files[0];
        var vocabFileName = vocabFile.name;
        url += 'vocab=' + vocabFileName + '&vecs=' + vecFileName;
    }
    else {
        url += 'file=' + vecFileName;
    }

    fetch(url, { method: 'GET' })
        .then((res) => {
            if (!res.ok) {
                statusFlag = res.status;
                let output = `<div class="alert alert-danger mt-4 mb-0" role="alert">Could not initialize File</div>`;
                document.getElementById('initSpinner').remove();
                uploadJumbo.innerHTML += output;
            }
            return res.json();
        })
        .then((data) => {
            let output = '';
            if (statusFlag != 200) {
                output += `<div class="alert alert-danger mt-4 mb-0" role="alert"> ${data.message}</div>`;
            }
            else {
                output += `<div class="alert alert-success mt-4 mb-0" role="alert"> ${data.message}</div>`;
            }
            document.getElementById('initSpinner').remove();
            uploadJumbo.innerHTML += output;
        });
}

//API call for deleting uploaded file
async function deleteUpload(fileName){
    var url = mainURL + 'uploads/delete?';
    url += 'file=' + fileName ;

    fetch(url, { method: 'DELETE' })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
        });
}

//Handle API Call for deleting the uploaded file
function handleFileDelete(){
    var vecFileName = inputVecs.files[0].name;
    deleteUpload(vecFileName);
    if (binarySwitcher.checked == true) {
        var vocabFileName = inputVocab.files[0].name;
        deleteUpload(vocabFileName);
    }
}


// --- WEAT TEST SPECIFICATIONS FOR PREDEFINED TEST SETS ---

//Load WEAT Test Bias Specifications
async function loadTestData() {
    for (i = 1; i <= numberOfResources; i++) {
        var filePath = resourcePath + i + resourceType;
        var tableName = 'table' + i;
        var tableIcon = 'tableIcon' + i;
        var tableContent = 'tableContent' + i;
        var tableButton = 'tableButton' + i;
        var tableT1 = 'tableT1' + i;
        var tableT2 = 'tableT2' + i;
        var tableA1 = 'tableA1' + i;
        var tableA2 = 'tableA2' + i;
        await fetch(filePath)
            .then(response => response.json())
            .then((data) => {
                let output = "";
                output += `
            <div class="my-4">
                <table class="table table-borderless table-dark my-0">
                    <thead>
                        <tr>
                            <th scope="col" id="${tableIcon}"><a class="btn" role="button"> <i class="fas fa-angle-down"></i> </a></th>
                            <th scope="col" id="${tableName}">${data.Name}</th>
                        </tr>
                    </thead>
                    <tbody id="${tableContent}" hidden>
                        <tr>
                            <th scope="row">T1</th>
                            <td id="${tableT1}">${data.T1}</td>
                        </tr>
                        <tr>
                            <th scope="row">T2</th>
                            <td id="${tableT2}">${data.T2}</td>
                        </tr>
                        <tr>
                            <th scope="row">A1</th>
                            <td id="${tableA1}">${data.A1}</td> 
                        </tr>
                        <tr>
                            <th scope="row">A2</th>
                            <td id="${tableA2}">${data.A2}</td> 
                        </tr>
                    </tbody> 
                </table>
                <div class="container my-0" id="${tableButton}" style="background-color: #212429;" hidden>
                    <button type="button" class="btn btn-primary btn-lg my-2" style="background-color: #222E58; border-color: #FFFFFF;" id="selectSpec">Select</button> 
                </div>
            </div>
            `;
                element.innerHTML += output;

            })
    }
}

//Copy WEAT Test to extra container for evaluation
function selectSpecification(tableName, tableT1, tableT2, tableA1, tableA2) {
    selectionContainer = document.getElementById('selectionJumbo')
    selectionContainer.removeAttribute('hidden');
    var targetTable = document.getElementById('selectedSpec');
    name = document.getElementById(tableName).innerText;
    t1 = document.getElementById(tableT1).innerText;
    t2 = document.getElementById(tableT2).innerText;
    a1 = document.getElementById(tableA1).innerText;
    a2 = document.getElementById(tableA2).innerText;
    targetTable.innerHTML = `<table class="table table-borderless table-dark my-0">
                                <thead>
                                    <tr>
                                        <th scope="col"><a class="btn" role="button"> <i class="fas fa-angle-right"></i> </a></th>
                                        <th scope="col" id="valuesName">${name}</th>
                                    </tr>
                                </thead>
                                <tbody id="selectedValues">
                                    <tr>
                                        <th scope="row">T1</th>
                                        <td id="valuesT1">${t1}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">T2</th>
                                        <td id="valuesT2">${t2}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">A1</th>
                                        <td id="valuesA1">${a1}</td> 
                                    </tr>
                                    <tr>
                                        <th scope="row">A2</th>
                                        <td id="valuesA2">${a2}</td> 
                                    </tr>
                                </tbody> 
                            </table>`;
    evalCardBody.innerHTML = "";
    evalCard.setAttribute('hidden', 'true');
    continueDebiasing.setAttribute('hidden', 'true');
    selectionContainer.scrollIntoView({ behavior: 'smooth' });
    startButton.removeAttribute('disabled');
}

//Expand/Minimize Table content
function showTable(content, button, icon) {
    var element = document.getElementById(content);
    var btn = document.getElementById(button);
    var iconn = document.getElementById(icon);
    if (element.getAttribute('hidden') == null) {
        element.setAttribute('hidden', 'true');
        btn.setAttribute('hidden', 'true');
        iconn.innerHTML = `<a class="btn" role="button"> <i class="fas fa-angle-down"></i> </a>`;
        return 1;
    }
    else {
        element.removeAttribute('hidden');
        btn.removeAttribute('hidden');
        iconn.innerHTML = `<a class="btn" role="button"> <i class="fas fa-angle-right"></i> </a>`;
        return 0;
    }
}

//Add event Listener to one table element
async function addEvents(tableContent, tableButton, tableIcon, tableName, tableT1, tableT2, tableA1, tableA2) {
    document.getElementById(tableName).addEventListener("click", function () { showTable(tableContent, tableButton, tableIcon); console.log(tableContent); });
    document.getElementById(tableIcon).addEventListener("click", function () { showTable(tableContent, tableButton, tableIcon) });
    document.getElementById(tableButton).addEventListener("click", function () { selectSpecification(tableName, tableT1, tableT2, tableA1, tableA2) });
}

//Add event Listeneres to Weat table elements
async function setTableEventListeners() {
    for (i = 1; i <= numberOfResources; i++) {
        var tableName = 'table' + i;
        var tableIcon = 'tableIcon' + i;
        var tableContent = 'tableContent' + i;
        var tableButton = 'tableButton' + i;
        var tableT1 = 'tableT1' + i;
        var tableT2 = 'tableT2' + i;
        var tableA1 = 'tableA1' + i;
        var tableA2 = 'tableA2' + i;
        await addEvents(tableContent, tableButton, tableIcon, tableName, tableT1, tableT2, tableA1, tableA2);
    }
}


// --- BIAS EVALUATION ---

//Create URL for bias evaluation call
async function createEvaluationURL() {
    await getSelectionEvaluation();
    var url = mainURL + 'bias-evaluation';
    url += '/' + evalMethod;
    if (space != '') {
        url += '?space=' + space;
    }
    if (uploaded != '')
        url += '&uploaded=' + uploaded;
    if (lower != 'false') {
        url += '&lower=' + lower;
    }
    if (debiased == 'true') {
        json = 'true';
        url += '&json=true';
    }
    return url;
}

//API-Call for bias evaluation
async function biasEvaluation() {
    var url = await createEvaluationURL();
    var content = getContent();
    content = JSON.stringify(content);
    var result = null;
    try {
        await fetch(url, {
            method: 'POST',
            body: content,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            result = data;
        })
    } catch (error) {
        console.error(error);
    }
    return result;
}

//Format json file to html
async function formatEvaluationScores(data) {
    let output = '';
    if (data.BiasSpecification.Deleted == '') {
        data.BiasSpecification.Deleted = '-';
    }
    if (data.BiasSpecification.NotFound == '') {
        data.BiasSpecification.NotFound = '-';
    }
    switch (evalMethod) {
        case 'all':
            output += `
                    <h5 class="card-title mb-3">Evaluation results: </h5>
                    <table class="table table-borderless table-dark">
                        <tbody>
                        <tr>
                        <th scope="row">ECT Score: </th>
                        <td>${format(data.Scores.ECT_Score)}</td>
                        </tr>
                        <tr>
                        <th scope="row">ECT P-Value: </th>
                        <td>${format(data.Scores.ECT_P_Value)}</td>
                        </tr>
                        <tr>
                        <th scope="row">BAT Score: </th>
                        <td>${format(data.Scores.BAT_Score)}</td>
                        </tr>
                        <tr>
                        <th scope="row">WEAT effect-size: </th>
                        <td>${format(data.Scores.WEAT_Effect_Size)}</td>
                        </tr>
                        <tr>
                        <th scope="row">WEAT P-Value: </th>
                        <td>${format(data.Scores.WEAT_P_Value)}</td>
                        </tr>
                        <tr>
                        <th scope="row">K-Means++ result: </th>
                        <td>${format(data.Scores.K_Means)}</td>
                        </tr>
                        <tr>
                        <th scope="row">SVM-Classifier result: </th>
                        <td>${format(data.Scores.SVM)}</td>
                        </tr>
                        <tr>
                        <th scope="<th scope="row">Randomly deleted words: </th>
                        <td>${String(data.BiasSpecification.Deleted).replace(new RegExp(',', 'g'), " ")}</td>
                        </tr>
                        <tr>
                        <th scope="<th scope="row">Not found words: </th>
                        <td>${String(data.BiasSpecification.NotFound).replace(new RegExp(',', 'g'), " ")}</td>
                        </tr>
                        </tbody>
                    </table>       
                    `;
            break;
        case 'ect':
            output += `
                    <h5 class="card-title">ECT Results</h5>
                    <table class="table table-borderless table-dark">
                        <tbody>
                        <tr>
                        <th scope="row">ECT Score: </th>
                        <td>${format(data.Scores.ECT_Score)}</td>
                        </tr>
                        <tr>
                        <th scope="row">ECT P-Value: </th>
                        <td>${format(data.Scores.ECT_P_Value)}</td>
                        </tr>
                        <tr>
                        <th scope="<th scope="row">Randomly deleted words: </th>
                        <td>${data.BiasSpecification.Deleted}</td>
                        </tr>
                        <tr>
                        <th scope="<th scope="row">Not found words: </th>
                        <td>${data.BiasSpecification.NotFound}</td>
                        </tr>
                        </tbody>
                    </table>
                    `;
            break;
        case 'bat':
            output += `
                    <h5 class="card-title">BAT Results</h5>
                    <table class="table table-borderless table-dark">
                        <tbody>
                        <tr>
                        <th scope="row">BAT Score: </th>
                        <td>${format(data.Scores.BAT_Score)}</td>
                        </tr>
                        <tr>
                        <th scope="<th scope="row">Randomly deleted words: </th>
                        <td>${data.BiasSpecification.Deleted}</td>
                        </tr>
                        <tr>
                        <th scope="<th scope="row">Not found words: </th>
                        <td>${data.BiasSpecification.NotFound}</td>
                        </tr>
                        </tbody>
                    </table>  
                    `;
            break;
        case 'weat':
            output += `
                    <h5 class="card-title">WEAT Results</h5>
                    <table class="table table-borderless table-dark">
                        <tbody>
                        <tr>
                        <th scope="row">WEAT effect-size: </th>
                        <td>${format(data.Scores.WEAT_Effect_Size)}</td>
                        </tr>
                        <tr>
                        <th scope="row">WEAT P-Value: </th>
                        <td>${format(data.Scores.WEAT_P_Value)}</td>
                        </tr>
                        <tr>
                        <th scope="<th scope="row">Randomly deleted words: </th>
                        <td>${data.BiasSpecification.Deleted}</td>
                        </tr>
                        <tr>
                        <th scope="<th scope="row">Not found words: </th>
                        <td>${data.BiasSpecification.NotFound}</td>
                        </tr>
                        </tbody>
                    </table>  
                    `;
            break;
        case 'kmeans':
            output += `
                    <h5 class="card-title">KMeans++ Results</h5>
                    <table class="table table-borderless table-dark">
                        <tbody>
                        <tr>
                        <th scope="row">K-Means++ result: </th>
                        <td>${format(data.Scores.K_Means)}</td>
                        </tr>
                        <tr>
                        <th scope="<th scope="row">Randomly deleted words: </th>
                        <td>${data.BiasSpecification.Deleted}</td>
                        </tr>
                        <tr>
                        <th scope="<th scope="row">Not found words: </th>
                        <td>${data.BiasSpecification.NotFound}</td>
                        </tr>
                        </tbody>
                    </table> 
                    `;
            break;
        case 'svm':
            output += `
                    <h5 class="card-title">SVM-Classifier Results</h5>
                    <table class="table table-borderless table-dark">
                        <tbody>
                        <tr>
                        <th scope="row">SVM-Classifier result: </th>
                        <td>${format(data.Scores.SVM)}</td>
                        </tr>
                        <tr>
                        <th scope="<th scope="row">Randomly deleted words: </th>
                        <td>${data.BiasSpecification.Deleted}</td>
                        </tr>
                        <tr>
                        <th scope="<th scope="row">Not found words: </th>
                        <td>${data.BiasSpecification.NotFound}</td>
                        </tr>
                        </tbody>
                    </table> 
                    `;
            break;
        case 'simlex':
            output += `
                    <h5 class="card-title">SimLex-999 Results</h5>
                    <table class="table table-borderless table-dark">
                        <tbody>
                        <tr>
                        <th scope="row">Pearson score </th>
                        <td>${format(data.Scores.SimLexPearson)}</td>
                        </tr>
                        <tr>
                        <th scope="row">Spearman score </th>
                        <td>${format(data.Scores.SimLexSpearman)}</td>
                        </tr>
                        </tbody>
                    </table> 
                    `;
            break;
        case 'wordsim':
            output += `
                    <h5 class="card-title">SimLex-999 Results</h5>
                    <table class="table table-borderless table-dark">
                        <tbody>
                        <tr>
                        <th scope="row">Pearson score </th>
                        <td>${format(data.Scores.WordSimPearson)}</td>
                        </tr>
                        <tr>
                        <th scope="row">Spearman score </th>
                        <td>${format(data.Scores.WordSimSpearman)}</td>
                        </tr>
                        </tbody>
                    </table> 
                    `;
            break;
    }
    output += `<h6 class="card-subtitle mt-3 mb-2">Download results as JSON: </h6>`;
    if (debiased == 'true'){
        output += `<a class="btn" role="button" id="debDownloadButton"> <i class="fas fa-cloud-download-alt fa-5x"></i> </a>`;
    }
    else{
        output += `<a class="btn" role="button" id="downloadButton"> <i class="fas fa-cloud-download-alt fa-5x"></i> </a>`;
    }
    return output;
}

//Adds content to an as target specified object
async function addOutputToTarget(target, output){
    target.innerHTML = output;
}

//Perform an API-Call, format results, create download functionality
async function performEvaluation(target){
    startSpinner(target);
    var data = await biasEvaluation();
    let output = await formatEvaluationScores(data);
    counter += 1;
    if (debiased == 'true'){
        addOutputToTarget(target, output).then(document.getElementById('debDownloadButton').addEventListener("click", function() {download('bias-evaluation-scores-' + counter, data)}))
    }
    else{
        addOutputToTarget(target, output).then(document.getElementById('downloadButton').addEventListener("click", function() {download('bias-evaluation-scores-' + counter, data)}))
    }
    continueDebiasing.removeAttribute('hidden');
    sContinueDebiasing.removeAttribute('hidden');
    evalResponse = data;
}

// --- DEBIASING ---

//Create URL for debiasing call
async function createDebiasingURL(){
    await getSelectionDebiasing();
    var url = mainURL + 'debiasing';
    url += '/' + model;
    if (space != ''){
        url += '?space=' + space;
    }
    if (uploaded != ''){
        url += '&uploaded=' + uploaded;
    }    
    if (lower != 'false'){
        url += '&lower=true'
    }
    if (pca != ''){
        url += '&pca=' + pca;
    }
    return url;
}

//API-Call for debiasing
async function debiasing(){
    var url = await createDebiasingURL();
    var content = await getContentDebiasing();
    var result = null;
    console.log(JSON.stringify(content));
    try{
        result = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(content),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            result = data;
            debiasResponse = data;
        });
    }
    catch (error){
        console.error(error);
    }
    return result;  
}

//Format json content to html
async function formatDebiasing() {
    let output = '';
    switch (model) {
        case 'gbdd':
            output += `<h5 class="card-title mb-3">GBDD Debiasing Results: </h5><br>`;
            break;
        case 'bam':
            output += `<h5 class="card-title">BAM Debiasing Results: </h5><br>`;
            break;
        case 'gbddxbam':
            output += `<h5 class="card-title">GBDD°BAM Debiasing Results: </h5><br>`;
            break;
        case 'bamxgbdd':
            output += `<h5 class="card-title">BAM°GBDD Debiasing Results: </h5><br>`;
            break;
    }
    if (pca == 'true'){
        output += `
            <div class="row">
                <div class="col">
                    <p> Biased Embedding Space: </p>
                    <div class="container" style="background-color: #ffffff; max-height:800px; max-width:600px; display:float;">
                        <canvas id="biasedChart"></canvas>        
                    </div>
                </div>
                <div class="col">
                    <p> Debiased Embedding Space: </p>
                    <div class="container" style="background-color: #ffffff; max-height:800px; max-width:600px; display:float;">
                        <canvas id="debiasedChart"></canvas>
                    </div>    
                </div>
            </div>

        `;
    }
    output += `
        <h6 class="card-subtitle mt-3 mb-2">Download results as JSON: </h6>
        <a class="btn" role="button" id="debiasDownloadButton"> <i class="fas fa-cloud-download-alt fa-5x"></i> </a>
    `;
    return output;
}

//Adds content to an as target specified object
async function addDebiasingOutput(target, output){
    target.innerHTML = output;
}

//Steers the drawing of the debiasing visualizations
async function drawPCAChart(){
    if (pca == 'true'){
        //drawChart();
        drawChartData(debiasResponse.BiasedSpacePCA, 'biasedChart');
        drawChartData(debiasResponse.DebiasedSpacePCA, 'debiasedChart');
    }
}

//Controlls the whole debiasing process
async function performDebiasing(target){
    startSpinner(target);
    await debiasing();
    let output = await formatDebiasing();
    addDebiasingOutput(target, output).then( await drawPCAChart());
    counter += 1;
    document.getElementById('debiasDownloadButton').addEventListener("click", function() {download('bias-evaluation-scores-' + counter, debiasResponse)});
    dEvaluationButton.removeAttribute('hidden');
}

// --- DEBIASING CHARTS ---


//Return vector data as point floats
function getVector(vector){
    vector = JSON.stringify(vector);
    console.log(vector);
    var endOfX = vector.indexOf(",");
    var endOfY = vector.length -1
    var xAsString = vector.substring(1,endOfX);
    var yAsString = vector.substring(endOfX+1, endOfY);
    var current_x = parseFloat(xAsString);
    var current_y = parseFloat(yAsString);
    var point = {x: current_x, y:current_y};
    return point;
}

//Draw a scatter chart for result comparing
function drawChart(){
    var data = debiasResponse;
    var biasLables = [];
    var debiasLabels = [];
    biasLabels = biasLables.concat(Object.keys(data.BiasedSpacePCA.T1), Object.keys(data.BiasedSpacePCA.T2), Object.keys(data.BiasedSpacePCA.A1), Object.keys(data.BiasedSpacePCA.A2));
    debiasLabels = debiasLabels.concat(Object.keys(data.DebiasedSpacePCA.T1), Object.keys(data.DebiasedSpacePCA.T2), Object.keys(data.DebiasedSpacePCA.A1), Object.keys(data.DebiasedSpacePCA.A2));
    console.log(biasLables);
    console.log(Object.keys(data.BiasedSpacePCA.T1));
    var debiasPoints = [];
    var biasPoints = [];
    for (let ele in data.DebiasedSpacePCA.T1){
        console.log(data.DebiasedSpacePCA.T1[ele]);
        if (data.DebiasedSpacePCA.T1[ele] != null){
            point = getVector(data.DebiasedSpacePCA.T1[ele]);
            debiasPoints.push(point);
        }
    }
    for (let ele in data.DebiasedSpacePCA.T2){
        if (data.DebiasedSpacePCA.T2[ele] != null){
        point = getVector(data.DebiasedSpacePCA.T2[ele]);
        debiasPoints.push(point);
        }
    }
    for (let ele in data.DebiasedSpacePCA.A1){
        if (data.DebiasedSpacePCA.A1[ele] != null){
        point = getVector(data.DebiasedSpacePCA.A1[ele]);
        debiasPoints.push(point);
        }
    }
    for (let ele in data.DebiasedSpacePCA.A2){
        if (data.DebiasedSpacePCA.A2[ele] != null){
        point = getVector(data.DebiasedSpacePCA.A2[ele]);
        debiasPoints.push(point);
        }
    }

    for (let ele in data.BiasedSpacePCA.T1){
        if (data.DebiasedSpacePCA.T1[ele] != null){
        point = getVector(data.BiasedSpacePCA.T1[ele]);
        biasPoints.push(point);
        }
    }
    for (let ele in data.BiasedSpacePCA.T2){
        if (data.DebiasedSpacePCA.T2[ele] != null){
        point = getVector(data.BiasedSpacePCA.T2[ele]);
        biasPoints.push(point);
        }
    }
    for (let ele in data.BiasedSpacePCA.A1){
        if (data.DebiasedSpacePCA.A1[ele] != null){
        point = getVector(data.BiasedSpacePCA.A1[ele]);
        biasPoints.push(point);
        }
    }
    for (let ele in data.BiasedSpacePCA.A2){
        if (data.DebiasedSpacePCA.A2[ele] != null){
        point = getVector(data.BiasedSpacePCA.A2[ele]);
        biasPoints.push(point);
        }
    }
    var ctx = document.getElementById("debiasingChart").getContext('2d'); //Replace myChart with targetID
    var scatterChart = new Chart(ctx, {
    type: 'scatter',
      data: {
      labels: debiasLabels.concat(biasLables),
          datasets: [{
            label: 'Debiased',
            data: debiasPoints,
            backgroundColor: '#009dff',
            labels: debiasLabels
          },
        {
          label: 'Biased',
          data: biasPoints,
          backgroundColor: '#ffc300',
          labels: biasLables
        }]
        },
        options: {
          scales: {
            xAxes: [{
              type: 'linear',
              position: 'bottom'
            }]
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
              var label = data.labels[tooltipItem.index];
              return label + ': (' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
            }
          }
        }
      }
    });
}

//Draw two scatter charts for debiasing results
function drawChartData(data, target){
    console.log('start');
    var dataLabels = [];
    var t1Labels = Object.keys(data.T1);
    var t2labels = Object.keys(data.T2);
    var a1Labels = Object.keys(data.A1);
    var a2Labels = Object.keys(data.A2);
    dataLabels = dataLabels.concat(t1Labels, t2labels, a1Labels, a2Labels);
    var pointsT1 = [];
    var pointsT2 = [];
    var pointsA1 = [];
    var pointsA2 = [];
    for (let ele in data.T1){
        if (data.T1[ele] != null){
            point = getVector(data.T1[ele]);
            pointsT1.push(point);
        }
    }
    for (let ele in data.T2){
        if (data.T2[ele] != null){
            point = getVector(data.T2[ele]);
            pointsT2.push(point);
        }
    }
    for (let ele in data.A1){
        if (data.A1[ele] != null){
            point = getVector(data.A1[ele]);
            pointsA1.push(point);
        }
    }
    for (let ele in data.A2){
        if (data.A2[ele] != null){
            point = getVector(data.A2[ele]);
            pointsA2.push(point);
        }
    }

    var ctx1 = document.getElementById(target).getContext('2d'); //Replace myChart with targetID
    var scatterChart1 = new Chart(ctx1, {
    type: 'scatter',
      data: {
      labels: dataLabels,
          datasets: [
        {
            label: 'T1',
            data: pointsT1,
            pointBackgroundColor: '#009dff',
            backgroundColor: '#009dff',
            labels: t1Labels
        },
        {
            label: 'T2',
            data: pointsT2,
            pointBackgroundColor: '#ffc300',
            backgroundColor: '#ffc300',
            labels: t2labels
        },
        {
            label: 'A1',
            data: pointsA1,
            pointBackgroundColor: '#2efe64',
            backgroundColor: '#2efe64',
            labels: a1Labels
        },
        {
            label: 'A2',
            data: pointsA2,
            pointBackgroundColor: '#B40404',
            backgroundColor: '#B40404',
            labels: a2Labels
          }
    
    ]
        },
        options: {
          scales: {
            xAxes: [{
              type: 'linear',
              position: 'bottom'
            }]
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
              var label = data.labels[tooltipItem.index];
              return label + ': (' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
            }
          }
        }
      }
    });
}

// --- EVENT LISTENERS ---

//Upload File
uploadButton.addEventListener('click', function () { upload() });

//Display File name and enable/disenable uploadButton
inputVecs.onchange = function () {
    inputVecsLabel.innerText = (inputVecs.files[0].name);
    if (binarySwitcher.checked == false) {
        uploadButton.removeAttribute('disabled');
    }
    if (binarySwitcher.checked == true && inputVocabLabel.innerText != "Choose vocab file") {
        uploadButton.removeAttribute('disabled');
    }
};

//Display File name and enable/disenable uploadButton
inputVocab.onchange = function () {
    inputVocabLabel.innerText = (inputVocab.files[0].name);
    if (inputVecsLabel.innerText != "Choose vector file") {
        uploadButton.removeAttribute('disabled');
    }
};

//Switch Button, adds second file upload input
binarySwitcher.onchange = function () {
    if (binarySwitcher.checked == false) {
        uploadVocab.setAttribute('hidden', true);
    }
    else if (binarySwitcher.checked == true) {
        uploadVocab.removeAttribute('hidden');
    }
};

//Switch button, displays or hides input fields for augmentations
augmentSwitch.onchange = function() {
    console.log('augmentswitch');
    div = document.getElementById('augmentationsInput');
    if (div.getAttribute('hidden') == null){
        div.setAttribute('hidden', 'true');
    }
    else {
        div.removeAttribute('hidden');
    }
};

//Starts Application by displaying first container
startButton.addEventListener("click", function() {expandAppSelection(); expandContainer('spaceContainer')});

//Confirm to operate on the selected embedding space
confirmButton.addEventListener("click", function() {
    if (document.getElementById('spaceToggleGroup').getElementsByClassName('active')[0].id == 'upload'){
        hideContainer('specificationContainer');
        expandContainer('uploadContainer');
    }
    else{
        hideContainer('uploadContainer');
        expandContainer('specificationContainer');
    }
});

//Proceed with pre-defined bias specs
predefinedButton.addEventListener("click", function() {
    expandContainer('preDefinedContainer');
    hideContainer('selfDefinedContainer');
    loadTestData().then(function () { setTableEventListeners() });
});

//Proceed with self-defined bias specs
selfdefinedButton.addEventListener("click", function() {
    expandContainer('selfDefinedContainer');
    hideContainer('preDefinedContainer');
});

//Start evaluation of pre-defined bias spec
evaluationButton.addEventListener("click", function() {
    predefined = true;
    evalCard.removeAttribute('hidden');
    evalCardBody.innerHTML = '';
    performEvaluation(evalCardBody);
});

//Start evaluation of self-defined bias spec
sEvaluationButton.addEventListener("click", function() {
    predefined = false;
    sEvalCard.removeAttribute("hidden");
    sEvalCardBody.innerHTML = '';
    performEvaluation(sEvalCardBody);
});

//Continue with debiasing after pre-defined evaluation
continueDebiasing.addEventListener("click", function() {
    expandContainer('debiasingContainer');
});

//Continue with debiasing after self-defined evaluation
sContinueDebiasing.addEventListener("click", function() {
    expandContainer('debiasingContainer');
});

//Start debiasing using selected model
debiasingButton.addEventListener("click", function() {
    debiasingCard.removeAttribute('hidden');
    debiasingCardBody.innerHTML += '';
    performDebiasing(debiasingCardBody);  
});

//Start a second evaluation of the debiased results
dEvaluationButton.addEventListener("click", function() {
    debiased = 'true';
    dEvaluateContainer.removeAttribute('hidden');
    evalCard2.removeAttribute('hidden');
    evalCardBody2.innerHTML = '';
    performEvaluation(evalCardBody2);
    thankYou.removeAttribute('hidden');
});

//Delete uploaded file by closing the window
window.addEventListener("beforeunload", function() {
    handleFileDelete();
})