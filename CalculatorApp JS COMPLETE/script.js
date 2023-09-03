//This fuction clears all the values
function clearScreen() {
    document.getElementById("result").value = "";
}


//This funtion displays all values
function dispaly(value) {
    document.getElementById("result").value += value;
}

//This funtion evaluates the expression and returns the result
function calculate() {
    var p = document.getElementById("result").value;
    var q = eval(p)
    document.getElementById("result").value = q;
}