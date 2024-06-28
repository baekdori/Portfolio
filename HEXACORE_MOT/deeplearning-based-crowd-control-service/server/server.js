const express = require("express");
const app = express();
const session = require('./session');
const port = 4000;
const cors = require("cors");
app.use(session);
try {
// CORS 설정
app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true,
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello World!');
});

// 로그인 
const loginRouter = require('./routes/loginRouter');
app.use('/user/login', loginRouter);
// 로그아웃
const logoutRouter = require('./routes/logout');
app.use('/user/logout', logoutRouter);
// 아이디별 전시관 조회 
const exhbRouter = require('./routes/getexhb'); 
app.use('/getexhb', exhbRouter);
// 도넛 차트
const donutRouter = require('./routes/donutchart');
app.use('/donutchart', donutRouter);
// 도넛 차트 아래 동시간대 인원
const sametimeRouter = require('./routes/sametime');
app.use('/sametime', sametimeRouter);
// 이번주 지난주 평균 그래프
const weekRouter = require('./routes/weekavg');
app.use('/weekavg', weekRouter);
// 오픈시간부터 보여주는 그래프
const timeRouter = require('./routes/bytime');
app.use('/bytime', timeRouter);
// 이번주 일별 평균 정보
const thisWeekRouter = require('./routes/thisweek');
app.use('/thisweek', thisWeekRouter);
// 지난주 일별 평균 정보
const lastWeekRouter = require('./routes/lastweek');
app.use('/lastweek', lastWeekRouter);
// 히트맵
const heapmapRouter = require('./routes/heatmap');
app.use('/heatmap', heapmapRouter);
// 혼잡도 상위 5개 
const topRouter = require('./routes/crowded');
app.use('/crowded', topRouter);
// 평균추이 그래프
const visitorRouter = require('./routes/visitor');
app.use('/visitor', visitorRouter);
// 남녀별 그래프
const genderRouter = require('./routes/gender');
app.use('/bygender', genderRouter);
// 연령별 그래프
const ageRouter = require('./routes/age');
app.use('/byage', ageRouter);
// 구역별 체류 인원,시간
const byworkRouter = require('./routes/bywork');
app.use('/bywork', byworkRouter);

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
}
	catch(error) {
		console.log(error);
	}

