
const inputJSON = document.getElementById('customFile');
const debiasBtn = document.getElementById('Debias2');
var fileContent = '';
var result = '';
var vectorTypeEnum = 'fasttext';
var debiasMethodEnum = 'gbdd';
var vectorsEnabled = 'false';

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
            output += `
                  <h6 class="card-subtitle mt-3 mb-2">Download results as JSON: </h6>
            `;
            document.getElementById(downloadButtonID).removeAttribute("hidden");
          }
          document.getElementById(target_id).innerHTML = output;
            //createDownloadJson(resultVar, sourceFile, data);
          currentResult = data;
          })
        }
       catch (error) {
        console.error();
    }
}

function createDownloadOwnJson(resultVar, sourceFile, evalResults){
    resultVar['EmbeddingSpace'] = vectorTypeEnum;
    resultVar['EvaluationMethods'] = evaluationMethodEnum;
    switch(evaluationMethodEnum){
      case 'all':
        resultVar['ECT-Value1'] = evalResults.ect_value1;
        resultVar['ECT-P-Value1'] = evalResults.p_value1;
        resultVar['ECT-Value2'] = evalResults.ect_value2;
        resultVar['ECT-P-Value2'] = evalResults.p_value2;
        resultVar['BAT-Value'] = evalResults.bat_result;
        resultVar['WEAT-effect-size'] = evalResults.weat_effect_size;
        resultVar['WEAT-p-value'] = evalResults.weat_effect_size;
        resultVar['K-Means-value'] = evalResults.k_means;
        break;
      case 'ect':
        resultVar['ECT-Value1'] = evalResults.ect_value1;
        resultVar['ECT-P-Value1'] = evalResults.p_value1;
        resultVar['ECT-Value2'] = evalResults.ect_value2;
        resultVar['ECT-P-Value2'] = evalResults.p_value2;
        break;
      case 'bat':
        resultVar['BAT-Value'] = evalResults.bat_result;
        break;
      case 'weat':
        resultVar['WEAT-effect-size'] = evalResults.weat_effect_size;
        resultVar['WEAT-p-value'] = evalResults.weat_effect_size;
        break;
      case 'kmeans':
        resultVar['K-Means-value'] = evalResults.k_means;
        break;  
    }
    resultVar['T1'] = sourceFile.T1;
    resultVar['T2'] = sourceFile.T2;
    resultVar['A1'] = sourceFile.A1;
    resultVar['A2'] = sourceFile.A2;
    console.log(resultVar)
}
  
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

debiasBtn.addEventListener("click", function() { 
    sendJSONRequest("card_response2", fileContent, result, "download2", "card2" );
    fileContent = '';
 });

 document.getElementById('download2').addEventListener("click", function() { downloadOwn('Evaluation.json', result)})
