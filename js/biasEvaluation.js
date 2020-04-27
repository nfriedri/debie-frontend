var selectionJumbo = document.getElementById('selectionJumbo');
var startButton = document.getElementById('startEvaluation');
var responseCard = document.getElementById('responseCard');
var responseCardBody = document.getElementById('responseCardBody');
var lowerSwitch = document.getElementById('lowerSwitch');

var predefined = 'true';

var space = '';
var evalMethod = '';
var uploaded = '';
var lower = 'false';

var init = document.getElementById('initSuccess');

const format = (num, decimals) => num.toLocaleString('en-US', {
    minimumFractionDigits: 2,      
    maximumFractionDigits: 2,
 });

async function getSelectionValues() {
    space = document.getElementById('embeddingSpaces').getElementsByClassName('active')[0].id;
    evalMethod = document.getElementById('evalMethods').getElementsByClassName('active')[0].id;
    if (space == "upload"){
        if (init.innerText != 'false'){
            space = init.innerText;
            uploaded = "true";
        }
        else{
            selectionJumbo.innerHTML += '<div class="alert alert-danger mt-4 mb-0" role="alert" id="noUpload">No File uploaded. Please select a file or choose one of the provided embedding space</div>';
            alert = document.getElementById('noUpload')
            setTimeout(() => {  alert.remove() }, 4000);
            return;
        }
    }
    if (lowerSwitch.checked == true){
        lower = 'true';
    }
    else{
        lower = 'false';
    }
    console.log("Current Values: " + space + " " + evalMethod + " " + uploaded);
}

function getContent(){
    content = {};
    if (predefined == 'true'){
        content['Name'] = document.getElementById('valuesName').innerText;
        content['T1'] = document.getElementById('valuesT1').innerText;
        content['T2'] = document.getElementById('valuesT2').innerText;
        content['A1'] = document.getElementById('valuesA1').innerText;
        content['A2'] = document.getElementById('valuesA2').innerText;
    }
    else{

    }
    return content;
}



// Starts a spinner inside the parameter html-object
function startSpinner(object) {
    object.innerHTML =  `
    <div class="d-flex justify-content-center"><div class="spinner-border text-info" role="status"><span class="sr-only">Loading...</span></div></div>`;
}


//Send bias evaluation request
async function sendRequest() {
    await getSelectionValues();
    var url = 'http://127.0.0.1:5000/REST/bias-evaluation';
    //var url = 'http://wifo5-29.informatik.uni-mannheim.de:8000/REST/bias-evaluation';
    url += '/' + evalMethod;
    if (space != ''){
        url += '?space=' + space;
    }
    if (uploaded != '')
        url += '&uploaded=' + uploaded;
    if (lower != 'false'){
        url += '&lower=true'
    }
     
    var content = getContent();
    var statusFlag = 200;
    console.log(JSON.stringify(content));
    responseCard.removeAttribute('hidden');
    startSpinner(responseCardBody);
    try {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(content),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            if (!res.ok){
                statusFlag = res.status;
                let output = `<div class="alert alert-danger mt-4 mb-0" role="alert">${res.status}: ${res.message}</div>`;
                responseCard.innerHTML = output;
            }
            return res.json();
        })
        .then((data) => {
            console.log(data)
            let output = '';
            if (statusFlag != 200){
                output += `
                <h5 class="card-title mb-3">ERROR</h5>
                <p>${statusFlag} ${data.message}</p> 
                <p>Please check your input and try again.</p>
                `
            }
            else{
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
                        <th scope="row">K-Means result: </th>
                        <td>${format(data.Scores.K_Means)}</td>
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
                        </tbody>
                    </table>  
                    `;
                    break;
                case 'kmeans':
                    output += `
                    <h5 class="card-title">KMeans Results</h5>
                    <table class="table table-borderless table-dark">
                        <tbody>
                        <tr>
                        <th scope="row">K-Means result: </th>
                        <td>${format(data.Scores.K_Means)}</td>
                        </tr>
                        </tbody>
                    </table> 
                    `;
                    break;
                }
                output += `
                    <h6 class="card-subtitle mt-3 mb-2">Download results as JSON: </h6>
                    <input type="image" src="img/download.png" height="10%" width="10%" id="downloadButton"></input>
                `;
            }
            responseCardBody.innerHTML = output;
            try{
                document.getElementById('downloadButton').addEventListener("click", function(){download(content['Name'], data);});
            }
            catch (error){
                console.error(error);
            }
        })
    } catch (error) {
      console.error(error);
    }
    var scripts = element.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
        eval(scripts[i].innerText);
    }
  }

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


startButton.addEventListener("click", function() {sendRequest()});