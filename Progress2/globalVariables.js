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
var profile_id, sensor_id, beacon_proximity, page_id, b, flag = 0;
var currentBeacon="";
var appState = [{
    uuid: '',
     major:0,
    minor:0,
    isPlaying: 0,
    id: '',
    files:''
}]