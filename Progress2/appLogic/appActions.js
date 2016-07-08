app.appActions = function () {
    if(!flag){
    flag=1;
    if (appState.state == 'on') {
        var resultsField = document.getElementById("beacon");
        //alert(resultsField);
        //alert("hello");
        
        if (appState.uuid == "f7028248-68b4-4f65-8087-d5d5cb3a1cbd") {
        alert('123');
            $('#video-display source').attr('src', appState.files);
            $("#video-display source")[0].load();
            var html1 = "<video autoplay='autoplay' controls><source src='videos/first.mp4' type='video/mp4'></video>";
            // var html = '<h1>' + appState.uuid + '<br>' + appState.state + '</h1><video autoplay="autoplay" width="320" height="240" controls><source src="videos/first.mp4" type="video/mp4"></video>';
            resultsField.innerHTML = html1;
        } else {
            var html1 = "<h1>hello</h1>";

            resultsField.innerHTML = html1;
        }

    }
    }
}