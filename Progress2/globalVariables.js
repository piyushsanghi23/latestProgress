app.beaconRegions = [

    {
        id: 'first',
        uuid: 'f7028248-68b4-4f65-8087-d5d5cb3a1cbd',
        major: 1000,
        minor: 3333,
        url: 'videos/incubator_x264.mp4',
        img_id:'img1',
        source_img:'images/idea1.png'

	},
    {
        id: 'second',
        uuid: '2f234454-cf6d-4a0f-adf2-f4911ba9ffa9',
        major: 1,
        minor: 1,
        url: 'videos/lunchRoom_x264.mp4',
        img_id:'img2',
        source_img:'images/gym1.png'
        
    },
    {
        id: 'third',
        uuid: '2f234454-cf6d-4a0f-adf2-f4911ba9ffa8',
        major: 1,
        minor: 1,
        url:'videos/lunchRoom_x264.mp4',
        img_id:'img3',
        source_img:'images/lunch1.png'

    }
    ]
app.employee=[
    {
        round:'HR Round',
        time:'10.00 am-10:30 am',
        image:'images/profile.png',
        name: 'srikanth',
        role: 'Principal Designer, UXD'
        
    },
    {
        round:'Technical 1',
        time:'11.00 am-11:30 am',
        image:'images/icon.png',
        name: 'Kiran Babu',
        role: 'Software Engineer'
        
    },
    {
        round:'Technical 2',
        time:'01.00 am-01:30 pm',
        image:'images/icon.png',
        name: 'Ramesh Pakalapati',
        role: 'Software Engineer'
        
    }
    
]
var db = null;
var emp=[];
var count=1;
var sessionId, selectquery,img_counter;
var url_login = "https://www.rollbase.com/rest/api/login?loginName=" + "sakkinen" + "&password=" + "Susmitha@2712" + "&output=json";
var url_email = "https://www.rollbase.com/rest/api/selectQuery?sessionId=";
var url_details1 = "https://www.rollbase.com/rest/api/getRecord?objName=" + "Profile2" + "&sessionId=";
var url_details2 = "&fieldList=" + "City,Email,CandidateGender,CandidateStartDate,CandidateName,CandidatePhoneNumber,CandidatePhoto";
var sensor_id, beacon_proximity, page_id, b, flag = 0;
var candidateName, candidateEmail, candidateGender, candidateCity, candidateInterviewDate, candidatePhoto;
var log = 0;
var profile_id;
var count2=1;
var currentBeacon = "";
var appState = [{
    uuid: '',
    major: 0,
    minor: 0,
    isPlaying: 0,
    id: '',
    files: ''
}]
var flag_img=[0,0,0,0];