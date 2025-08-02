// Test API connection directly
async function testOpenRouterAPI() {
    const apiKey = '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';
    const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    const model = 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free';
    
    try {
        console.log('Testing API connection...');
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Vastra Rent AI Assistant'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: 'Hello, can you respond?' }
                ],
                max_tokens: 100,
                temperature: 0.7
            })
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', [...response.headers.entries()]);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Test Successful!');
            console.log('Response:', data);
            return data;
        } else {
            const errorText = await response.text();
            console.error('❌ API Test Failed!');
            console.error('Status:', response.status);
            console.error('Error:', errorText);
            return { error: errorText, status: response.status };
        }
    } catch (error) {
        console.error('❌ Network Error:', error);
        return { error: error.message };
    }
}

// Run the test
testOpenRouterAPI().then(result => {
    console.log('Test completed:', result);
});