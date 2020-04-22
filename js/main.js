startButton = document.getElementById('start');
container = document.getElementById('container1')

function expandFunctionSelection(){
    container.removeAttribute('hidden');
}

startButton.addEventListener("click", function () {expandFunctionSelection()});