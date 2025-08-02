module.exports = {

"[project]/.next-internal/server/app/api/chat/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}}),
"[project]/src/lib/ai-config.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// AI Configuration for Vastra Rent Chatbot
__turbopack_context__.s({
    "AI_CONFIG": ()=>AI_CONFIG
});
const AI_CONFIG = {
    // Model settings - OpenRouter Dolphin Mistral model
    model: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
    maxTokens: 2000,
    temperature: 0.7,
    frequencyPenalty: 0.1,
    presencePenalty: 0.1,
    // System prompt
    systemPrompt: `You are Vastra Rent AI Assistant, powered by Dolphin Mistral AI, a helpful and knowledgeable assistant for a fashion rental platform called Vastra Rent. 

Your role is to help customers with:
- Finding the perfect outfit for their occasions
- Understanding rental policies and procedures
- Providing fashion advice and styling tips
- Answering questions about sizes, availability, and pricing
- Helping with booking and rental processes
- Suggesting alternatives and recommendations

Key information about Vastra Rent:
- We offer premium fashion rentals for special occasions
- Our collection includes designer dresses, suits, accessories, and ethnic wear
- Rental periods are typically 3-7 days
- We provide cleaning and maintenance services
- Free delivery and pickup within city limits
- Size exchanges available if needed

Always be:
- Friendly and professional
- Fashion-forward and stylish in your advice
- Helpful in finding solutions
- Clear about policies and procedures
- Encouraging customers to explore our collection

If you don't know specific details about inventory, pricing, or policies, politely direct customers to contact our support team or check the website for the most current information.`,
    // Suggested prompts for users
    suggestedPrompts: [
        "What dresses do you have for a wedding?",
        "How does the rental process work?",
        "Can you help me choose an outfit for a business event?",
        "What are your rental policies?",
        "Do you have ethnic wear for festivals?",
        "What sizes are available?",
        "How much does it cost to rent a dress?",
        "Can I extend my rental period?"
    ]
};
}),
"[project]/src/app/api/chat/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "POST": ()=>POST
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$openai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@ai-sdk/openai/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/ai/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai-config.ts [app-route] (ecmascript)");
;
;
;
async function POST(req) {
    try {
        console.log('Chat API called');
        const body = await req.json();
        console.log('Request body:', body);
        const { messages } = body;
        // Validate the request
        if (!messages || !Array.isArray(messages)) {
            console.error('Invalid messages:', messages);
            return new Response(JSON.stringify({
                error: 'Invalid request: messages array is required'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        // Check if OpenRouter API key is configured
        console.log('Environment check:');
        console.log('OPENROUTER_API_KEY exists:', !!process.env.OPENROUTER_API_KEY);
        console.log('OPENROUTER_API_KEY length:', process.env.OPENROUTER_API_KEY?.length);
        if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your-openrouter-api-key-here') {
            console.error('OpenRouter API key is not configured properly');
            console.error('Current value:', process.env.OPENROUTER_API_KEY);
            return new Response(JSON.stringify({
                error: 'Service temporarily unavailable - OpenRouter API key not configured'
            }), {
                status: 503,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        console.log('API key configured, proceeding with OpenRouter call');
        // Create OpenRouter client using OpenAI-compatible interface
        const openrouter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$openai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createOpenAI"])({
            name: 'openrouter',
            apiKey: process.env.OPENROUTER_API_KEY,
            baseURL: 'https://openrouter.ai/api/v1',
            headers: {
                'HTTP-Referer': 'https://vastrarent.com',
                'X-Title': 'Vastra Rent AI Assistant'
            }
        });
        // Add system prompt to the beginning of the conversation
        const messagesWithSystem = [
            {
                role: 'system',
                content: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AI_CONFIG"].systemPrompt
            },
            ...messages
        ];
        console.log('Messages with system prompt:', messagesWithSystem.length);
        console.log('Using model:', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AI_CONFIG"].model);
        console.log('About to call streamText with OpenRouter Dolphin Mistral...');
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["streamText"])({
            model: openrouter(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AI_CONFIG"].model),
            messages: messagesWithSystem,
            maxTokens: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AI_CONFIG"].maxTokens,
            temperature: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AI_CONFIG"].temperature,
            frequencyPenalty: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AI_CONFIG"].frequencyPenalty,
            presencePenalty: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AI_CONFIG"].presencePenalty
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
                return new Response(JSON.stringify({
                    error: 'Authentication error - Invalid OpenRouter API key'
                }), {
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            if (error.message.includes('quota') || error.message.includes('exceeded') || error.message.includes('rate_limit')) {
                return new Response(JSON.stringify({
                    error: 'Service quota exceeded'
                }), {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            if (error.message.includes('model') || error.message.includes('not_found')) {
                return new Response(JSON.stringify({
                    error: 'Model not available'
                }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
        }
        return new Response(JSON.stringify({
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__96e2d132._.js.map