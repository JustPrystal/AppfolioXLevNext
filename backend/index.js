require('dotenv').config();
const express = require('express');
const axios = require('axios'); // Import Axios
const cors = require('cors'); // Import the cors middleware

const app = express();
const PORT = 3001;
app.use(express.json());
app.use(cors()); // Use the cors middleware


app.post('/slack-write', async (req, res) => {
    try {
        const response = await axios.post('https://slack.com/api/chat.postMessage', req.body, {
            headers: {
                'Authorization': process.env.SLACK_TOKEN, // Update with your Slack API token
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        // console.error('Error sending message to Slack:', error);
        res.status(500).json({ error: 'Failed to send message to Slack' });
    }
});

app.post('/slack-update', async (req, res) => {
    try {
        const response = await axios.post('https://slack.com/api/chat.update', req.body, {
            headers: {
                'Authorization': process.env.SLACK_TOKEN, // Update with your Slack API token
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        // console.error('Error sending message to Slack:', error);
        res.status(500).json({ error: 'Failed to send message to Slack' });
    }
});




app.listen(PORT);
