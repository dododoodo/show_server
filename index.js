require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const kakao = require('./api/kakao');
const naver = require('./api/naver');
const kcisa = require('./api/kcisa');


app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/kakao', kakao);
app.use('/naver', naver);


app.use('/kcisa', kcisa);

app.listen(3000);