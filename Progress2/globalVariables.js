app.beaconRegions = []
var back_header_temp;
app.employee = []
var db = null;
var emp = [];
var email;
var count = 1;
var id_hint_pno;
var my_flag_pp = 0;
var log_value = 0;
var log_details = [];
var log_count = 0;
var sessionId, selectquery, img_counter;
var url_login = "https://www.rollbase.com/rest/api/login?loginName=" + "sakkinen" + "&password=" + "Susmitha@2712" + "&output=json";
var url_email = "https://www.rollbase.com/rest/api/selectQuery?sessionId=";
var url_details1 = "https://www.rollbase.com/rest/api/getRecord?objName=" + "Profile2" + "&sessionId=";
var url_details2 = "&fieldList=" + "City,Email,CandidateGender,CandidateStartDate,CandidateName,CandidatePhoneNumber,CandidatePhoto";
var url_details3 = "&fieldList=" + "CandidateName";
var sensor_id, beacon_proximity, page_id, b, flag = 0;
var candidateName, candidateEmail, candidateGender, candidateCity, candidateDate, candidatePhoto,interview_date,greatestTime;
var log = 0;
var profile_id;
var count2 = 1;
var currentBeacon = "";
var appState = [{
    uuid: '',
    major: 0,
    minor: 0,
    isPlaying: 0,
    id: '',
    files: ''
}]
var flag_img = [0, 0, 0, 0];