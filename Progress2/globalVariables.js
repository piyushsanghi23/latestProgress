app.beaconRegions = [

    {
        id: 'first',
        uuid: 'f7028248-68b4-4f65-8087-d5d5cb3a1cbd',
        major: 1000,
        minor: 3333

	},
    {
        id: 'second',
        uuid: '2f234454-cf6d-4a0f-adf2-f4911ba9ffa9',
        major: 1,
        minor: 1
    },
     {
        id: 'third',
        uuid: '2f234454-cf6d-4a0f-adf2-f4911ba9ffa8',
        major: 1,
        minor: 1
    }
    ]
var sessionId,selectquery;
var url_login="https://www.rollbase.com/rest/api/login?loginName=" + "sakkinen" + "&password=" + "Susmitha@2712" + "&output=json";
var url_email="https://www.rollbase.com/rest/api/selectQuery?sessionId=";
var url_details1="https://www.rollbase.com/rest/api/getRecord?objName=" + "Profile2" + "&sessionId=";
var url_details2="&fieldList=" + "City,Email,CandidateGender,CandidateStartDate,CandidateName,CandidatePhoneNumber,CandidatePhoto";
var sensor_id, beacon_proximity, page_id, b, flag = 0;
var candidateName,candidateEmail,candidateGender,candidateCity,candidateInterviewDate,candidatePhoto;
var log=0;
var profile_id;
var currentBeacon="";
var appState = [{
    uuid: '',
     major:0,
    minor:0,
    isPlaying: 0,
    id: '',
    files:''
}]