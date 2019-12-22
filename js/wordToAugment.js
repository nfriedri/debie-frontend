

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

function getWordAugments() {
  word = document.getElementById('augmentSend').value;
  console.log(word);
  var url = 'http://127.0.0.1:5000/REST/augmentations/single';
  //var url = 'http://wifo5-29.informatik.uni-mannheim.de:8000/REST/augmentations/single';
  url += '?word=' + word;
  console.log(url);
  document.getElementById('card1').removeAttribute('hidden');
  startSpinner('card1');
  try {
    const response = fetch(url, {
        method: 'GET',
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        let output = '';
        output += `
          <div class="card-body" id="response"></div>
            <h5 class="card-title px-2">Result:</h5>
            <p class="card-text px-2">Word: ${data.word}</p>
            <p class="card-text px-2">Augmentations:   `
        let augments = data.augments;
        for (var i=0; i<augments.length; i++){
          output += augments[i] + " "
        }
        output += `</p>
            <br>
          </div>
            `;
        //console.log(output);
        document.getElementById('card1').innerHTML = output;
      })
  } catch (error) {
    console.error();
  }
}

function getWordAugments10k() {
  var words = document.getElementById('augmentSend10k').value;
  var url = 'http://127.0.0.1:5000/REST/augmentations/first10k';
  //var url = 'http://wifo5-29.informatik.uni-mannheim.de:8000/REST/augmentations/first10k';
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
        words = data.words;
        augments = data.augments;
        for (var i = 0; i < words.length; i++) {
          output += `
          <p class="card-text px-2">Word: ${words[i]}</p>
          <p class="card-text px-2">Augmentations:   `
          let singleAugments = augments[i];
          for (var k=0; k<singleAugments.length; k++){
            output += singleAugments[k] + " "
          }
          output += '</p><br>'
        }
        output += `
          </div>
          `;
        document.getElementById('card2').innerHTML = output;
      })
  } catch (error) {
    console.error();
  }
}

document.getElementById('SEND_word').addEventListener('click', function(){
  getWordAugments();
});
document.getElementById('SEND_word10k').addEventListener('click', function(){
  getWordAugments10k();
});
