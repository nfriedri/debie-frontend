var selectionJumbo = document.getElementById('selectionJumbo');
var startButton = document.getElementById('startEvaluation');
var responseCard = document.getElementById('responseCard');
var responseCardBody = document.getElementById('responseCardBody');
var selfResponseCard = document.getElementById('selfResponseCard');
var selfResponseCardBody = document.getElementById('selfResponseCardBody');
var lowerSwitch = document.getElementById('lowerSwitch');
var continueDebiasing = document.getElementById('continueDebiasing')
var evalResponse = null;

var model = 'bam'
var pca = '';
var debiasingButton = document.getElementById('debiasingBtn');
var debiasingCard = document.getElementById('debiasingCard');
var debiasingCardBody = document.getElementById('debiasingCardBody');

var pcaSwitch = document.getElementById('pcaoffSwitch');
var augmentSwitch = document.getElementById('augmentSwitch');
var init = document.getElementById('initSuccess');
var predefined = true;

var space = '';
var evalMethod = '';
var uploaded = '';
var lower = 'false';

const format = (num, decimals) => num.toLocaleString('en-US', {
    minimumFractionDigits: 2,      
    maximumFractionDigits: 2,
 });

async function getSelectionEval() {
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

async function getSelectionDebiasing() {
    space = document.getElementById('embeddingSpaces').getElementsByClassName('active')[0].id;
    model = document.getElementById('debiasModel').getElementsByClassName('active')[0].id;
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
    if (pcaSwitch.checked == true){
        pca = 'false';
    }
    else{
        pca = 'true'
    }
    console.log("Current Values: " + space + " " + model + " " + uploaded);
}

function getContent(){
    content = {};
    if (document.getElementById('preDefinedContainer').getAttribute('hidden') == null){
        predefined = true;
        content['Name'] = document.getElementById('valuesName').innerText;
        content['T1'] = document.getElementById('valuesT1').innerText;
        content['T2'] = document.getElementById('valuesT2').innerText;
        content['A1'] = document.getElementById('valuesA1').innerText;
        content['A2'] = document.getElementById('valuesA2').innerText;
    }
    else{
        predefined = false;
        content['T1'] = document.getElementById('target1').value;
        content['T2'] = document.getElementById('target2').value;
        content['A1'] = document.getElementById('attribute1').value;
        content['A2'] = document.getElementById('attribute2').value; 
    }
    return content;
}

function getContentDebiasing(){
    content = {};
    if (evalResponse != null) {
        content = evalResponse;
    }
    else{
    
        if (document.getElementById('preDefinedContainer').getAttribute('hidden') == null){
            predefined = true;
            content['Name'] = document.getElementById('valuesName').innerText;
            content['T1'] = document.getElementById('valuesT1').innerText;
            content['T2'] = document.getElementById('valuesT2').innerText;
            content['A1'] = document.getElementById('valuesA1').innerText;
            content['A2'] = document.getElementById('valuesA2').innerText;
        }
        else{
            predefined = false;
            content['T1'] = document.getElementById('target1').value;
            content['T2'] = document.getElementById('target2').value;
            content['A1'] = document.getElementById('attribute1').value;
            content['A2'] = document.getElementById('attribute2').value;
            if (augmentSwitch.checked == true){
                content['Augmentations1'] = document.getElementById('augmentations1').value;
                content['Augmentations2'] = document.getElementById('augmentations2').value;
            } 
        }
    }
    return content;
}

// Starts a spinner inside the parameter html-object
function startSpinner(object) {
    object.innerHTML =  `
    <div class="d-flex justify-content-center"><div class="spinner-border text-info" role="status"><span class="sr-only">Loading...</span></div></div>
    `;
}

//Send bias evaluation request
async function biasEvaluation() {
    await getSelectionEval();
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
    if (predefined){responseCard.removeAttribute('hidden');}
    else{selfResponseCard.removeAttribute('hidden');}
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
            if (statusFlag != 200){
                output += `
                <h5 class="card-title mb-3">ERROR</h5>
                <p>${statusFlag} ${data.message}</p> 
                <p>Please check your input and try again.</p>
                `
            }
            console.log(data)
            let output = '';
            if (data.BiasSpecification.Deleted == ''){
                data.BiasSpecification.Deleted = '-';
            }
            if (data.BiasSpecification.NotFound == ''){
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
                        <th scope="row">K-Means result: </th>
                        <td>${format(data.Scores.K_Means)}</td>
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
                    <h5 class="card-title">KMeans Results</h5>
                    <table class="table table-borderless table-dark">
                        <tbody>
                        <tr>
                        <th scope="row">K-Means result: </th>
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
                }
                output += `
                    <h6 class="card-subtitle mt-3 mb-2">Download results as JSON: </h6>
                    <input type="image" src="img/download.png" height="10%" width="10%" id="downloadButton"></input>
                `;
                evalResponse = data;
            if (predefined){responseCardBody.innerHTML = output;}
            else{selfResponseCardBody.innerHTML = output;}
            
            try{ 
                if (predefined){
                    document.getElementById('downloadButton').addEventListener("click", function(){download(content['Name'], data);});
                }
                else{
                    document.getElementById('downloadButton').addEventListener("click", function(){download('self-defined-bias', data);});
                }
            }
            catch (error){
                console.error(error);
            }
            continueDebiasing.removeAttribute('hidden')
        })
    } catch (error) {
      console.error(error);
    }
    
}

async function debiasing(){
    var url = 'http://127.0.0.1:5000/REST/debiasing';
    var content = await getContentDebiasing();
    var statusFlag = 200;
    startSpinner(debiasingCardBody);
    await getSelectionDebiasing().then(function() {
        //var url = 'http://wifo5-29.informatik.uni-mannheim.de:8000/REST/debiasing';
        url += '/' + model;
        console.log(model);
        if (space != ''){
            url += '?space=' + space;
        }
        if (uploaded != '')
            url += '&uploaded=' + uploaded;
        if (lower != 'false'){
            url += '&lower=true'
        }
        if (pca != ''){
            url += '&pca=' + pca;
        }
    });
    console.log(JSON.stringify(content));
    debiasingCard.removeAttribute('hidden');
    try{
        await fetch(url, {
        method: 'POST',
        body: JSON.stringify(content),
        headers: {
            'Content-Type': 'application/json'
        }
        })
        .then((res) => {
            if (!res.ok){
                statusFlag = res.status;
            }
            return res.json();
        })
        .then((data) => {
            let output = '';
            if (statusFlag != 200){
                output += `
                <h5 class="card-title mb-3">ERROR</h5>
                <p>${statusFlag} ${data.message}</p> 
                <p>Please check your input and try again.</p>
                `
            }
            switch (model) {
            case 'gbdd':
                output += `
                <h5 class="card-title mb-3">GBDD Debiasing Results: </h5>
                <br>
                `;
                break;
            case 'bam':
                output += `
                <h5 class="card-title">BAM Debiasing Results: </h5>
                <br>
                `;
                break;
            case 'gbddxbam':
                output += `
                <h5 class="card-title">GBDD°BAM Debiasing Results: </h5>
                <br>
                `;
            break;
            case 'bamxgbdd':
                output += `
                <h5 class="card-title">BAM°GBDD Debiasing Results: </h5>
                <br>
                `;
            break;
            case 'gbddxdebiasNet':
                output += `
                <h5 class="card-title">GBDD°DebiasNet Debiasing Results: </h5>
                <br>
                `;
            break;
            }
            if (pca == 'true'){
                output += `
                <div class="container" style="background-color: #ffffff; max-height:600px; max-width:800px;">
                    <canvas id="debiasingChart"></canvas>
                </div>
                `;
            }
            output += `
                <h6 class="card-subtitle mt-3 mb-2">Download results as JSON: </h6>
                <input type="image" src="img/download.png" height="10%" width="10%" id="debiasDownloadButton"></input>
                `;
            debiasingCardBody.innerHTML = output;
            document.getElementById('debiasDownloadButton').addEventListener("click", function() {download(model + '-debiasing', data)});
            try{
                if (pca == 'true'){
                    drawChart(data);
                }
            }
            catch (error){
                console.log(error);
            }
            
        });
    }
    catch (error){
        console.error(error);
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
function drawChart(data){
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
        if (data.DebiasedSpacePCA.T1[ele] != null){
        point = getVector(data.DebiasedSpacePCA.T1[ele]);
        debiasPoints.push(point);
        }
    }
    for (let ele in data.DebiasedSpacePCA.A1){
        if (data.DebiasedSpacePCA.T1[ele] != null){
        point = getVector(data.DebiasedSpacePCA.T1[ele]);
        debiasPoints.push(point);
        }
    }
    for (let ele in data.DebiasedSpacePCA.A2){
        if (data.DebiasedSpacePCA.T1[ele] != null){
        point = getVector(data.DebiasedSpacePCA.T1[ele]);
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
        if (data.DebiasedSpacePCA.T1[ele] != null){
        point = getVector(data.BiasedSpacePCA.T1[ele]);
        biasPoints.push(point);
        }
    }
    for (let ele in data.BiasedSpacePCA.A1){
        if (data.DebiasedSpacePCA.T1[ele] != null){
        point = getVector(data.BiasedSpacePCA.T1[ele]);
        biasPoints.push(point);
        }
    }
    for (let ele in data.BiasedSpacePCA.A2){
        if (data.DebiasedSpacePCA.T1[ele] != null){
        point = getVector(data.BiasedSpacePCA.T1[ele]);
        biasPoints.push(point);
        }
    }
    /*
    for (let set in data.DebiasedSpacePCA){
        debiasedSpace = data.DebiasedSpacePCA[set];
        for (let ele in debiasedSpace){
            var endOfX = debiasedSpace[ele].indexOf(",");
            var endOfY = debiasedSpace[ele].length -1
            xAsString = debiasedSpace[ele].substring(1,endOfX);
            yAsString = debiasedSpace[ele].substring(endOfX+1, endOfY);
            var current_x = parseFloat(xAsString);
            var current_y = parseFloat(yAsString);
            var point = {x: current_x, y:current_y};
            debiasPoints.push(point);
        }
    }
    for (let set in data.BiasedSpacePCA){
        biasedSpace = data.BiasedSpacePCA[set];
        for (let ele in biasedSpace){
            var endOfX = biasedSpace[ele].indexOf(",");
            var endOfY = biasedSpace[ele].length -1
            xAsString = biasedSpace[ele].substring(1,endOfX);
            yAsString = biasedSpace[ele].substring(endOfX+1, endOfY);
            var current_x = parseFloat(xAsString);
            var current_y = parseFloat(yAsString);
            var point = {x: current_x, y:current_y};
            biasPoints.push(point);
        }
    }
    */
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

startButton.addEventListener("click", function() {biasEvaluation()});
debiasingButton.addEventListener("click", function() {debiasing()});