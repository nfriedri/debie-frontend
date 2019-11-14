function getWordListVecRepresentation(objectID) {
  startSpinner(objectID)
  var targetSet1 = document.getElementById('target_set1').value
  var targetSet2 = document.getElementById('target_set2').value
  var argSet1 = document.getElementById('argument_set1').value
  var argSet2 = document.getElementById('argument_set2').value
  var url = 'http://127.0.0.1:5000/REST/bias_evaluation'
  getSelectionValues()
    //url += '?vecspace=' + vectorTypeEnum + '?method=' + evaluationMethodEnum;

  var postDict1 = { T1: targetSet1, T2: targetSet2, A1: argSet1, A2: argSet2 }
  var postJson = JSON.stringify(postDict1)
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
        let output;
        output += `
                <a>ECT with argument set 1: ${data.ect_value1}</a>
                <br>
                <a>ECT p-value with argument set 1: ${data.p_value1}</a>
                <br>
                <a>ECT with argument set 2: ${data.ect_value2}</a>
                <br>
                <a>ECT p-value with argument set 2: ${data.p_value2}</a>
                <br>
                <a>BAT score: ${data.bat_result}</a>
                <br>
                <a>WEAT effect size: ${data.weat_effect_size}</a>
                <br>
                <a>WEAT p-value: ${data.weat_pvalue}</a> 
            `;
        document.getElementById(objectID).innerHTML = output;
      })
  } catch (error) {
    console.error();
  }
}

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


document.getElementById('Evaluate1').addEventListener("click", function() { getWordListVecRepresentation('response1') });