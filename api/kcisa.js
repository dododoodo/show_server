// api/kcisa.js (Vercel Serverless Function 버전)
import axios from 'axios';

const BASE_URL = 'http://api.kcisa.kr/openapi/API_CCA_148/request';
const SERVICE_KEY = '356b0d91-82e9-43e0-b690-b78a982ec774';

export default async function handler(req, res) {
  const { pageNo = 1, numOfRows = 20 } = req.query;

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        serviceKey: SERVICE_KEY,
        numOfRows,
        pageNo,
        format: 'json'
      },
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('API 호출 에러:', error.message);
    res.status(500).json({ error: 'Failed to fetch KCISA data' });
  }
}
