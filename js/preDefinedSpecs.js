const element = document.getElementById('tables')
const numberOfResources = 10;
const resourcePath = '/res/test_set';
const resourceType = '.json';
const tables = '';
var tableNameArray = [];
var tableIconArray = [];
var tableContentArray = [];
var tableButtonArray = [];

async function loadTestData() {   
    console.log('TestData Loading')
    for (i=1; i<=numberOfResources; i++){
        //console.log(i)
        var filePath = resourcePath + i + resourceType;
        var tableName = 'table' + i;
        var tableIcon = 'tableIcon' + i;
        var tableContent = 'tableContent' + i;
        var tableButton = 'tableButton' + i;
        //console.log(tableName +' '+ tableIcon + ' ' + tableContent + " " + tableButton)
        await fetch(filePath)
        .then(response => response.json())
        .then((data) => {
            var dataName = data.Name;
            var T1 = data.T1;
            var T2 = data.T2;
            var A1 = data.A1;
            var A2 = data.A2;
            let output = "";
            output += `
            <div class="my-4">
                <table class="table table-borderless table-dark my-0">
                    <thead>
                        <tr>
                            <th scope="col" id="${tableIcon}"><a class="btn" role="button"> <i class="icon-angle-down"></i> </a></th>
                            <th scope="col" id="${tableName}">${data.Name}</th>
                        </tr>
                    </thead>
                    <tbody id="${tableContent}" hidden>
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
                </table>
                <div class="container my-0" id="${tableButton}" style="background-color: #212429;" hidden>
                    <button type="button" class="btn btn-primary btn-lg my-2" style="background-color: #222E58; border-color: #FFFFFF;" id="selectSpec">Select</button> 
                </div>
            </div>
            <script>
                function show(content, button, icon){
                    console.log('Clicked in function');
                    var element = document.getElementById(content);
                    var btn = document.getElementById(button);
                    var iconn = document.getElementById(icon);
                    if (element.getAttribute('hidden') == null) {
                        element.setAttribute('hidden', 'true');  
                        btn.setAttribute('hidden', 'true');
                        iconn.innerHTML =  \`<a class="btn" role="button"> <i class="icon-angle-down"></i> </a>\`;        
                        return 1;
                    }
                    else {
                        element.removeAttribute('hidden');
                        btn.removeAttribute('hidden');
                        iconn.innerHTML =  \`<a class="btn" role="button"> <i class="icon-angle-right"></i> </a>\`;
                        return 0;
                    }
                }

                document.getElementById("${tableName}").addEventListener("click", function() {show("${tableContent}", "${tableButton}", "${tableIcon}")});
                document.getElementById("${tableIcon}").addEventListener("click", function() {show("${tableContent}", "${tableButton}", "${tableIcon}")});
                document.getElementById("${tableButton}").addEventListener("click", function() { selectSpecification("${dataName}", "${T1}", "${T2}", "${A1}", "${A2}")});
            </script>
            `;
            element.innerHTML += output;
        })
    }
    var scripts = element.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
        eval(scripts[i].innerText);
    }
}

window.onload = loadTestData();

function selectSpecification(name, t1, t2, a1, a2) {
    selectionContainer = document.getElementById('selectionContainer')
    selectionContainer.removeAttribute('hidden');
    var targetTable = document.getElementById('selectedSpec');
    targetTable.innerHTML = `<table class="table table-borderless table-dark my-0">
                                <thead>
                                    <tr>
                                        <th scope="col"><a class="btn" role="button"> <i class="icon-angle-down"></i> </a></th>
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
    selectionContainer.scrollIntoView();   
}