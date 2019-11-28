var vectorTypeEnum = 'fasttext';
var evaluationMethodEnum = 'all';
var resultData = {};

function getSelectionValues() {
  let activeVectorType = document.getElementById('word_embedding').getElementsByClassName('active')[0]
  let activeEvalMethod = document.getElementById('evaluation_methods').getElementsByClassName('active')[0];
  vectorTypeEnum = activeVectorType.id;
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

function getWordListVecRepresentation() {
  startSpinner('card')
  getSelectionValues()
  var targetSet1 = document.getElementById('target_set1').value
  var targetSet2 = document.getElementById('target_set2').value
  var argSet1 = document.getElementById('argument_set1').value
  var argSet2 = document.getElementById('argument_set2').value
  var url = 'http://127.0.0.1:5000/REST/bias_evaluation'
  
  var postDict1 = { EmbeddingSpace: vectorTypeEnum, Method: evaluationMethodEnum, T1: targetSet1, T2: targetSet2, A1: argSet1, A2: argSet2 }
  var postJson = JSON.stringify(postDict1)
  console.log(postJson)
  document.getElementById('card').removeAttribute("hidden");

  try {
    const response = fetch(url, {
        method: 'POST',
        body: postJson,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(postJson);
        console.log(data)
        let output = '';
        switch (evaluationMethodEnum) {
          case 'allBtn':
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
          case 'ectBtn':
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
          case 'batBtn':
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
          case 'weatBtn':
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
          case 'kmeansBtn':
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
        document.getElementById('card_response').innerHTML = output;
        document.getElementById('download').removeAttribute("hidden");
        createDownloadJson(resultData, postDict1, data)
      })
  } catch (error) {
    console.error();
  }
}

function createDownloadJson(resultVar, sourceFile, evalResults){
  resultVar['EmbeddingSpace'] = sourceFile.EmbeddingSpace;
  resultVar['EvaluationMethods'] = sourceFile.Method;
  switch(evaluationMethodEnum){
    case 'allBtn':
      resultVar['ECT-Value1'] = evalResults.ect_value1;
      resultVar['ECT-P-Value1'] = evalResults.p_value1;
      resultVar['ECT-Value2'] = evalResults.ect_value2;
      resultVar['ECT-P-Value2'] = evalResults.p_value2;
      resultVar['BAT-Value'] = evalResults.bat_result;
      resultVar['WEAT-effect-size'] = evalResults.weat_effect_size;
      resultVar['WEAT-p-value'] = evalResults.weat_effect_size;
      resultVar['K-Means-value'] = evalResults.k_means;
      break;
    case 'ectBtn':
      resultVar['ECT-Value1'] = evalResults.ect_value1;
      resultVar['ECT-P-Value1'] = evalResults.p_value1;
      resultVar['ECT-Value2'] = evalResults.ect_value2;
      resultVar['ECT-P-Value2'] = evalResults.p_value2;
      break;
    case 'batBtn':
      resultVar['BAT-Value'] = evalResults.bat_result;
      break;
    case 'weatBtn':
      resultVar['WEAT-effect-size'] = evalResults.weat_effect_size;
      resultVar['WEAT-p-value'] = evalResults.weat_effect_size;
      break;
    case 'kmeansBtn':
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

document.getElementById('Evaluate1').addEventListener("click", function() { getWordListVecRepresentation() });
document.getElementById('download').addEventListener("click", function() { download('Evaluation.json', resultData)})
