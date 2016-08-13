function tick() {
    // alert("in tick");

    for (z in flag_img)
        if (flag_img[z] == 1) {

            //alert('img'+z);
            document.getElementById('img' + z).src = 'images/' + z + '.jpg';
            clearInterval(img_counter);
        }
}

function done() {
    document.getElementById('video_container').style.display = 'none';
    //more code for stopping the video to play 
}

function tick_page(x, video_url, r) {
    alert("in fucntion");
    if (x == 0 && r == x) {
        document.getElementById('idea_room_div').style.display = 'none';
        document.getElementById('idea_room_div_final').style.display = 'block';
        setTimeout(function () {
            document.getElementById('idea_room_div_final').style.display = 'none';
        }, 4000);
        document.getElementById("title_video").innerHTML = "Paragraph changed in 1 !";
        setTimeout(function () {
            document.getElementById('video_container').style.display = 'block';
        }, 4500);
    } else if (x == 2 && r == x) {
        document.getElementById('gym_room_div').style.display = 'none';

        document.getElementById('gym_room_div_final').style.display = 'block'
        setTimeout(function () {
            document.getElementById('gym_room_div_final').style.display = 'none';
        }, 4000);
        document.getElementById("title_video").innerHTML = "Paragraph changed in 2 !";
        setTimeout(function () {
            document.getElementById('video_container').style.display = 'block';
        }, 4500);
    } else if (x == 3 && r == x) {
        document.getElementById('pantree_room_div').style.display = 'none';


        document.getElementById('pantree_room_div_final').style.display = 'block';

        setTimeout(function () {
            document.getElementById('pantree_room_div_final').style.display = 'none';
        }, 4000);
        document.getElementById("title_video").innerHTML = "Paragraph changed in 3 !";
        setTimeout(function () {
            document.getElementById('video_container').style.display = 'block';
        }, 4500);
    } else {
        document.getElementById('lunch_room_div').style.display = 'none';


        document.getElementById('lunch_room_div_final').style.display = 'block';

        setTimeout(function () {
            document.getElementById('lunch_room_div_final').style.display = 'none';;
        }, 4000);
        document.getElementById("title_video").innerHTML = "Paragraph changed in 4 !";
        setTimeout(function () {
            document.getElementById('video_container').style.display = 'block';
        }, 4500);
    }

}

function idea_Room() {
    vibrate();
    my_flag_pp = 1;
    back_header_temp='idea_room_div';
    id_hint_pno = 0;
    document.getElementById('backButton').style.display = 'none';
    document.getElementById('backButton1').style.display = 'block';
    document.getElementById('idea_room_div').style.display = 'block';
    document.getElementById('first_block').style.display = 'none';
    document.getElementById('second_block').style.display = 'none';
    document.getElementById('discover_txt').style.display = 'none';

}

function back(ID) {
    my_flag_pp = 0;
    document.getElementById(ID).style.display = 'none';
    document.getElementById('backButton1').style.display = 'none';
    document.getElementById('backButton').style.display = 'block';
    document.getElementById('backButton1').style.display = 'none';
    document.getElementById('first_block').style.display = 'block';
    document.getElementById('second_block').style.display = 'block';
    document.getElementById('discover_txt').style.display = 'block';
    done();

}

function lunch_Room() {
    my_flag_pp = 1;
    id_hint_pno = 1;
    back_header_temp='lunch_room_div';
    document.getElementById('lunch_room_div').style.display = 'block';
    document.getElementById('backButton').style.display = 'none';
    document.getElementById('backButton1').style.display = 'block';
    document.getElementById('first_block').style.display = 'none';
    document.getElementById('second_block').style.display = 'none';
    document.getElementById('discover_txt').style.display = 'none';

}

function gym_Room() {
    my_flag_pp = 1;
    id_hint_pno = 2;
    back_header_temp='gym_room_div';
    document.getElementById('backButton').style.display = 'none';
    document.getElementById('backButton1').style.display = 'block';
    document.getElementById('gym_room_div').style.display = 'block';
    document.getElementById('first_block').style.display = 'none';
    document.getElementById('second_block').style.display = 'none';
    document.getElementById('discover_txt').style.display = 'none';

}

function pantree() {
    my_flag_pp = 1;
    id_hint_pno = 3;
    back_header_temp='pantree_room_div';
    document.getElementById('backButton').style.display = 'none';
    document.getElementById('backButton1').style.display = 'block';
    document.getElementById('pantree_room_div').style.display = 'block';
    document.getElementById('first_block').style.display = 'none';
    document.getElementById('second_block').style.display = 'none';
    document.getElementById('discover_txt').style.display = 'none';

}
function debug(){
     document.getElementById('video_container').style.display = 'block';
}