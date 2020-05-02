const element = document.getElementById('tables');
var startButton = document.getElementById('startEvaluation');
const numberOfResources = 10;
const resourcePath = '/res/test_set';
const resourceType = '.json';
const tables = '';
var tableNameArray = [];
var tableIconArray = [];
var tableContentArray = [];
var tableButtonArray = [];

async function loadTestData() {   
    for (i=1; i<=numberOfResources; i++){
        var filePath = resourcePath + i + resourceType;
        var tableName = 'table' + i;
        var tableIcon = 'tableIcon' + i;
        var tableContent = 'tableContent' + i;
        var tableButton = 'tableButton' + i;
        var tableT1 = 'tableT1' + i;
        var tableT2 = 'tableT2' + i;
        var tableA1 = 'tableA1' + i;
        var tableA2 = 'tableA2' + i;
        await fetch(filePath)
        .then(response => response.json())
        .then((data) => {
            let output = "";
            output += `
            <div class="my-4">
                <table class="table table-borderless table-dark my-0">
                    <thead>
                        <tr>
                            <th scope="col" id="${tableIcon}"><a class="btn" role="button"> <i class="fas fa-angle-down"></i> </a></th>
                            <th scope="col" id="${tableName}">${data.Name}</th>
                        </tr>
                    </thead>
                    <tbody id="${tableContent}" hidden>
                        <tr>
                            <th scope="row">T1</th>
                            <td id="${tableT1}">${data.T1}</td>
                        </tr>
                        <tr>
                            <th scope="row">T2</th>
                            <td id="${tableT2}">${data.T2}</td>
                        </tr>
                        <tr>
                            <th scope="row">A1</th>
                            <td id="${tableA1}">${data.A1}</td> 
                        </tr>
                        <tr>
                            <th scope="row">A2</th>
                            <td id="${tableA2}">${data.A2}</td> 
                        </tr>
                    </tbody> 
                </table>
                <div class="container my-0" id="${tableButton}" style="background-color: #212429;" hidden>
                    <button type="button" class="btn btn-primary btn-lg my-2" style="background-color: #222E58; border-color: #FFFFFF;" id="selectSpec">Select</button> 
                </div>
            </div>
            `;
            element.innerHTML += output;
            
        })
    }
}

function selectSpecification(tableName, tableT1, tableT2, tableA1, tableA2) {
    selectionContainer = document.getElementById('selectionJumbo')
    selectionContainer.removeAttribute('hidden');
    var targetTable = document.getElementById('selectedSpec');
    name = document.getElementById(tableName).innerText;
    t1 = document.getElementById(tableT1).innerText;
    t2 = document.getElementById(tableT2).innerText;
    a1 = document.getElementById(tableA1).innerText;
    a2 = document.getElementById(tableA2).innerText;
    targetTable.innerHTML = `<table class="table table-borderless table-dark my-0">
                                <thead>
                                    <tr>
                                        <th scope="col"><a class="btn" role="button"> <i class="fas fa-angle-right"></i> </a></th>
                                        <th scope="col" id="valuesName">${name}</th>
                                    </tr>
                                </thead>
                                <tbody id="selectedValues">
                                    <tr>
                                        <th scope="row">T1</th>
                                        <td id="valuesT1">${t1}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">T2</th>
                                        <td id="valuesT2">${t2}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">A1</th>
                                        <td id="valuesA1">${a1}</td> 
                                    </tr>
                                    <tr>
                                        <th scope="row">A2</th>
                                        <td id="valuesA2">${a2}</td> 
                                    </tr>
                                </tbody> 
                            </table>`;
    selectionContainer.scrollIntoView({behavior: 'smooth'});
    startButton.removeAttribute('disabled');
}

function show(content, button, icon){
    var element = document.getElementById(content);
    var btn = document.getElementById(button);
    var iconn = document.getElementById(icon);
    if (element.getAttribute('hidden') == null) {
        element.setAttribute('hidden', 'true');  
        btn.setAttribute('hidden', 'true');
        iconn.innerHTML =  `<a class="btn" role="button"> <i class="fas fa-angle-down"></i> </a>`;        
        return 1;
    }
    else {
        element.removeAttribute('hidden');
        btn.removeAttribute('hidden');
        iconn.innerHTML =  `<a class="btn" role="button"> <i class="fas fa-angle-right"></i> </a>`;
        return 0;
    }
}


async function setTableEventListeners(){
    for (i=1; i<=numberOfResources; i++){
        var tableName = 'table' + i;
        var tableIcon = 'tableIcon' + i;
        var tableContent = 'tableContent' + i;
        var tableButton = 'tableButton' + i;
        var tableT1 = 'tableT1' + i;
        var tableT2 = 'tableT2' + i;
        var tableA1 = 'tableA1' + i;
        var tableA2 = 'tableA2' + i;
        await addEvents(tableContent, tableButton, tableIcon, tableName, tableT1, tableT2, tableA1, tableA2);
    }
}

async function addEvents(tableContent, tableButton, tableIcon, tableName, tableT1, tableT2, tableA1, tableA2){
    document.getElementById(tableName).addEventListener("click", function() {show(tableContent, tableButton, tableIcon); console.log(tableContent);});
    document.getElementById(tableIcon).addEventListener("click", function() {show(tableContent, tableButton, tableIcon)});
    document.getElementById(tableButton).addEventListener("click", function() {selectSpecification(tableName, tableT1, tableT2, tableA1, tableA2)});
}


window.onload = loadTestData().then(function() {setTableEventListeners()});
