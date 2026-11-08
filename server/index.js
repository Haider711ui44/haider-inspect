import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Client, auth } from 'twitter-api-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const authClient = new auth.OAuth2User({
  client_id: process.env.X_CLIENT_ID,
  client_secret: process.env.X_CLIENT_SECRET,
  callback: process.env.X_CALLBACK_URL,
  scopes: ["tweet.read", "users.read", "tweet.write"],
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
    await authClient.requestAccessToken(code);
    
    const client = new Client(authClient);
    const user = await client.users.findMyUser();

    res.redirect(`https://haider-711-x.onrender.com/?status=success&user=${user.data.username}`);
  } catch (error) {
    console.error(error);
    res.redirect(`https://haider-711-x.onrender.com/?status=error`);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));