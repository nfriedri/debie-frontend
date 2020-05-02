var predefined = true;
var model = 'bam'
var space = '';
var uploaded = '';
var lower = '';
var pca = '';
var debiasingButton = document.getElementById('debiasingBtn');
var debiasingCard = document.getElementById('debiasingCard');
var debiasingCardBody = document.getElementById('debiasingCardBody');

var lowerSwitch = document.getElementById('lowerSwitch');
var pcaSwitch = document.getElementById('pcaoffSwitch');
var augmentSwitch = document.getElementById('augmentSwitch');

function startSpinner() {
    debiasingCard.removeAttribute('hidden');
    debiasingCardBody.innerHTML += `
    <div class="d-flex justify-content-center"><div class="spinner-border text-info" role="status"><span class="sr-only">Loading...</span></div></div>
    `;
}

async function getSelectionValues() {
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



async function debiasing(){
    getSelectionValues()
    var url = 'http://127.0.0.1:5000/REST/debiasing';
    //var url = 'http://wifo5-29.informatik.uni-mannheim.de:8000/REST/debiasing';
    url += '/' + model;
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
    startSpinner(debiasingCardBody);
    var content = await getContentDebiasing();
    var statusFlag = 200;
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
            document.getElementById('debiasDownloadButton').addEventListener(createDownloadJson(model + '-debiasing', data))
            debiasingCardBody.innerHTML = output;
            if (enablePCA == 'true'){
                drawChart('debiasingChart', data);
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
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    console.log('Downloaded')
}

//Draw a scatter chart for result comparing
function drawChart(identifier, data){
    var chart1 = identifier;
    var biasLables = [];
    var debiasLabels = [];
    biasLables.concat(Object.keys(data.BiasedSpacePCA.T1), Object.keys(data.BiasedSpacePCA.T2), Object.keys(data.BiasedSpacePCA.A1), Object.keys(data.BiasedSpacePCA.A2));
    debiasLabels.concat(Object.keys(data.DebiasedSpacePCA.T1), Object.keys(data.DebiasedSpacePCA.T2), Object.keys(data.DebiasedSpacePCA.A1), Object.keys(data.DebiasedSpacePCA.A2));

    var debiasPoints = [];
    var biasPoints = [];
    for (set in data.DebiasedSpacePCA){
        for (ele in data.DebiasedSpacePCA[set]){
            var endOfX = data.DebiasedSpacePCA[set][ele].indexOf(",");
            var endOfY = data.DebiasedSpacePCA[set][ele].length -1
            xAsString = data.DebiasedSpacePCA[set][ele].substring(1,endOfX);
            yAsString = data.DebiasedSpacePCA[set][ele].substring(endOfX+1, endOfY);
            var current_x = parseFloat(xAsString);
            var current_y = parseFloat(yAsString);
            var point = {x: current_x, y:current_y};
            debiasPoints.push(point);
        }
    }
    for (set in data.BiasedSpacePCA){
        for (ele in inputData.BiasedSpacePCA[set]){
            var endOfX = data.BiasedSpacePCA[set][ele].indexOf(",");
            var endOfY = data.BiasedSpacePCA[set][ele].length -1
            xAsString = data.BiasedSpacePCA[set][ele].substring(1,endOfX);
            yAsString = data.BiasedSpacePCA[set][ele].substring(endOfX+1, endOfY);
            var current_x = parseFloat(xAsString);
            var current_y = parseFloat(yAsString);
            var point = {x: current_x, y:current_y};
            biasPoints.push(point);
        }
    }
    var ctx = document.getElementById(chart1).getContext('2d'); //Replace myChart with targetID
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

debiasingButton.addEventListener("click", function() {debiasing()});