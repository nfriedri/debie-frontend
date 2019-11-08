jsonFile_1 = '/res/test_set_1.json';
jsonFile_2 = '/res/test_set_2.json';
elementID_1 = 'table_1';
elementID_2 = 'table_2';
window.onload = doByStart;

function doByStart() {
    loadTestData(jsonFile_1, elementID_1);
    loadTestData(jsonFile_2, elementID_2);
}

function loadTestData(jsonFile, elementID) {
    fetch(jsonFile)
        .then(response => response.json())
        .then((data) => {
            console.log(data);
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
        })
}

document.getElementById('Set1_Evaluate').addEventListener('click', sendRequest);

function sendRequest() {
    //word = document.getElementById('word2Send').value;
    //console.log(word);
    //dataJSON = {data: word};
    testSet1 = "aster clover hyacinth marigold poppy azalea crocus iris orchid rose blue-bell daffodil lilac pansy tulip buttercup daisy lily peony violet carnation gladiola magnolia petunia zinnia";
    testSet2 = "ant caterpillar flea locust spider bedbug centipede fly maggot tarantula bee cockroach gnat mosquito termite beetle cricket hornet moth wasp blackfly dragonfly horsefly roach weevil";
    argSet1 = "caress freedom health love peace cheer friend heaven loyal pleasure diamond gentle honest lucky rainbow diploma gift honor miracle sunrise family happy laughter paradise vacation";
    argSet2 = "abuse crash filth murder sickness accident death grief poison stink assault disaster hatred pollute tragedy divorce jail poverty ugly cancer kill rotten vomit agony prison";
    const url = 'http://127.0.0.1:5000/REST/get_bias_evaluations';
    dataJSON = { T1: testSet1, T2: testSet2, A1: argSet1, A2: argSet2 };

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
                let output;
                output += `
            <ul>
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
            </ul>  
            `;
                document.getElementById('card_words_response').innerHTML = output;
            })
    } catch (error) {
        console.error();
    }
}