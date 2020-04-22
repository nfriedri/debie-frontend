
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

// Start augmentation-retrieval request for one word
function getWordAugments() {
  word = document.getElementById('augmentSend').value;
  console.log(word);
  //var url = 'http://127.0.0.1:5000/REST/augmentations/single';
  var url = 'http://wifo5-29.informatik.uni-mannheim.de:8000/REST/augmentations/single';
  url += '?word=' + word;
  console.log(url);
  document.getElementById('card1').removeAttribute('hidden');
  startSpinner('card1');
  var statusFlag = 200;
  try {
    const response = fetch(url, {
        method: 'GET',
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
      }
        document.getElementById('card1').innerHTML = output;
      
      })
  } catch (error) {
    console.error();
  }
}

//Start augmentation-retrieval request for a word list
function getWordAugments10k() {
  var words = document.getElementById('augmentSend10k').value;
  //var url = 'http://127.0.0.1:5000/REST/augmentations/multiple';
  var url = 'http://wifo5-29.informatik.uni-mannheim.de:8000/REST/augmentations/multiple';
  dataJSON = { data: words };
  document.getElementById('card2').removeAttribute('hidden');
  startSpinner('card2');
  var statusFlag = 200;
  try {
    const response = fetch(url, {
        method: 'POST',
        body: JSON.stringify(dataJSON),
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
      }
        document.getElementById('card2').innerHTML = output;
      })
  } catch (error) {
    console.error();
  }
}

//Set Event Listeners
document.getElementById('SEND_word').addEventListener('click', function(){
  getWordAugments();
});
document.getElementById('SEND_word10k').addEventListener('click', function(){
  getWordAugments10k();
});
