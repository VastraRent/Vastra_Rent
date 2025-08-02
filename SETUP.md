# Vastra Rent Chatbot Setup Guide

## Environment Variables

1. Copy your `.env.local` file and add your OpenRouter API key:

```bash
OPENROUTER_API_KEY=your-actual-openrouter-api-key-here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

## Getting Your OpenRouter API Key

1. Go to [OpenRouter Platform](https://openrouter.ai/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env.local` file

## Model Configuration

You can customize the AI behavior by editing `src/lib/ai-config.ts`:

- **model**: Currently using 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free' (Free Dolphin Mistral model via OpenRouter)
- **temperature**: Controls creativity (0.0 = focused, 1.0 = creative)
- **maxTokens**: Maximum response length
- **systemPrompt**: Customize the AI's personality and knowledge
- **suggestedPrompts**: Update the starter questions

## Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Features Implemented

✅ Direct OpenRouter integration with Dolphin Mistral AI
✅ Custom system prompt for fashion rental context
✅ Error handling and loading states
✅ Suggested conversation starters
✅ Responsive design
✅ TypeScript support
✅ Configurable AI settings

## Customization Tips

1. **Update the system prompt** in `ai-config.ts` to match your specific business needs
2. **Add more suggested prompts** to help users get started
3. **Adjust model parameters** for different response styles
4. **Customize the UI** in `chat-component.tsx` to match your brand