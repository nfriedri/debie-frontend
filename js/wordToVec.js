var vectorTypeEnum = 'fasttext';

// Starts a spinner inside the parameter html-object
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

// Updates the values of the currently selected parameters
function getSelectionValues() {
  let activeVectorType = document.getElementById('word_embedding').getElementsByClassName('active')[0];
  vectorTypeEnum = activeVectorType.id;
  console.log("Current Values: " + vectorTypeEnum);
}


//Start word2Vec request with one word
function getWordVecRepresentation() {
  word = document.getElementById('word2Send').value;
  console.log(word);
  getSelectionValues();
  //var url = 'http://127.0.0.1:5000/REST/vectors/single';
  var url = 'http://wifo5-29.informatik.uni-mannheim.de:8000/REST/vectors/single';
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
        let vec = data.vector.toString().replace(/,/g, ' ');
        output += `
          <div class="card-body" id="response"></div>
            <h5 class="card-title px-2">Result:</h5>
            <p class="card-text px-2" id="word">Word: ${data.word}</p>
            <p class="card-text px-2 pb-2" id="vec">Vector:<br>${vec}</p>
          </div>  
            `;
        console.log(output);
        currentVec = data.vector;
        document.getElementById('card1').innerHTML = output;
      })
  } catch (error) {
    console.error();
  }
}

//Start word2Vec request with a word list
function getWordListVecRepresentation() {
  getSelectionValues();
  var words = document.getElementById('words2Send').value;
  //var url = 'http://127.0.0.1:5000/REST/vectors/multiple';
  var url = 'http://wifo5-29.informatik.uni-mannheim.de:8000/REST/vectors/multiple';
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
        var words = data.word;
        var vectors = data.vector;
        for (var i = 0; i < words.length; i++) {
          let vec = vectors[i].toString().replace(/,/g, ' ');
          output += `
          <p class="card-text px-2">Word: ${words[i]}</p>
          <p class="card-text px-2 pb-2">Vector:<br>${vec}</p>
          <br>
          `;
        }
        document.getElementById('card2').innerHTML = output;
      })
  } catch (error) {
    console.error();
  }
}

// Set Event Listeners
document.getElementById('SEND_word').addEventListener('click', function() {getWordVecRepresentation()});
document.getElementById('SEND_words').addEventListener('click', function() {getWordListVecRepresentation()});
