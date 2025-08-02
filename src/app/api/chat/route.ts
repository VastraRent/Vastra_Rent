import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';
import { AI_CONFIG } from '@/lib/ai-config';

export async function POST(req: NextRequest) {
  try {
    console.log('Chat API called');
    
    const body = await req.json();
    console.log('Request body:', body);
    
    const { messages } = body;

    // Validate the request
    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid messages:', messages);
      return new Response(JSON.stringify({ error: 'Invalid request: messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if OpenRouter API key is configured
    console.log('Environment check:');
    console.log('OPENROUTER_API_KEY exists:', !!process.env.OPENROUTER_API_KEY);
    console.log('OPENROUTER_API_KEY length:', process.env.OPENROUTER_API_KEY?.length);
    
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your-openrouter-api-key-here') {
      console.error('OpenRouter API key is not configured properly');
      console.error('Current value:', process.env.OPENROUTER_API_KEY);
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable - OpenRouter API key not configured' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('API key configured, proceeding with OpenRouter call');

    // Create OpenRouter client using OpenAI-compatible interface
    const openrouter = createOpenAI({
      name: 'openrouter',
      apiKey: process.env.OPENROUTER_API_KEY!,
      baseURL: 'https://openrouter.ai/api/v1',
      headers: {
        'HTTP-Referer': 'https://vastrarent.com', // Optional: your site URL
        'X-Title': 'Vastra Rent AI Assistant', // Optional: your app name
      },
    });

    // Add system prompt with dynamic inventory information
    const systemPromptWithInventory = AI_CONFIG.systemPrompt + `

## IMPORTANT INSTRUCTIONS FOR CLOTHING RECOMMENDATIONS:

When users ask about specific categories (jodhpuri, kurta, tuxedo, lehnga, gown, anarkali, sherwani, suit, blazer, indowastern, sharara), you should:

1. First provide a helpful text response about the category
2. Then suggest showing them actual items by saying something like: "Let me show you our available [category] collection!"
3. The chatbot widget will automatically detect category mentions and display clothing cards

Categories to trigger card display:
- Jodhpuri, Kurta, Tuxedo, Suit, Blazer, Sherwani, Indowastern (Men's)
- Lehnga, Gown, Anarkali, Sharara (Women's)

Always be enthusiastic about showing the actual items and mention that users can click on the cards to select items or view details.

Example responses:
- "We have beautiful Jodhpuri suits perfect for weddings! Let me show you our Jodhpuri collection."
- "Our Lehnga collection is stunning for traditional occasions! Here are our available Lehnga options."
- "For formal events, our Tuxedo collection is perfect! Let me display our Tuxedo selection."

Remember to use the exact category names as listed above to trigger the card display functionality.`;

    const messagesWithSystem = [
      { role: 'system', content: systemPromptWithInventory },
      ...messages,
    ];

    console.log('Messages with system prompt:', messagesWithSystem.length);
    console.log('Using model:', AI_CONFIG.model);

    console.log('About to call streamText with OpenRouter Dolphin Mistral...');
    
    const result = streamText({
      model: openrouter(AI_CONFIG.model),
      messages: messagesWithSystem,
      maxTokens: AI_CONFIG.maxTokens,
      temperature: AI_CONFIG.temperature,
      frequencyPenalty: AI_CONFIG.frequencyPenalty,
      presencePenalty: AI_CONFIG.presencePenalty,
    });
    
    console.log('streamText call completed, result:', typeof result);

    console.log('OpenRouter call successful, returning stream');
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Handle specific OpenRouter errors
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      if (error.message.includes('API key') || error.message.includes('Incorrect API key') || error.message.includes('invalid_api_key') || error.message.includes('unauthorized')) {
        return new Response(JSON.stringify({ error: 'Authentication error - Invalid OpenRouter API key' }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (error.message.includes('quota') || error.message.includes('exceeded') || error.message.includes('rate_limit')) {
        return new Response(JSON.stringify({ error: 'Service quota exceeded' }), { 
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (error.message.includes('model') || error.message.includes('not_found')) {
        return new Response(JSON.stringify({ error: 'Model not available' }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}