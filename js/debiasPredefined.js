const jsonFile_1 = '/res/test_set1.json';
var jsonFileContent1 = {};
const jsonFile_2 = '/res/test_set2.json';
var jsonFileContent2 = {};
const jsonFile_3 = '/res/test_set3.json';
var jsonFileContent3 = {};
const jsonFile_4 = '/res/test_set4.json';
var jsonFileContent4 = {};
const jsonFile_5 = '/res/test_set5.json';
var jsonFileContent5 = {};
const jsonFile_6 = '/res/test_set6.json';
var jsonFileContent6 = {};
const jsonFile_7 = '/res/test_set7.json';
var jsonFileContent7 = {};
const jsonFile_8 = '/res/test_set8.json';
var jsonFileContent8 = {};
const jsonFile_9 = '/res/test_set9.json';
var jsonFileContent9 = {};
const jsonFile_10 = '/res/test_set10.json';
var jsonFileContent10 = {};
const tableID_1 = 'table_1';
const tableID_2 = 'table_2';
const tableID_3 = 'table_3';
const tableID_4 = 'table_4';
const tableID_5 = 'table_5';
const tableID_6 = 'table_6';
const tableID_7 = 'table_7';
const tableID_8 = 'table_8';
const tableID_9 = 'table_9';
const tableID_10 = 'table_10';
const captionID_1 = 'name1';
const captionID_2 = 'name2';
const captionID_3 = 'name3';
const captionID_4 = 'name4';
const captionID_5 = 'name5';
const captionID_6 = 'name6';
const captionID_7 = 'name7';
const captionID_8 = 'name8';
const captionID_9 = 'name9';
const captionID_10 = 'name10';
var currentResult = {}
var vectorTypeEnum = 'fasttext';
var debiasMethodEnum = 'all';
var enablePCA = "full";

window.onload = doByStart()

function doByStart() {
  loadTestData(jsonFile_1, tableID_1, captionID_1, jsonFileContent1);
  loadTestData(jsonFile_2, tableID_2, captionID_2, jsonFileContent2);
  loadTestData(jsonFile_3, tableID_3, captionID_3, jsonFileContent3);
  loadTestData(jsonFile_4, tableID_4, captionID_4, jsonFileContent4);
  loadTestData(jsonFile_5, tableID_5, captionID_5, jsonFileContent5);
  loadTestData(jsonFile_6, tableID_6, captionID_6, jsonFileContent6);
  loadTestData(jsonFile_7, tableID_7, captionID_7, jsonFileContent7);
  loadTestData(jsonFile_8, tableID_8, captionID_8, jsonFileContent8);
  loadTestData(jsonFile_9, tableID_9, captionID_9, jsonFileContent9);
  loadTestData(jsonFile_10, tableID_10, captionID_10, jsonFileContent10);
  getSelectionValues();
}

function loadTestData(jsonFile, tableID, captionID, target) {
  fetch(jsonFile)
    .then(response => response.json())
    .then((data) => {
      let output = "<a></a>";
      output += `          
    <tbody>
    <tr>
      <th scope="row">T1</th>
      <td>${data.T1}</td>
    </tr>
    <tr>
      <th scope="row">T2</th>
      <td>${data.T2}</td>
    </tr>
    <tr>
      <th scope="row">A1</th>
      <td>${data.A1}</td> 
    </tr>
    <tr>
      <th scope="row">A2</th>
      <td>${data.A2}</td> 
    </tr>
    </tbody>
    `;
      document.getElementById(captionID).innerHTML = data.Name;
      document.getElementById(tableID).innerHTML = output;
      target['Name'] = data.Name;
      target['T1'] = data.T1;
      target['T2'] = data.T2;
      target['A1'] = data.A1;
      target['A2'] = data.A2;
    })
}

function getSelectionValues() {
  let activeVectorType = document.getElementById('word_embedding').getElementsByClassName('active')[0];
  let activeEvalMethod = document.getElementById('evaluation_methods').getElementsByClassName('active')[0];
  let switcher = document.getElementById('pcaSwitch');
  if (switcher.checked == false){
    enablePCA = "full";
  }
  else if (switcher.checked == true){
    enablePCA = "pca";
  }
  vectorTypeEnum = activeVectorType.id;
  if (vectorTypeEnum == "uploadSpace"){
    fileInputName = document.getElementById("inputLabel")
    if (fileInputName.innerHTML != undefined){
      vectorTypeEnum = fileInputName.innerHTML;
    }
    else{
      vectorTypeEnum = fileInputName.getAttribute("placeholder");
    }
  }
  debiasMethodEnum = activeEvalMethod.id;
  console.log("Current Values: " + vectorTypeEnum + " " + debiasMethodEnum + " " + enablePCA);
}

function startSpinner(object_id) {
  spinner = `
      <div class="d-flex justify-content-center">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      `
  try {
    document.getElementById(object_id).innerHTML = spinner;
  } catch (error) {
    console.error();
  }
}

function createChart(target_id, sourceData){
  var label= 'Biased'
  var wordList = jsonFileContent1.T1 + ' ' + jsonFileContent1.T2 + ' ' + jsonFileContent1.A1 + ' ' + jsonFileContent1.A2;
  wordList = wordList.split(' ');
  console.log(wordList);
  var dataContent = {}

  var scatterChart = new Chart(ctx, {
    type: 'scatter',
      data:{
        labels: wordList,
        datasets: [{
          label: label,
          data: dataContent
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

function sendRequest(target_id, sourceFile, downloadButtonID, cardID) {
  getSelectionValues();
  startSpinner(target_id)
  //var url = 'http://127.0.0.1:5000/REST/debiasing';
  var url = 'http://wifo5-29.informatik.uni-mannheim.de:8000/REST/debiasing';
  sourceFile['EmbeddingSpace'] = vectorTypeEnum;
  sourceFile['Method'] = debiasMethodEnum;
  sourceFile['PCA'] = enablePCA
  console.log(sourceFile);
  url += '/' + enablePCA + '/' + debiasMethodEnum;
  url += '?space=' + vectorTypeEnum + '&augments=True';
  document.getElementById(cardID).removeAttribute("hidden");
  console.log("card visible");
  var statusFlag = 200;

  try {
    const response = fetch(url, {
      method: 'POST',
      body: JSON.stringify(sourceFile),
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
        let typeVar = '';
        if (enablePCA == 'full'){
          typeVar = 'with full dimensionality';
        }
        else{
          typeVar = 'with PCA';
        }
        switch (debiasMethodEnum) {
          case 'gbdd':
            output += `
              <h5 class="card-title mb-3">GBDD Debiasing Results ${typeVar}: </h5>
              <br>
            `;
            break;
          case 'bam':
              output += `
              <h5 class="card-title">BAM Debiasing Results: </h5>
              <br>
              `;
            break;
          case 'debiasNet':
              output += `
              <h5 class="card-title">DebiasNet Debiasing Results: </h5>
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
        if (enablePCA == 'pca'){
          output += `
          <div class="container" style="background-color: #ffffff; max-height:600px; max-width:800px;">
              <canvas id="${target_id}_chart1"></canvas>
          </div>
          `;
          /*
          <div class="row">
            <div class="col mx-1" style="background-color: #ffffff; float:left;">
              <canvas id="${target_id}_chart1"></canvas>
            </div>
            <div class="col mx-1" style="background-color: #ffffff; float:right;">
              <canvas id="${target_id}_chart2"></canvas>
            </div>
          </div>
          */
        }
        output += `
              <h6 class="card-subtitle mt-3 mb-2">Download results as JSON: </h6>
              `;
        document.getElementById(downloadButtonID).removeAttribute("hidden");  
        //createDownloadJson(resultVar, sourceFile, data);
        currentResult = data;
      }
      document.getElementById(target_id).innerHTML = output;
      if (enablePCA == 'pca'){
        drawChart(target_id, currentResult);
      }
      })
  } catch (error) {
    console.error();
  }
}

function createDownloadJson(resultVar, sourceFile, evalResults){
  resultVar['EmbeddingSpace'] = sourceFile.EmbeddingSpace;
  resultVar['DebiasingMethods'] = sourceFile.Method;
  console.log(resultVar);
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

function drawChart(identifier, inputData){
  var chart1 = identifier + '_chart1';
  //var chart2 = identifier + '_chart2';
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
  var ctx = document.getElementById(chart1).getContext('2d'); //Replace myChart with targetID
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
  /*
  var ctx2 = document.getElementById(chart2).getContext('2d'); //Replace myChart with targetID
  var scatterChart2 = new Chart(ctx2, {
  type: 'scatter',
    data: {
      labels: chartLabelsBias,
        datasets: [{
          label: 'Biased',
          data: listOfPointsBias,
          backgroundColor: '#ffc300'
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
  */
}

document.getElementById('Set1_Debias').addEventListener("click", function () { sendRequest('card_words_response', jsonFileContent1, 'download1', 'card1') });
document.getElementById('Set2_Debias').addEventListener('click', function () { sendRequest('card_words_response2', jsonFileContent2, 'download2', 'card2') });
document.getElementById('Set3_Debias').addEventListener('click', function () { sendRequest('card_words_response3', jsonFileContent3, 'download3', 'card3') });
document.getElementById('Set4_Debias').addEventListener('click', function () { sendRequest('card_words_response4', jsonFileContent4, 'download4', 'card4') });
document.getElementById('Set5_Debias').addEventListener('click', function () { sendRequest('card_words_response5', jsonFileContent5, 'download5', 'card5') });
document.getElementById('Set6_Debias').addEventListener('click', function () { sendRequest('card_words_response6', jsonFileContent6, 'download6', 'card6') });
document.getElementById('Set7_Debias').addEventListener('click', function () { sendRequest('card_words_response7', jsonFileContent7, 'download7', 'card7') });
document.getElementById('Set8_Debias').addEventListener('click', function () { sendRequest('card_words_response8', jsonFileContent8, 'download8', 'card8') });
document.getElementById('Set9_Debias').addEventListener('click', function () { sendRequest('card_words_response9', jsonFileContent9, 'download9', 'card9') });
document.getElementById('Set10_Debias').addEventListener('click', function () { sendRequest('card_words_response10', jsonFileContent10, 'download10', 'card10') });

document.getElementById('download1').addEventListener("click", function() { download('Set1_Debiasing.json', currentResult)});
document.getElementById('download2').addEventListener("click", function() { download('Set2_Debiasing.json', currentResult)});
document.getElementById('download3').addEventListener("click", function() { download('Set3_Debiasing.json', currentResult)});
document.getElementById('download4').addEventListener("click", function() { download('Set4_Debiasing.json', currentResult)});
document.getElementById('download5').addEventListener("click", function() { download('Set5_Debiasing.json', currentResult)});
document.getElementById('download6').addEventListener("click", function() { download('Set6_Debiasing.json', currentResult)});
document.getElementById('download7').addEventListener("click", function() { download('Set7_Debiasing.json', currentResult)});
document.getElementById('download8').addEventListener("click", function() { download('Set8_Debiasing.json', currentResult)});
document.getElementById('download9').addEventListener("click", function() { download('Set9_Debiasing.json', currentResult)});
document.getElementById('download10').addEventListener("click", function() { download('Set10_Debiasing.json', currentResult)});