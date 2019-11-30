document.getElementById('SEND_word').addEventListener('click', getWordVecRepresentation);
document.getElementById('SEND_words').addEventListener('click', getWordListVecRepresentation);

var vectorTypeEnum = 'fasttext';

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

function getSelectionValues() {
  let activeVectorType = document.getElementById('word_embedding').getElementsByClassName('active')[0];
  vectorTypeEnum = activeVectorType.id;
  console.log("Current Values: " + vectorTypeEnum);
}

function getWordVecRepresentation() {
  word = document.getElementById('word2Send').value;
  console.log(word);
  getSelectionValues
  var url = 'http://127.0.0.1:5000/REST/vectors/single';
  url += '?space=' + vectorTypeEnum + '&word=' + word;
  console.log(url);
  document.getElementById('card1').removeAttribute('hidden');
  startSpinner('card1');
  try {
    const response = fetch(url, {
        method: 'GET',
      })
      .then((res) => res.json())
      .then((data) => {
        let output = '';
        output += `
          <div class="card-body" id="response"></div>
            <h5 class="card-title px-2">Result:</h5>
            <p class="card-text px-2">Word: ${data.word}</p>
            <p class="card-text px-2 pb-2">Vector:<br>${data.vector}</p>
          </div>  
            `;
        console.log(output);
        document.getElementById('card1').innerHTML = output;
      })
  } catch (error) {
    console.error();
  }
}

function getWordListVecRepresentation() {
  var words = document.getElementById('words2Send').value;var url = 'http://127.0.0.1:5000/REST/vectors/multiple';
  url += '?space=' + vectorTypeEnum;
  dataJSON = { data: words };
  document.getElementById('card2').removeAttribute('hidden');
  startSpinner('card2');
  try {
    const response = fetch(url, {
        method: 'POST',
        body: JSON.stringify(dataJSON),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        let output = `<div class="card-body" id="response2"></div>
                      <h5 class="card-title px-2">Result:</h5><br>`;
        words = data.word;
        vectors = data.vector;
        for (var i = 0; i < words.length; i++) {
          output += `
          <p class="card-text px-2">Word: ${words[i]}</p>
          <p class="card-text px-2 pb-2">Vector:<br>${vectors[i]}</p>
          <br>
          `;
        }
        document.getElementById('card2').innerHTML = output;
      })
  } catch (error) {
    console.error();
  }
}


