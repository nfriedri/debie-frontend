document.getElementById('RECEIVE').addEventListener('click', getTest);

function getTest() {
    fetch('http://127.0.0.1:5000/REST/RandomString', {
            method: 'GET',
            mode: 'cors'
        })
        .then((res) => res.json())
        .then((data) => {
            let output = '<h2>Test Result</h2>';
            output += `
          <ul>
            <li>API Text: ${data.data}</li>
          </ul>  
          `;
            document.getElementById('card').innerHTML = output;
        })
}