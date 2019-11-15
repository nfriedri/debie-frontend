const jsonFile_1 = '/res/test_set_1.json';
var jsonFileContent1 = {};
const jsonFile_2 = '/res/test_set_2.json';
var jsonFileContent2 = {};
const elementID_1 = 'table_1';
const elementID_2 = 'table_2';
var vectorTypeEnum = 'fasttext';
var evaluationMethodEnum = 'all';


window.onload = doByStart()

function doByStart() {
  loadTestData(jsonFile_1, elementID_1, jsonFileContent1);
  loadTestData(jsonFile_2, elementID_2, jsonFileContent2);
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



function sendRequest(target_id, sourceFile) {
  //word = document.getElementById('word2Send').value;
  //console.log(word);
  //dataJSON = {data: word};
  getSelectionValues();
  startSpinner(target_id)
  const url = 'http://127.0.0.1:5000/REST/bias_evaluation';
  sourceFile['EmbeddingSpace'] = vectorTypeEnum;
  sourceFile['Method'] = evaluationMethodEnum;
  console.log(sourceFile);

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
              <a>ECT with argument set 1: ${data.ect_value1}</a>
              <a>ECT p-value with argument set 1: ${data.p_value1}</a>
              <br>
              <a>ECT with argument set 2: ${data.ect_value2}</a>
              <a>ECT p-value with argument set 2: ${data.p_value2}</a>
              <br>
              <a>BAT score: ${data.bat_result}</a>
              <br>
              <a>WEAT effect size: ${data.weat_effect_size}</a>
              <a>WEAT p-value: ${data.weat_pvalue}</a>            
            `;
            break;
          case 'ectBtn':
              output += `
              <h5 class="card-title">ECT Results</h5>
              <a>ECT with argument set 1: ${data.ect_value1}</a>
              <a>ECT p-value with argument set 1: ${data.p_value1}</a>
              <br>
              <a>ECT with argument set 2: ${data.ect_value2}</a>
              <a>ECT p-value with argument set 2: ${data.p_value2}</a>
              <br>
              `;
            break;
          case 'batBtn':
              output += `
              <h5 class="card-title">BAT Results</h5>
              <a>BAT score: ${data.bat_result}</a>
              <br>
            `;
            break;
          case 'weatBtn':
              output += `
              <h5 class="card-title">WEAT Results</h5>
              <a>WEAT effect size: ${data.weat_effect_size}</a>
              <a>WEAT p-value: ${data.weat_pvalue}</a>
              <br> 
            `;
            break;
          case 'kmeansBtn':
              output += `
              <h5 class="card-title">KMeans Results</h5>
              <a>K-Means result: ${data.k_means}</a>
              <br>
            `;
            break;
        }
        output += `
              <h6 class="card-subtitle mt-3 mb-2 text-muted">Download results as JSON: </h6>
              <a style="button" id="downloadxxx">
              <button type="button" class="btn btn-primary btn-lg sticky-right my-2" id="download" width="25%"> Evaluate </button> 
              <image src="/img/download.png" height="10%" width="10%">
                <script> 
                  console.log('Script is working!')
                  document.getElementById("download").addEventListener("click", function(){
                  var text = 'FIRST TEST';
                  var filename = 'test.json';
                  download(text, filename);
                }, false);
                </script>
              </a> 
        `
//        <a href="" id="download" download>
//                <image src="/img/download.png" height="10%" width="10%">
        document.getElementById(target_id).innerHTML = output;
      })
  } catch (error) {
    console.error();
  }
}

function download(filename, content){
  var element = document.createElement('a');
  element.style.display = 'none';
  element.setAttribute('href', 'data:text/plain;charset=utf-8' + encodeURIComponent(content));
  element.setAttribute('download', filename);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
/*
document.getElementById("download").addEventListener("click", function(){
  var text = 'FIRST TEST';
  var filename = 'test.json';
  download(text, filename);
}, false);
*/

document.getElementById('Set1_Evaluate').addEventListener("click", function () { sendRequest('card_words_response', jsonFileContent1) });
document.getElementById('Set2_Evaluate').addEventListener('click', function () { sendRequest('card_words_response2', jsonFileContent2) });
//document.getElementById('fasttextBtn').addEventListener('click', function(){selectVectorType()});
//document.getElementById('skipgramBtn').addEventListener('click', function(){selectVectorType()});
//document.getElementById('gloveBtn').addEventListener('click', function(){selectVectorType()});