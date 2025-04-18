const { MongoClient } = require("mongodb");
const axios = require("axios");

const uri = "mongodb+srv://nsa10050:rlaehdus0823@gotoashow.9ufcsbx.mongodb.net/?retryWrites=true&w=majority&appName=gotoashow";
const client = new MongoClient(uri);

let collection;

async function connectDB() {
    if (!collection) {
        await client.connect();
        const db = client.db("gotoashow");
        collection = db.collection("member");
        console.log("MongoDB 연결 완료");
    }
}

module.exports = async (req, res) => {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { code } = req.query;

    console.log("인가 코드:", code);
    console.log("redirect_uri:", process.env.CLIENT_REDIRECT_URI);

    if (!code) {
        return res.status(400).json({ error: "Authorization code is missing" });
    }

    try {
        await connectDB();

        const tokenResponse = await axios.post("https://kauth.kakao.com/oauth/token", null, {
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
            params: {
                grant_type: "authorization_code",
                client_id: "f26d70de4f91fb13430539fe82bcebfc",
                redirect_uri: process.env.CLIENT_REDIRECT_URI,
                code
            },
        });

        const access_token = tokenResponse.data.access_token;

        const userResponse = await axios.post("https://kapi.kakao.com/v2/user/me", null, {
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
        });

        const userData = userResponse.data;

        const existingUser = await collection.findOne({ id: userData.id });

        if (!existingUser) {
            await collection.insertOne({
                id: userData.id,
                name: userData.properties.nickname
            });
        }

        res.status(200).json({
            access_token,
            properties: userData.properties
        });

    } catch (error) {
        console.error("카카오 로그인 오류:", error.response?.data || error.message);
        res.status(500).json({ error: "카카오 로그인 실패", details: error.response?.data || error.message });
    }
};
