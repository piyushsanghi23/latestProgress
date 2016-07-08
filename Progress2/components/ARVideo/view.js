function startVuforia() {
    navigator.VuforiaPlugin.startVuforia(
        'www/targets/StonesAndChips.xml',
        ['progress_logo-ConvertImage'],
        'WELCOME TO PROGRESS SOFTWARE :) ',
        'AXS9OVT/////AAAAATStnsnnbEO1kRZ4TqvtXQ5LsMDYdBArHiQXGEV90mrNq7vT4yN+uIELTozmJgdzC38rzKY5Y/0wRjo3kIsegKdgidnaEQ6TJ2qp/frENI9cI2icfrHdJZwjJj2AIdUHXlUmQuAsTnTineiv+kALk12YKPOLfiX3zoxOhLWLKk14P/LpsJb9f/+vlrARLe7FCRV6ZYVJiiOzMQ3dCakSS0d/JrtBv04wtEbgiy5QUGWKIC07IH3hNGg0vlsn/5pfA8vlirMxasrPxJLzbSEz/UKKn9gQ1l34RCdcSLp6REUnCyq0PuOaE1VcO6gje1uYwmg/zQ7OqRY9PJMSms/Tu2OfGZuMP2bBnYZ3WS63Tlg4',
        function (data) {
            console.log(data);
            //alert("Image found: " + data.imageName);
        },
        function (data) {
           // alert("Error: " + data);
        }
    );
}

function  stopVuforia() {        
    navigator.VuforiaPlugin.stopVuforia(function (data) {            
        console.log(data);            
        if (data.success == 'true') {      
            //window.open("components/homeView/view.html",'_self');
             //navigator.app.backHistory()
          
            //alert('TOO SLOW! You took too long to find an image.');            
        } else {                
            //alert('Couldn\'t stop Vuforia\n' + data.message);            
        }        
    }, function (data) {            
        console.log("Error stopping Vuforia:");            
        console.log(data);        
    });    
}