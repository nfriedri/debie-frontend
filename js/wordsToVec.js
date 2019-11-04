document.getElementById('SEND_words').addEventListener('click', sendRequest);

function sendRequest() {
    words = document.getElementById('words2Send').value;
    console.log(words);
    const url = 'http://127.0.0.1:5000/REST/POST_words';
    dataJSON = {data: words};

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
            let output = '<h2>Test Result</h2>';
            output += `
            <ul>
                <a>Word: ${data.words}</a>
                <br>
                <a>Vector:</a>
                <br>
                <a>${data.vectors}</a>
            </ul>  
            `;            
        document.getElementById('card_words_response').innerHTML = output;
        })
    } 
    catch (error) {
        console.error();
    }
}