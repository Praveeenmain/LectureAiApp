export default async function handler(req, res) {
    // Get agent ID and API key from environment variables
    const agentId = process.env.REACT_APP_AGENT_ID;
    const apiKey = process.env.REACT_APP_API_KEY;
    const userId = process.env.REACT_APP_USER_ID;

    try {
        // Set request options with headers
        const options = {
            method: 'GET',
            headers: {
                Authorization: apiKey,
                'X-USER-ID': userId,
                Accept: 'application/json',
            },
        };

        // Make the API request
        const response = await fetch(`https://api.play.ai/api/v1/agents/${agentId}`, options);

        // Check if the response is okay
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse the response data
        const data = await response.json();

        // Return the response data
        res.status(200).json(data);
    } catch (error) {
        console.error('API request error:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}