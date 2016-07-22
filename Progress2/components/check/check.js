function profileDisplay() {
    //alert("7");
    setTimeout(function() {
            //alert("hello");
            document.getElementById("display_name").innerHTML = candidateName;
            document.getElementById("display_email").innerHTML = candidateEmail;
            document.getElementById("display_gender").innerHTML = candidateGender;
            document.getElementById("display_city").innerHTML = candidateCity;
            //document.getElementById("display_interviewDate").innerHTML = candidateInterviewDate;
            var image = new Image();
            image.src = 'data:image/png;base64,' + candidatePhoto;
            //alert(image.src)
            document.getElementById("profile2").appendChild(image);            
        },
        1000);


}