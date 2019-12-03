var vectorTypeEnum = 'fasttext';
var evaluationMethodEnum = 'all';
var fileContent = '';
var resultData = {};

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

function getSelectionValues() {
  let activeVectorType = document.getElementById('word_embedding').getElementsByClassName('active')[0]
  let activeEvalMethod = document.getElementById('evaluation_methods').getElementsByClassName('active')[0];
  vectorTypeEnum = activeVectorType.id;
  evaluationMethodEnum = activeEvalMethod.id;
  console.log("Current Values: " + vectorTypeEnum + " " + evaluationMethodEnum);
}

function getToggleSelection(){
  switcher = document.getElementById('vectorsEnabled');
  console.log(switcher.checked);
  if (switcher.checked == false){
    return 'false';
  }
  if (switcher.checked == true){
    return 'true';
  }
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

function sendRequest() {
  startSpinner('card_response')
  getSelectionValues()
  var targetSet1 = document.getElementById('target_set1').value
  var targetSet2 = document.getElementById('target_set2').value
  var argSet1 = document.getElementById('argument_set1').value
  var argSet2 = document.getElementById('argument_set2').value
  var url = 'http://127.0.0.1:5000/REST/bias-evaluation'
  url += '/' + evaluationMethodEnum;
  url += '?space=' + vectorTypeEnum;
  url += '&vectors=false'
  var postDict1 = {T1: targetSet1, T2: targetSet2, A1: argSet1, A2: argSet2 }
  var postJson = JSON.stringify(postDict1)
  console.log(postJson)
  document.getElementById('card').removeAttribute("hidden");
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
        console.log(statusFlag);
        console.log(data);
        let output = '';
        if (statusFlag != 200){
          output += `
          <h5 class="card-title mb-3">ERROR</h5>
          <p>${statusFlag} ${data.message}</p> 
          <p>Please check your input and try again.</p>
          `
        }
        else{
          switch (evaluationMethodEnum) {
            case 'all':
              output += `
                <h5 class="card-title mb-3">Evaluation results: </h5>
                <table class="table table-borderless table-dark">
                  <tbody>
                    <tr>
                    <th scope="row">ECT with argument set 1: </th>
                    <td>${data.ect_value1}</td>
                    </tr>
                    <tr>
                    <th scope="row">ECT p-value with argument set 1: </th>
                    <td>${data.p_value1}</td>
                    </tr>
                    <tr>
                    <th scope="row">ECT with argument set 2: </th>
                    <td>${data.ect_value2}</td>
                    </tr>
                    <tr>
                    <th scope="row">ECT p-value with argument set 2: </th>
                    <td>${data.p_value2}</td>
                    </tr>
                    <tr>
                    <th scope="row">BAT score: </th>
                    <td>${data.bat_result}</td>
                    </tr>
                    <tr>
                    <th scope="row">WEAT effect size: </th>
                    <td>${data.weat_effect_size}</td>
                    </tr>
                    <tr>
                    <th scope="row">WEAT p-value: </th>
                    <td>${data.weat_pvalue}</td>
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
                    <th scope="row">ECT with argument set 1: </th>
                    <td>${data.ect_value1}</td>
                    </tr>
                    <tr>
                    <th scope="row">ECT p-value with argument set 1: </th>
                    <td>${data.p_value1}</td>
                    </tr>
                    <tr>
                    <th scope="row">ECT with argument set 2: </th>
                    <td>${data.ect_value2}</td>
                    </tr>
                    <tr>
                    <th scope="row">ECT p-value with argument set 2: </th>
                    <td>${data.p_value2}</td>
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
                      <th scope="row">BAT score: </th>
                      <td>${data.bat_result}</td>
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
                  <th scope="row">WEAT effect size: </th>
                  <td>${data.weat_effect_size}</td>
                  </tr>
                  <tr>
                  <th scope="row">WEAT p-value: </th>
                  <td>${data.weat_pvalue}</td>
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
                      <td>${data.k_means}</td>
                    </tr>
                  </tbody>
                </table> 
              `;
              break;
          }
          output += `
                <h6 class="card-subtitle mt-3 mb-2">Download results as JSON: </h6>
         `;
          document.getElementById('download').removeAttribute("hidden");
          createDownloadJson(resultData, postDict1, data)
        }
        document.getElementById('card_response').innerHTML = output;
      })
  } catch (error) {
    console.error();
  }
}

function sendRequestJSON(){
  startSpinner('card_response2')
  getSelectionValues()
  var url = 'http://127.0.0.1:5000/REST/bias-evaluation'
  url += '/' + evaluationMethodEnum;
  url += '?space=' + vectorTypeEnum;
  url += '&vectors='+ getToggleSelection()
  console.log(fileContent);
  document.getElementById('card2').removeAttribute("hidden");
  var statusFlag = 200;

  try {
    const response = fetch(url, {
        method: 'POST',
        body: fileContent,
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
        console.log(statusFlag);
        console.log(data);
        let output = '';
        if (statusFlag != 200){
          output += `
          <h5 class="card-title mb-3">ERROR</h5>
          <p>${statusFlag} ${data.message}</p> 
          <p>Please check your input and try again.</p>
          `
        }
        else{
          switch (evaluationMethodEnum) {
            case 'all':
              output += `
                <h5 class="card-title mb-3">Evaluation results: </h5>
                <table class="table table-borderless table-dark">
                  <tbody>
                    <tr>
                    <th scope="row">ECT with argument set 1: </th>
                    <td>${data.ect_value1}</td>
                    </tr>
                    <tr>
                    <th scope="row">ECT p-value with argument set 1: </th>
                    <td>${data.p_value1}</td>
                    </tr>
                    <tr>
                    <th scope="row">ECT with argument set 2: </th>
                    <td>${data.ect_value2}</td>
                    </tr>
                    <tr>
                    <th scope="row">ECT p-value with argument set 2: </th>
                    <td>${data.p_value2}</td>
                    </tr>
                    <tr>
                    <th scope="row">BAT score: </th>
                    <td>${data.bat_result}</td>
                    </tr>
                    <tr>
                    <th scope="row">WEAT effect size: </th>
                    <td>${data.weat_effect_size}</td>
                    </tr>
                    <tr>
                    <th scope="row">WEAT p-value: </th>
                    <td>${data.weat_pvalue}</td>
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
                    <th scope="row">ECT with argument set 1: </th>
                    <td>${data.ect_value1}</td>
                    </tr>
                    <tr>
                    <th scope="row">ECT p-value with argument set 1: </th>
                    <td>${data.p_value1}</td>
                    </tr>
                    <tr>
                    <th scope="row">ECT with argument set 2: </th>
                    <td>${data.ect_value2}</td>
                    </tr>
                    <tr>
                    <th scope="row">ECT p-value with argument set 2: </th>
                    <td>${data.p_value2}</td>
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
                      <th scope="row">BAT score: </th>
                      <td>${data.bat_result}</td>
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
                  <th scope="row">WEAT effect size: </th>
                  <td>${data.weat_effect_size}</td>
                  </tr>
                  <tr>
                  <th scope="row">WEAT p-value: </th>
                  <td>${data.weat_pvalue}</td>
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
                      <td>${data.k_means}</td>
                    </tr>
                  </tbody>
                </table> 
              `;
              break;
          }
          output += `
                <h6 class="card-subtitle mt-3 mb-2">Download results as JSON: </h6>
         `;
          document.getElementById('download2').removeAttribute("hidden");
          createDownloadJson2(data)
        }
        document.getElementById('card_response2').innerHTML = output;
      })
  } catch (error) {
    console.error();
  }

}

function createDownloadJson2(evalResults){
  resultData['EmbeddingSpace'] = vectorTypeEnum;
  resultData['EvaluationMethods'] = evaluationMethodEnum;
  var content = JSON.parse(fileContent);
  console.log(evalResults.weat_effect_size);

  resultData['T1'] = content.T1;
  resultData['T2'] = content.T2;
  resultData['A1'] = content.A1;
  resultData['A2'] = content.A2;
  switch(evaluationMethodEnum){
    case 'all':
      resultData['ECT-Value1'] = evalResults.ect_value1;
      resultData['ECT-P-Value1'] = evalResults.p_value1;
      resultData['ECT-Value2'] = evalResults.ect_value2;
      resultData['ECT-P-Value2'] = evalResults.p_value2;
      resultData['BAT-Value'] = evalResults.bat_result;
      resultData['WEAT-effect-size'] = evalResults.weat_effect_size;
      resultData['WEAT-p-value'] = evalResults.weat_effect_size;
      resultData['K-Means-value'] = evalResults.k_means;
      console.log(resultVar);
      break;
    case 'ect':
      resultData['ECT-Value1'] = evalResults.ect_value1;
      resultData['ECT-P-Value1'] = evalResults.p_value1;
      resultData['ECT-Value2'] = evalResults.ect_value2;
      resultData['ECT-P-Value2'] = evalResults.p_value2;
      break;
    case 'bat':
      resultData['BAT-Value'] = evalResults.bat_result;
      break;
    case 'weat':
      resultData['WEAT-effect-size'] = evalResults.weat_effect_size;
      resultData['WEAT-p-value'] = evalResults.weat_effect_size;
      break;
    case 'kmeans':
      resultData['K-Means-value'] = evalResults.k_means;
      break;  
  }
  
  console.log(resultData)
}

function createDownloadJson(resultVar, sourceFile, evalResults){
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
      console.log(resultVar);
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

document.getElementById('Evaluate1').addEventListener("click", function() { sendRequest() });
document.getElementById('download').addEventListener("click", function() { download('Evaluation.json', resultData)})
document.getElementById('Evaluate2').addEventListener("click", function() { 
  sendRequestJSON();
});
document.getElementById('download2').addEventListener("click", function() { download('Evaluation.json', resultData)})
