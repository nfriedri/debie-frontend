var vectorTypeEnum = 'fasttext';
var debiasMethodEnum = 'gbdd';
var enablePCA = "full";
var currentResult = {};

function getSelectionValues() {
    let activeVectorType = document.getElementById('word_embedding').getElementsByClassName('active')[0]
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
    evaluationMethodEnum = activeEvalMethod.id;
    console.log("Current Values: " + vectorTypeEnum + " " + evaluationMethodEnum);
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
    var argSet1 = document.getElementById('argument_set1').value;
    var argSet2 = document.getElementById('argument_set2').value;
    var postDict1 = {T1: targetSet1, T2: targetSet2, A1: argSet1, A2: argSet2};
    var postJson = JSON.stringify(postDict1);
    startSpinner(target_id);
    var url = 'http://127.0.0.1:5000/REST/debiasing';
    //var url = 'http://wifo5-29.informatik.uni-mannheim.de:8000/REST/debiasing';
    url += '/' + enablePCA + '/' + debiasMethodEnum;
    url += '?space=' + vectorTypeEnum + '&augments=True';
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
          output += `
                <h6 class="card-subtitle mt-3 mb-2">Download results as JSON: </h6>
          `;
          document.getElementById(downloadButtonID).removeAttribute("hidden");
        }
        document.getElementById(target_id).innerHTML = output;
          //createDownloadJson(resultVar, sourceFile, data);
        currentResult = data;
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
  
  document.getElementById('Debias1').addEventListener("click", function () { sendRequest('card_response', 'download', 'card') });

  document.getElementById('download').addEventListener("click", function() { download('Set1_Debiasing.json', currentResult)});
  