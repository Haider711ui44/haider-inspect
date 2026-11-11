import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Client, auth } from 'twitter-api-sdk';

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

let authClient = null;
let loggedInUser = null;

app.get('/api/auth/twitter', async (req, res) => {
  try {
    authClient = new auth.OAuth2User({
      client_id: process.env.X_CLIENT_ID,
      client_secret: process.env.X_CLIENT_SECRET,
      callback: process.env.X_CALLBACK_URL,
      scopes: ["tweet.read", "users.read", "tweet.write", "offline.access"],
    });

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
    await authClient.requestAccessToken(code);
    const client = new Client(authClient);
    const user = await client.users.findMyUser();
    loggedInUser = user.data.username;

    res.redirect(`https://haider-711-x.onrender.com/?status=success&user=${loggedInUser}`);
  } catch (error) {
    console.error("Callback Error:", error);
    res.redirect('https://haider-711-x.onrender.com/?status=error');
  }
});

app.post('/api/tweet', async (req, res) => {
  try {
    const { text } = req.body;

    if (!authClient) {
      return res.status(401).json({ error: "لا توجد جلسة نشطة، يرجى إعادة الضغط على ربط الحساب." });
    }

    const client = new Client(authClient);
    const createdTweet = await client.tweets.createTweet({ text: text });
    
    res.json({ success: true, tweet: createdTweet });
  } catch (error) {
    console.error("Tweet API Error:", error);
    // إرجاع نص الخطأ المباشر من تويتر لمعرفة السبب فوراً
    const errorMsg = error?.error?.detail || error?.message || JSON.stringify(error);
    res.status(500).json({ error: errorMsg });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));