function tick() {
    // alert("in tick");

    for (z in flag_img)
        if (flag_img[z] == 1) {

            //alert('img'+z);
            document.getElementById('img' + z).src = 'images/' + z + '.jpg';
            clearInterval(img_counter);
        }
}

function tick_page(x, video_url, r) {
    alert("in fucntion");
    if (x == 1 && r == x - 1) {
        document.getElementById('idea_room_div').style.display = 'none';
        setInterval(function () {
            
            document.getElementById('idea_room_div_final').style.display = 'block';
        }, 4000);
        
     document.getElementById('idea_room_div_final').style.display = 'none';
        document.getElementById("title_video").innerHTML = "Paragraph changed in 1 !";
        document.getElementById('video_container').style.display = 'block';
    } else if (x == 2) {
         document.getElementById('gym_room_div').style.display = 'none';
        setInterval(function () {
           
            document.getElementById('gym_room_div_final').style.display = 'block';
        }, 4000);
 document.getElementById('gym_room_div_final').style.display = 'none';
        document.getElementById("title_video").innerHTML = "Paragraph changed in 2 !";
        document.getElementById('video_container').style.display = 'block';
    } else if (x == 3) {
         document.getElementById('pantree_room_div').style.display = 'none';
        setInterval(function () {
           
            document.getElementById('pantree_room_div_final').style.display = 'block';
        }, 4000);
 document.getElementById('pantree_room_div_final').style.display = 'none';
        document.getElementById("title_video").innerHTML = "Paragraph changed in 3 !";
        document.getElementById('video_container').style.display = 'block';
    } else {
         document.getElementById('lunch_room_div').style.display = 'none';
        setInterval(function () {
           
            document.getElementById('lunch_room_div_final').style.display = 'block';
        }, 4000);
 document.getElementById('lunch_room_div_final').style.display = 'none';
        document.getElementById("title_video").innerHTML = "Paragraph changed in 4 !";
        document.getElementById('video_container').style.display = 'block';
    }

}

function idea_Room() {
    vibrate();
    my_flag_pp = 1;
    id_hint_pno = 0;
    document.getElementById('idea_room_div').style.display = 'block';
    document.getElementById('first_block').style.display = 'none';
    document.getElementById('second_block').style.display = 'none';
    document.getElementById('discover_txt').style.display = 'none';

}

function back(ID) {
    my_flag_pp = 0;
    document.getElementById(ID).style.display = 'none';
    document.getElementById('first_block').style.display = 'block';
    document.getElementById('second_block').style.display = 'block';
    document.getElementById('discover_txt').style.display = 'block';


}

function lunch_Room() {
    my_flag_pp = 1;
    id_hint_pno = 1;
    document.getElementById('lunch_room_div').style.display = 'block';
    document.getElementById('first_block').style.display = 'none';
    document.getElementById('second_block').style.display = 'none';
    document.getElementById('discover_txt').style.display = 'none';

}

function gym_Room() {
    my_flag_pp = 1;
    id_hint_pno = 2;
    document.getElementById('gym_room_div').style.display = 'block';
    document.getElementById('first_block').style.display = 'none';
    document.getElementById('second_block').style.display = 'none';
    document.getElementById('discover_txt').style.display = 'none';

}

function pantree() {
    my_flag_pp = 1;
    id_hint_pno = 3;
    document.getElementById('pantree_room_div').style.display = 'block';
    document.getElementById('first_block').style.display = 'none';
    document.getElementById('second_block').style.display = 'none';
    document.getElementById('discover_txt').style.display = 'none';

}