import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Client, auth } from 'twitter-api-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// متغير عالمي للحفاظ على الـ Client والجلسة الموثقة
let globalClient = null;

const authClient = new auth.OAuth2User({
  client_id: process.env.X_CLIENT_ID,
  client_secret: process.env.X_CLIENT_SECRET,
  callback: process.env.X_CALLBACK_URL,
  scopes: ["tweet.read", "users.read", "tweet.write", "offline.access"],
});

app.get('/api/auth/twitter', async (req, res) => {
  try {
    const authUrl = authClient.generateAuthURL({
      state: "my-state",
      code_challenge_method: "s256",
    });
    res.redirect(authUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/callback/twitter', async (req, res) => {
  try {
    const { code } = req.query;
    // طلب الـ Token وحفظه في جلسة authClient
    const token = await authClient.requestAccessToken(code);
    
    // إنشاء عميل موثق وجاهز للنشر
    globalClient = new Client(authClient);
    const user = await globalClient.users.findMyUser();

    res.redirect(`https://haider-711-x.onrender.com/?status=success&user=${user.data.username}`);
  } catch (error) {
    console.error("Callback Error:", error);
    res.redirect('https://haider-711-x.onrender.com/?status=error');
  }
});

app.post('/api/tweet', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!globalClient) {
      return res.status(401).json({ error: "يرجى تسجيل الدخول وإعطاء الصلاحية أولاً" });
    }

    // إرسال التغريدة عبر العميل الموثق
    const createdTweet = await globalClient.tweets.createTweet({ text: text });
    res.json({ success: true, tweet: createdTweet });
  } catch (error) {
    console.error("Tweet Error:", error);
    res.status(500).json({ error: error.message || "Failed to post tweet" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));