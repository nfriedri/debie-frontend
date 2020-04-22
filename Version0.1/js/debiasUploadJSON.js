
const inputJSON = document.getElementById('customFile');
const debiasBtn = document.getElementById('Debias2');
var fileContent = '';
var result = '';
var vectorTypeEnum = 'fasttext';
var debiasMethodEnum = 'gbdd';
var vectorsEnabled = 'false';

//Updates the values of the currently selected parameters
function getSelectionValuesJSON() {
  let activeVectorType = document.getElementById('word_embedding').getElementsByClassName('active')[0];
  let activeDebiasMethod = document.getElementById('debias_methods').getElementsByClassName('active')[0];
  vectorTypeEnum = activeVectorType.id;
  if (vectorTypeEnum == "uploadSpace"){
    fileInputName = document.getElementById("inputFileInput")
    if (fileInputName.value != undefined){
      vectorTypeEnum = fileInputName.value
    }
    else{
      vectorTypeEnum = fileInputName.getAttribute("placeholder");
    }
  }
  let switcher = document.getElementById('vectorsEnabled');
    if (switcher.checked == false){
      vectorsEnabled = "false";
    }
    else if (switcher.checked == true){
      vectorsEnabled = "true";
    }
    debiasMethodEnum = activeDebiasMethod.id;
  console.log("Current Values: " + vectorTypeEnum + " " + debiasMethodEnum + " " + vectorsEnabled);
}

//Handle uploaded file 
function handleFileSelect(evt) {
    var files = evt.target.files;
    for (var i = 0, f; f = files[i]; i++) {
        let output = '';
        output += `<strong>${f.name}</strong>: ${f.type}, ${f.size} bytes, last modified: ${f.lastModifiedDate.toLocaleDateString()}`;
        document.getElementById('filedetails').innerHTML = output;
        var reader = new FileReader();
        reader.onload = (function(theFile) {
        return function(e) {
            fileContent += e.target.result;
        };
    })(f);
    reader.readAsText(f);
    }
}
document.getElementById('customFile').addEventListener('change', handleFileSelect, false);

//Send a debiasing request
function sendJSONRequest(target_id, sourceFile, resultVar, downloadButtonID, cardID) {
    getSelectionValuesJSON();
    startSpinner(target_id)
    //var url = 'http://127.0.0.1:5000/REST/debiasing';
    var url = 'http://wifo5-29.informatik.uni-mannheim.de:8000/REST/debiasing';
    url += '/' + enablePCA + '/' + debiasMethodEnum;
    url += '?space=' + vectorTypeEnum + '&augments=True';
    url += '&vectors=' + vectorsEnabled;
    console.log(url);
    console.log(sourceFile);
    document.getElementById(cardID).removeAttribute("hidden");
    console.log("card1 visible");
    var statusFlag = 200;
  
    try {
        const response = fetch(url, {
          method: 'POST',
          body: postJson,
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
          else{
            switch (debiasMethodEnum) {
              case 'gbdd':
                output += `
                  <h5 class="card-title mb-3">GBDD Debiasing Results: </h5>
                  <div id="gbdd_chart"></div>
                `;
                break;
              case 'bam':
                  output += `
                  <h5 class="card-title">BAM Debiasing Results: </h5>
                  <div id="bam_chart"></div>
                  `;
                break;
              case 'debiasNet':
                  output += `
                  <h5 class="card-title">DebiasNet Debiasing Results: </h5>
                  <div id="debiasNet_chart"></div>
                `;
                break;
              case 'bamxgbdd':
                  output += `
                  <h5 class="card-title">BAM°GBDD Debiasing Results: </h5>
                  <div id="bamxgbdd_chart"></div>
                `;
                break;
              case 'gbddxdebiasNet':
                  output += `
                  <h5 class="card-title">GBDD°DebiasNet Debiasing Results: </h5>
                  <div id="gbddxdebiasNet_chart"></div>
                `;
                break;
            }
            if (enablePCA == 'pca'){
              output += `
              <div class="container" style="background-color: #ffffff; max-height:600px; max-width:800px;">
                  <canvas id="${target_id}_chart1"></canvas>
              </div>
              `;
            }
            output += `
                  <h6 class="card-subtitle mt-3 mb-2">Download results as JSON: </h6>
            `;
            document.getElementById(downloadButtonID).removeAttribute("hidden");
          }
          document.getElementById(target_id).innerHTML = output;
            //createDownloadJson(resultVar, sourceFile, data);
          currentResult = data;
          if (enablePCA == 'pca'){
            drawChart(target_id, currentResult);
          }
          })
        }
       catch (error) {
        console.error();
    }
}

//Create content for download
function createDownloadJson(resultVar, sourceFile, evalResults){
  resultVar['EmbeddingSpace'] = sourceFile.EmbeddingSpace;
  resultVar['DebiasingMethods'] = sourceFile.Method;
  console.log(resultVar);
}

//Draw a scatter chart 
function drawChart(inputData){
  var chartLabelsDebias = Object.keys(inputData.DebiasedVectorsPCA);
  var listOfPointsDebias = [];
  var chartLabelsBias = Object.keys(inputData.BiasedVectorsPCA);
  var listOfPointsBias = [];
  for (ele in inputData.DebiasedVectorsPCA){
    var endOfX = inputData.DebiasedVectorsPCA[ele].indexOf(",");
    var endOfY = inputData.DebiasedVectorsPCA[ele].length -1
    xAsString = inputData.DebiasedVectorsPCA[ele].substring(1,endOfX);
    yAsString = inputData.DebiasedVectorsPCA[ele].substring(endOfX+1, endOfY);
    var current_x = parseFloat(xAsString);
    var current_y = parseFloat(yAsString);
    var point = {x: current_x, y:current_y};
    listOfPointsDebias.push(point);
  }
  for (ele in inputData.BiasedVectorsPCA){
    var endOfX = inputData.BiasedVectorsPCA[ele].indexOf(",");
    var endOfY = inputData.BiasedVectorsPCA[ele].length -1
    xAsString = inputData.BiasedVectorsPCA[ele].substring(1,endOfX);
    yAsString = inputData.BiasedVectorsPCA[ele].substring(endOfX+1, endOfY);
    var current_x = parseFloat(xAsString);
    var current_y = parseFloat(yAsString);
    var point = {x: current_x, y:current_y};
    listOfPointsBias.push(point);
  }
  var ctx = document.getElementById('chart1').getContext('2d'); //Replace myChart with targetID
  var scatterChart = new Chart(ctx, {
  type: 'scatter',
    data: {
    labels: chartLabelsDebias.concat(chartLabelsBias),
        datasets: [{
          label: 'Debiased',
          data: listOfPointsDebias,
          backgroundColor: '#009dff',
          labels: chartLabelsDebias
        },
      {
        label: 'Biased',
        data: listOfPointsBias,
        backgroundColor: '#ffc300',
        labels: chartLabelsBias
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

//Download the prepared content
function downloadOwn(filename, content){
    var element = document.createElement('a');
    element.style.display = 'none';
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(content)));
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    console.log('Downloaded')
}

//Set Event Listeners
debiasBtn.addEventListener("click", function() { 
    sendJSONRequest("card_response2", fileContent, result, "download2", "card2" );
    fileContent = '';
 });

 document.getElementById('download2').addEventListener("click", function() { downloadOwn('Evaluation.json', result)})
