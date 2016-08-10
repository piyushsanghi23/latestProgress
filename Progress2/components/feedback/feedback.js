var rating,comment;

function feedback_smiley_click(id) {
    rating = id.replace(/[^\d]/g, '');
    if (rating == '1')
        rating = 'Excellent';
    else if (rating == '2')
        rating = 'Good';
    else if (rating == '3')
        rating = 'Average';
    else if (rating == '4')
        rating = 'Bad';

}

function submitFeedback() {
    comment = document.getElementById('textArea').value;
    //alert(rating + "			" + comment);
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    var today = mm + '/' + dd + '/' + yyyy;
    $.ajax({
        url: url_login,
        type: 'GET',
        success: function (result) {
           // alert(JSON.stringify(result));
            $.ajax({
                url: "https://www.rollbase.com/rest/api/createRecord?&sessionId="+result.sessionId+"&objName=Feedback3&useIds=false&ProfileId=" + profile_id + "&Rating=" + rating + "&Comments=" + comment + "&Date=" + today,
                type: 'POST',
                success: function (result) {

                   // alert('sucess:'+JSON.stringify(result));
                },
                error: function (result) {
                    //alert('error:'+JSON.stringify(result));
                },
            });
        },
        error: function (result) {
            alert(JSON.stringify(result));
        },
    });

}