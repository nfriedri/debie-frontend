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
const elementID_1 = 'table_1';
const elementID_2 = 'table_2';
const elementID_3 = 'table_3';
const elementID_4 = 'table_4';
const elementID_5 = 'table_5';
const elementID_6 = 'table_6';
const elementID_7 = 'table_7';
const elementID_8 = 'table_8';
const elementID_9 = 'table_9';
var currentResult = {}
var vectorTypeEnum = 'fasttext';
var debiasMethodEnum = 'all';
var enablePCA = "full";

window.onload = doByStart()

function doByStart() {
  loadTestData(jsonFile_1, elementID_1, jsonFileContent1);
  loadTestData(jsonFile_2, elementID_2, jsonFileContent2);
  loadTestData(jsonFile_3, elementID_3, jsonFileContent3);
  loadTestData(jsonFile_4, elementID_4, jsonFileContent4);
  loadTestData(jsonFile_5, elementID_5, jsonFileContent5);
  loadTestData(jsonFile_6, elementID_6, jsonFileContent6);
  loadTestData(jsonFile_7, elementID_7, jsonFileContent7);
  loadTestData(jsonFile_8, elementID_8, jsonFileContent8);
  loadTestData(jsonFile_9, elementID_9, jsonFileContent9);
  getSelectionValues();
}

function loadTestData(jsonFile, elementID, target) {
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
      document.getElementById(elementID).innerHTML = output;
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
  var url = 'http://127.0.0.1:5000/REST/debiasing';
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
        output += `
              <h6 class="card-subtitle mt-3 mb-2">Download results as JSON: </h6>
        `;
        document.getElementById(downloadButtonID).removeAttribute("hidden");  
        //createDownloadJson(resultVar, sourceFile, data);
        currentResult = data;
      }
      document.getElementById(target_id).innerHTML = output;
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

document.getElementById('Set1_Debias').addEventListener("click", function () { sendRequest('card_words_response', jsonFileContent1, 'download1', 'card1') });
document.getElementById('Set2_Debias').addEventListener('click', function () { sendRequest('card_words_response2', jsonFileContent2, 'download2', 'card2') });
document.getElementById('Set3_Debias').addEventListener('click', function () { sendRequest('card_words_response3', jsonFileContent3, 'download3', 'card3') });
document.getElementById('Set4_Debias').addEventListener('click', function () { sendRequest('card_words_response4', jsonFileContent4, 'download4', 'card4') });
document.getElementById('Set5_Debias').addEventListener('click', function () { sendRequest('card_words_response5', jsonFileContent5, 'download5', 'card5') });
document.getElementById('Set6_Debias').addEventListener('click', function () { sendRequest('card_words_response6', jsonFileContent6, 'download6', 'card6') });
document.getElementById('Set7_Debias').addEventListener('click', function () { sendRequest('card_words_response7', jsonFileContent7, 'download7', 'card7') });
document.getElementById('Set8_Debias').addEventListener('click', function () { sendRequest('card_words_response8', jsonFileContent8, 'download8', 'card8') });
document.getElementById('Set9_Debias').addEventListener('click', function () { sendRequest('card_words_response9', jsonFileContent9, 'download9', 'card9') });

document.getElementById('download1').addEventListener("click", function() { download('Set1_Debiasing.json', currentResult)});
document.getElementById('download2').addEventListener("click", function() { download('Set2_Debiasing.json', currentResult)});
document.getElementById('download3').addEventListener("click", function() { download('Set3_Debiasing.json', currentResult)});
document.getElementById('download4').addEventListener("click", function() { download('Set4_Debiasing.json', currentResult)});
document.getElementById('download5').addEventListener("click", function() { download('Set5_Debiasing.json', currentResult)});
document.getElementById('download6').addEventListener("click", function() { download('Set6_Debiasing.json', currentResult)});
document.getElementById('download7').addEventListener("click", function() { download('Set7_Debiasing.json', currentResult)});
document.getElementById('download8').addEventListener("click", function() { download('Set8_Debiasing.json', currentResult)});
document.getElementById('download9').addEventListener("click", function() { download('Set9_Debiasing.json', currentResult)});
