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
var result1 = {};
var result2 = {};
var result3 = {};
var result4 = {};
var result5 = {};
var result6 = {};
var result7 = {};
var result8 = {};
var result9 = {};
var vectorTypeEnum = 'fasttext';
var evaluationMethodEnum = 'all';

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

function sendRequest(target_id, sourceFile, resultVar, downloadButtonID, cardID) {
  //word = document.getElementById('word2Send').value;
  //console.log(word);
  //dataJSON = {data: word};
  getSelectionValues();
  startSpinner(target_id)
  const url = 'http://127.0.0.1:5000/REST/bias_evaluation';
  sourceFile['EmbeddingSpace'] = vectorTypeEnum;
  sourceFile['Method'] = evaluationMethodEnum;
  console.log(sourceFile);
  document.getElementById(cardID).removeAttribute("hidden");
  console.log("card1 visible");

  try {
    const response = fetch(url, {
      method: 'POST',
      body: JSON.stringify(sourceFile),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        let output;
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
                  <tr>
                  <th scope="row">K-Means result: </th>
                  <td>${data.k_means}</td>
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
        document.getElementById(downloadButtonID).removeAttribute("hidden");
        document.getElementById(target_id).innerHTML = output;
        createDownloadJson(resultVar, sourceFile, data);
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

document.getElementById('Set1_Evaluate').addEventListener("click", function () { sendRequest('card_words_response', jsonFileContent1, result1, 'download1', 'card1') });
document.getElementById('Set2_Evaluate').addEventListener('click', function () { sendRequest('card_words_response2', jsonFileContent2, result2, 'download2', 'card2') });
document.getElementById('Set3_Evaluate').addEventListener('click', function () { sendRequest('card_words_response3', jsonFileContent3, result3, 'download3', 'card3') });
document.getElementById('Set4_Evaluate').addEventListener('click', function () { sendRequest('card_words_response4', jsonFileContent4, result4, 'download4', 'card4') });
document.getElementById('Set5_Evaluate').addEventListener('click', function () { sendRequest('card_words_response5', jsonFileContent5, result5, 'download5', 'card5') });
document.getElementById('Set6_Evaluate').addEventListener('click', function () { sendRequest('card_words_response6', jsonFileContent6, result6, 'download6', 'card6') });
document.getElementById('Set7_Evaluate').addEventListener('click', function () { sendRequest('card_words_response7', jsonFileContent7, result7, 'download7', 'card7') });
document.getElementById('Set8_Evaluate').addEventListener('click', function () { sendRequest('card_words_response8', jsonFileContent8, result8, 'download8', 'card8') });
document.getElementById('Set9_Evaluate').addEventListener('click', function () { sendRequest('card_words_response9', jsonFileContent9, result9, 'download9', 'card9') });

document.getElementById('download1').addEventListener("click", function() { download('Set1_Evaluation.json', result1)})
document.getElementById('download2').addEventListener("click", function() { download('Set2_Evaluation.json', result2)})
document.getElementById('download3').addEventListener("click", function() { download('Set3_Evaluation.json', result3)})
document.getElementById('download4').addEventListener("click", function() { download('Set4_Evaluation.json', result4)})
document.getElementById('download5').addEventListener("click", function() { download('Set5_Evaluation.json', result5)})
document.getElementById('download6').addEventListener("click", function() { download('Set6_Evaluation.json', result6)})
document.getElementById('download7').addEventListener("click", function() { download('Set7_Evaluation.json', result7)})
document.getElementById('download8').addEventListener("click", function() { download('Set8_Evaluation.json', result8)})
document.getElementById('download9').addEventListener("click", function() { download('Set9_Evaluation.json', result9)})
