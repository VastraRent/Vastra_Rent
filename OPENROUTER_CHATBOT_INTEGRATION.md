# OpenRouter Chatbot Integration - Vastra Rent

## Overview
This document describes the complete OpenRouter chatbot integration for Vastra Rent, powered by DeepSeek AI model with comprehensive inventory knowledge.

## Files Created/Modified

### Core Chatbot Files
1. **`js/openrouter-chatbot.js`** - Main chatbot functionality
2. **`css/openrouter-chatbot.css`** - Chatbot styling
3. **`js/chatbot-inventory-data.js`** - Comprehensive inventory database
4. **`openrouter-chatbot-test.html`** - Test page for chatbot functionality

### Modified Files
- **`home.html`** - Updated to use new OpenRouter chatbot
- Added inventory data script inclusion

## API Configuration

### OpenRouter Settings
- **API Key**: `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`
- **Model**: `deepseek/deepseek-r1:free`
- **Endpoint**: `https://openrouter.ai/api/v1/chat/completions`
- **Headers**: 
  - Authorization with Bearer token
  - HTTP-Referer for site ranking
  - X-Title for site identification

## Inventory Knowledge Base

### Men's Collection
- **Jodhpuri Suits**: ₹2,800/day, ₹7,200/week (7 styles)
- **Kurta Sets**: ₹1,800/day, ₹4,800/week (6 styles)
- **Tuxedos**: ₹2,500/day, ₹6,500/week (6 styles)
- **Sherwanis**: ₹3,500/day, ₹9,000/week (5 styles)
- **Suits**: ₹2,000/day, ₹5,500/week (6+ styles)
- **Blazers**: ₹2,200/day, ₹6,000/week
- **Indo-western**: ₹2,500/day, ₹6,500/week (7 styles)

### Women's Collection
- **Lehngas**: ₹4,500/day, ₹12,000/week (9 styles)
- **Gowns**: ₹2,800/day, ₹7,500/week (4 styles)
- **Anarkalis**: ₹3,200/day, ₹8,500/week (4 styles)
- **Sharavas**: ₹2,800/day, ₹7,500/week

## Company Information Integrated

### Business Details
- **Founded**: 2025 in Vadodara, Gujarat
- **Mission**: Making premium fashion accessible through sustainable rental services
- **Values**: Sustainability, Quality, Accessibility, Community
- **Team**: 
  - Vinit Prajapati (Founder & CEO)
  - Shreyash Vekariya (Co-founder & CFO)
  - Krinal Thummar (Fashion Director & CTO)

### Contact Information
- **Location**: Vadodara, Gujarat, IN 390019
- **Phone**: +91 9898471702 / +91 7984291916 / +91 9574946483
- **Email**: project172305@gmail.com
- **Hours**: Mon-Fri 9am-6pm, Sat 10am-4pm, Sun Closed

### Services
- Free delivery and returns
- Basic damage protection included
- Professional cleaning service
- Flexible rental periods (1 day to several weeks)
- Size consultation and styling advice

## Chatbot Features

### Core Functionality
- **Real-time AI responses** using DeepSeek model
- **Conversation history** for context-aware interactions
- **Inventory-aware responses** with specific item details
- **Visual clothing cards** with images, prices, and details
- **Interactive card display** for category searches
- **Occasion-based recommendations**
- **Price comparisons** and budget suggestions
- **Size guide assistance**
- **Styling advice** for different events

### Visual Card System
- **Automatic card display** when users search for categories
- **Image thumbnails** for each clothing item
- **Price and size information** on each card
- **Availability status** with visual indicators
- **Click-to-view details** functionality
- **View all items** button for complete category browsing
- **Mobile responsive** card layout

### UI Features
- **Modern gradient design** matching website aesthetics
- **Smooth animations** and transitions
- **Mobile responsive** layout
- **Typing indicators** for better UX
- **Message timestamps**
- **Notification system** for new messages

### Smart Responses
- **Wedding recommendations**: Sherwanis, Lehngas, premium options
- **Party suggestions**: Tuxedos, Gowns, cocktail wear
- **Festival options**: Kurtas, Anarkalis, traditional wear
- **Business attire**: Suits, Blazers, formal options
- **Budget-conscious suggestions**: Alternative options within price range

## Testing

### Test Scenarios
1. **General inquiries** about services and company
2. **Visual card displays** for category searches
3. **Specific item searches** by category or color
4. **Occasion-based recommendations** (wedding, party, festival)
5. **Pricing questions** with daily/weekly comparisons
6. **Size and availability** queries
7. **Styling advice** requests

### Sample Test Questions (Card Display)
- **"Show me lehngas"** - Displays Lehnga collection cards
- **"Display tuxedo collection"** - Shows Tuxedo cards with images
- **"I want to see kurtas"** - Kurta collection cards
- **"Show gowns for party"** - Gown collection display
- **"Browse wedding outfits"** - Wedding category recommendations
- **"Display men's collection"** - Men's category cards

### Sample Test Questions (Text Response)
- "What are your rental prices?"
- "How does the rental process work?"
- "What's included in your rental service?"
- "Tell me about your company"
- "Do you have size M available?"

## Integration Steps

1. **Include CSS**: Add `css/openrouter-chatbot.css` to page
2. **Include Scripts**: 
   - `js/chatbot-inventory-data.js` (inventory database)
   - `js/openrouter-chatbot.js` (main functionality)
3. **Initialize**: Chatbot auto-initializes on DOM load
4. **Test**: Use test page or integrated home page

## Customization Options

### Styling
- Modify gradient colors in CSS
- Adjust chat window size and position
- Customize animation timings
- Change font styles and sizes

### Functionality
- Update inventory data in `chatbot-inventory-data.js`
- Modify system prompt for different AI behavior
- Add new categories or items
- Adjust pricing information

### API Settings
- Change model (requires OpenRouter account)
- Modify temperature for response creativity
- Adjust max tokens for response length
- Update headers for site identification

## Maintenance

### Regular Updates
- **Inventory sync**: Update `chatbot-inventory-data.js` when new items added
- **Pricing updates**: Modify pricing in both inventory data and system prompt
- **Seasonal adjustments**: Update recommendations for different seasons
- **Company info**: Keep contact details and team information current

### Monitoring
- **API usage**: Monitor OpenRouter API calls and costs
- **Response quality**: Review AI responses for accuracy
- **User feedback**: Collect and analyze user interactions
- **Performance**: Monitor response times and error rates

## Troubleshooting

### Common Issues
1. **API errors**: Check API key and network connectivity
2. **Missing responses**: Verify system prompt and model availability
3. **Styling issues**: Check CSS file inclusion and conflicts
4. **Inventory mismatch**: Sync inventory data with actual website data

### Debug Mode
- Enable console logging for API requests
- Check network tab for failed requests
- Verify inventory data loading
- Test with different user queries

## Future Enhancements

### Planned Features
- **Image integration**: Show product images in chat
- **Direct booking**: Allow rental booking through chat
- **User preferences**: Remember user size and style preferences
- **Multi-language**: Support for regional languages
- **Voice integration**: Voice-to-text input capability

### Advanced AI Features
- **Visual search**: Upload image to find similar items
- **Style matching**: AI-powered outfit coordination
- **Trend analysis**: Seasonal and fashion trend recommendations
- **Personalization**: Learning user preferences over time

## Security Considerations

### API Security
- API key stored in client-side code (consider server-side proxy)
- Rate limiting to prevent abuse
- Input validation for user messages
- Error handling for API failures

### Data Privacy
- No personal data stored in chat history
- Conversation history cleared on page refresh
- No tracking of user interactions
- Compliance with privacy regulations

## Performance Optimization

### Loading Speed
- Lazy load chatbot components
- Minimize CSS and JavaScript files
- Optimize image assets
- Use CDN for external dependencies

### Response Time
- Implement response caching for common queries
- Optimize system prompt length
- Use appropriate model parameters
- Handle network timeouts gracefully

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Maintained by**: Vastra Rent Development Team