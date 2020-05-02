var mainContainer = document.getElementById('container1')
var startButton = document.getElementById('start');
var confirmButton = document.getElementById('selectSpace');
var preDefinedBtn = document.getElementById('preDefinedButton');
var selfDefinedBtn = document.getElementById('selfDefinedButton');
var continueDebiasing = document.getElementById('continueDebiasing');
var augmentSwitch = document.getElementById('augmentSwitch');

//Expand & Start App
function expandAppSelection(){
    if (mainContainer.getAttribute('hidden') == null){
        mainContainer.setAttribute('hidden', 'true');
    }
    else {
        mainContainer.removeAttribute('hidden');
    }
}

function expandContainer(containerID){
    container = document.getElementById(containerID);
    if (container.getAttribute('hidden') == null){
        container.setAttribute('hidden', 'true');
    }
    else {
        container.removeAttribute('hidden');
        container.scrollIntoView({behavior: 'smooth'});
    }
}

function hideContainer(containerID){
    document.getElementById(containerID).setAttribute('hidden', 'true');
}

startButton.addEventListener("click", function() {expandAppSelection(); expandContainer('spaceContainer')});

confirmButton.addEventListener("click", function() {
    if (document.getElementById('embeddingSpaces').getElementsByClassName('active')[0].id == 'upload'){
        hideContainer('specificationContainer');
        expandContainer('uploadContainer');

    }
    else{
        hideContainer('uploadContainer');
        expandContainer('specificationContainer');
    }
});


preDefinedBtn.addEventListener("click", function() {
    expandContainer('preDefinedContainer');
    hideContainer('selfDefinedContainer');
});


selfDefinedBtn.addEventListener("click", function() {
    expandContainer('selfDefinedContainer');
    hideContainer('preDefinedContainer');
});


augmentSwitch.addEventListener("onclick", function() {
    div = document.getElementById('augmentationsInput');
    if (div.getAttribute('hidden') == null){
        div.setAttribute('hidden', 'true');
    }
    else {
        div.removeAttribute('hidden');
    }
});

continueDebiasing.addEventListener("click", function() {
    expandContainer('debiasingContainer');
});

//Upload or Spceification


