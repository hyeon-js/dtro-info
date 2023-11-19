const fs = require('fs');

module.exports = function() {
    var result = [];
    for (var n = 0; n < 3; n++) {
        result[n] = getTrainList(n + 1);
    }
    return result;
};

function getTrainList(line) {
    var stnList = [
        ['설화명곡', '화원', '대곡', '진천', '월배', '상인', '월촌', '송현', '서부정류장', '대명', '안지랑', '현충로', '영대병원', '교대', '명덕', '반월당', '중앙로', '대구역', '칠성시장', '신천', '동대구', '동구청', '아양교', '동촌', '해안', '방촌', '용계', '율하', '신기', '반야월', '각산', '안심'],
        ['문양', '다사', '대실', '강창', '계명대', '성서산업단지', '이곡', '용산', '죽전', '감삼', '두류', '내당', '반고개', '청라언덕', '반월당', '경대병원', '대구은행', '범어', '수성구청', '만촌', '담티', '연호', '대공원', '고산', '신매', '사월', '정평', '임당', '영남대'],
        ['칠곡경대병원', '학정', '팔거', '동천', '칠곡운암', '구암', '태전', '매천', '매천시장', '팔달', '공단', '만평', '팔달시장', '원대', '북구청', '달성공원', '서문시장', '청라언덕', '남산', '명덕', '건들바위', '대봉교', '수성시장', '수성구민운동장', '어린이회관', '황금', '수성못', '지산', '범물', '용지']
    ][line - 1];
    var result = [];
    stnList.forEach((e, i) => {
        result[i] = {
            stn: e,
            up: null,
            dn: null
        };
    });

    process.env.TZ = 'Asia/Seoul';
    var date = new Date();
    var hour = date.getHours();
    if (hour == 0) hour = 24;
    var now = 60 * 60 * hour + 60 * date.getMinutes() + date.getSeconds();

    var day = 0; //평일
    if (date.getDay() == 0) day = 1; //일요일
    if (date.getDay() == 6) day = 1; //토요일
    
    var fileName = 'timetable/line' + line + '_' + day + '.json';
    var data = fs.readFileSync(fileName).toString();
    data = JSON.parse(data);
    
    for (var train in data) {
        var time = data[train];

        /* 운행중이지 않은 열차 필터링 */
        var tym = time[time.length - 1].time;
        tym = time2sec(tym);
        if (tym < now) continue;
        tym = time2sec(time[0].time);
        if (now < tym) continue;

        var stn = findTrainLocation(time, now);
        var index = stnList.indexOf(stn);
        var num = Number(train[train.length - 1]);
        var ud = (num % 2 == 0) ? 'up' : 'dn';
        result[index][ud] = train;
    }

    return result;
}

function findTrainLocation(time, now) {
    for (var n = time.length - 1; n >= 0; n--) {
        var tym = time2sec(time[n].time);
        if (tym == now) return time[n].stn;
        if (tym < now) return time[n + 1].stn;
    }
    return 0;
}

function time2sec(time) {
    var t = time.split(':');
    t[0] = Number(t[0]);
    if (t[0] == 0) t[0] = 24;
    return t[0] * 60 * 60 + Number(t[1]) * 60 + Number(t[2]);
}