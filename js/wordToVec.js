document.getElementById('SEND_word').addEventListener('click', sendRequest);

function sendRequest() {
    word = document.getElementById('word2Send').value;
    console.log(word);
    const url = 'http://127.0.0.1:5000/REST/POST_word';
    dataJSON = {data: word};

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
                <a>Word: ${data.word}</a>
                <br>
                <a>Vector:</a>
                <br>
                <a>${data.vector}</a>
            </ul>  
            `;            
        document.getElementById('card_word_response').innerHTML = output;
        })
    } 
    catch (error) {
        console.error();
    }
}