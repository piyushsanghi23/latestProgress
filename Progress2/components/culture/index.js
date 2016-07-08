app.display = function () {
  var resultsField = document.getElementById("video1");
    console.log(resultsField);
    //'+appState.files+'
    //resultsField.innerHTML = ' ';
    //alert(b.rssi + " " + b.uuid);
    // if (b.rssi < -65) {
    //var currentMessage = resultsField.innerHTML;
    var html1 = "<video autoplay='autoplay' controls><source src='videos/first.mp4' type='video/mp4'></video>";
    // var html = '<h1>' + appState.uuid + '<br>' + appState.state + '</h1><video autoplay="autoplay" width="320" height="240" controls><source src="videos/first.mp4" type="video/mp4"></video>';
    resultsField.innerHTML = html1;
   
}