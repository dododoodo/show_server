require('dotenv').config();

const cors = require('cors'); 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const kakao = require('./api/kakao');
const naver = require('./api/naver');
const kcisa = require('./api/kcisa');


let corsOptions = {
    origin: "*"
};
 
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/kakao', kakao);
app.use('/naver', naver);


app.use('/kcisa', kcisa);