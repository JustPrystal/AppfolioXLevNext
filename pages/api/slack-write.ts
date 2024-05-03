import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { body } = req;

    try {
        const response = await axios.post('https://slack.com/api/chat.postMessage', body, {
            headers: {
                'Authorization': process.env.NEXT_PUBLIC_SLACK_TOKEN as string, // Update with your Slack API token
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error sending message to Slack:', error);
        res.status(500).json({ error: 'Failed to send message to Slack' });
    }
}