var rating, comment;

function feedback_smiley_click(id) {
    rating = id.replace(/[^\d]/g, '');
    if (rating == '1') {
        document.getElementById("fed_img_1").src = "images/GreatSelectedAsset 1@1x.png";
        document.getElementById("fed_img_2").src = "images/GoodNormalAsset 17@1x.png";
        document.getElementById("fed_img_3").src = "images/BadNormalAsset 18@1x.png";
        document.getElementById("fed_img_4").src = "images/WorstNormalAsset 19@1x.png";

        rating = 'Excellent';
    } else if (rating == '2') {
        document.getElementById("fed_img_2").src = "images/GoodSelectedAsset 2@1x.png";
        document.getElementById("fed_img_1").src = "images/GreatNormalAsset 16@1x.png";
        document.getElementById("fed_img_3").src = "images/BadNormalAsset 18@1x.png";
        document.getElementById("fed_img_4").src = "images/WorstNormalAsset 19@1x.png";

        rating = 'Good';
    } else if (rating == '3') {
        document.getElementById("fed_img_3").src = "images/BadSelectedAsset 3@1x.png";
        document.getElementById("fed_img_1").src = "images/GreatNormalAsset 16@1x.png";
        document.getElementById("fed_img_2").src = "images/GoodNormalAsset 17@1x.png";

        document.getElementById("fed_img_4").src = "images/WorstNormalAsset 19@1x.png";

        rating = 'Average';
    } else if (rating == '4') {
        document.getElementById("fed_img_4").src = "images/WorstSelectedAsset 4@1x.png";
        document.getElementById("fed_img_1").src = "images/GreatNormalAsset 16@1x.png";
        document.getElementById("fed_img_2").src = "images/GoodNormalAsset 17@1x.png";
        document.getElementById("fed_img_3").src = "images/BadNormalAsset 18@1x.png";

        rating = 'Bad';
    }

}
function submitted(){
    document.getElementById('afterSubmit').style.display = 'block';
    document.getElementById('beforeSubmit').style.display = 'none';
}

function submitFeedback() {
    comment = document.getElementById('textArea1').value;
    document.getElementById('afterSubmit').style.display = 'block';
    document.getElementById('beforeSubmit').style.display = 'none';
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
                url: "https://www.rollbase.com/rest/api/createRecord?&sessionId=" + result.sessionId + "&objName=Feedback3&useIds=false&ProfileId=" + profile_id + "&Rating=" + rating + "&Comments=" + comment + "&Date=" + today,
                type: 'POST',
                success: function (result) {

                   // alert('sucess:' + JSON.stringify(result));
                },
                error: function (result) {
                    alert('error:' + JSON.stringify(result));
                },
            });
        },
        error: function (result) {
            alert(JSON.stringify(result));
        },
    });

}