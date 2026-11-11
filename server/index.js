import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Client, auth } from 'twitter-api-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// حفظ الرموز عالمياً لتجنب فقدان الجلسة
let userAuthClient = null;

app.get('/api/auth/twitter', async (req, res) => {
  try {
    userAuthClient = new auth.OAuth2User({
      client_id: process.env.X_CLIENT_ID,
      client_secret: process.env.X_CLIENT_SECRET,
      callback: process.env.X_CALLBACK_URL,
      scopes: ["tweet.read", "users.read", "tweet.write", "offline.access"],
    });

    const authUrl = userAuthClient.generateAuthURL({
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
    if (!userAuthClient) {
      userAuthClient = new auth.OAuth2User({
        client_id: process.env.X_CLIENT_ID,
        client_secret: process.env.X_CLIENT_SECRET,
        callback: process.env.X_CALLBACK_URL,
        scopes: ["tweet.read", "users.read", "tweet.write", "offline.access"],
      });
    }
    
    await userAuthClient.requestAccessToken(code);
    const client = new Client(userAuthClient);
    const user = await client.users.findMyUser();

    res.redirect(`https://haider-711-x.onrender.com/?status=success&user=${user.data.username}`);
  } catch (error) {
    console.error("Callback error:", error);
    res.redirect('https://haider-711-x.onrender.com/?status=error');
  }
});

app.post('/api/tweet', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!userAuthClient) {
      return res.status(401).json({ error: "يرجى تسجيل الدخول أولاً" });
    }

    const client = new Client(userAuthClient);
    const createdTweet = await client.tweets.createTweet({ text: text });
    
    res.json({ success: true, tweet: createdTweet });
  } catch (error) {
    console.error("Tweet Error:", error);
    res.status(500).json({ error: error.message || "Failed to post tweet" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));