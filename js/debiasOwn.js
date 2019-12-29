var vectorTypeEnum = 'fasttext';
var debiasMethodEnum = 'gbdd';
var enablePCA = "full";
var enableAugments = "true";
var currentResult = {};

function getSelectionValues() {
    let activeVectorType = document.getElementById('word_embedding').getElementsByClassName('active')[0]
    let activeDebiasMethod = document.getElementById('debias_methods').getElementsByClassName('active')[0];
    let switcher = document.getElementById('pcaSwitch');
    if (switcher.checked == false){
      enablePCA = "full";
    }
    else if (switcher.checked == true){
      enablePCA = "pca";
    }
    let switcher2 = document.getElementById('augmentSwitch');
    if (switcher2.checked == false){
      enableAugments = "true";
    }
    else if (switcher2.checked == true){
      enableAugments = "false";
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
    debiasMethodEnum = activeDebiasMethod.id;
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

  function sendRequest(target_id, downloadButtonID, cardID) {
    getSelectionValues();  
    var targetSet1 = document.getElementById('target_set1').value;
    var targetSet2 = document.getElementById('target_set2').value;
    var argSet1 = document.getElementById('attribute_set1').value;
    var argSet2 = document.getElementById('attribute_set2').value;
    var postDict1 = {};
    if (enableAugments == 'false'){
      var augSetT1 = document.getElementById('augments1').value;
      var augSetT2 = document.getElementById('augments2').value;
      var augSetA1 = document.getElementById('augments3').value;
      var augSetA2 = document.getElementById('augments4').value;
      postDict1 = {T1: targetSet1, T2: targetSet2, A1: argSet1, A2: argSet2, AugT1: augSetT1, AugT2: augSetT2, AugA1: augSetA1, AugA2: augSetA2};
    }
    else{
      postDict1 = {T1: targetSet1, T2: targetSet2, A1: argSet1, A2: argSet2};
    }
    var postJson = JSON.stringify(postDict1);
    startSpinner(target_id);
    //var url = 'http://127.0.0.1:5000/REST/debiasing';
    var url = 'http://wifo5-29.informatik.uni-mannheim.de:8000/REST/debiasing';
    url += '/' + enablePCA + '/' + debiasMethodEnum;
    url += '?space=' + vectorTypeEnum + '&augments=' + enableAugments;
    console.log(postJson);
    document.getElementById(cardID).removeAttribute("hidden");
    console.log("card visible");
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
              <canvas id="chart1"></canvas>
            </div>
            `;
          }
          output += `
                <h6 class="card-subtitle mt-3 mb-2">Download results as JSON: </h6>
          `;
          document.getElementById(downloadButtonID).removeAttribute("hidden");
        }
        document.getElementById(target_id).innerHTML = output;
        currentResult = data;
        if (enablePCA == 'pca'){
          console.log('here')
          drawChart(currentResult);
        }
      })
    } catch (error) {
      console.error();
    }
  }
  
  function createDownloadJson(resultVar, sourceFile){
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
  
  document.getElementById('Debias1').addEventListener("click", function () { sendRequest('card_response', 'download', 'card') });

  document.getElementById('download').addEventListener("click", function() { download('Set_Debiasing.json', currentResult)});
  