document.getElementById('sendViaAPI').addEventListener('click', sendRequest);

function sendRequest() {
    data = document.getElementById('textToBeSend').value;
    console.log(data);
    const url = 'http://127.0.0.1:5000/json';
    dataJSON = { name: data};

    try {
        const response = fetch(url, {
        method: 'POST',
        body: JSON.stringify(dataJSON),
        headers: {
        'Content-Type': 'application/json'
        }
    });
    const json = response.json();
    console.log('Success:', JSON.stringify(json));
    } 
    catch (error) {
        console.error();
    }
}