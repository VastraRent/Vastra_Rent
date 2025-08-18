# VastraRent AI Chatbot - Production Deployment Guide

## 🚀 **Overview**
This guide explains how to deploy the VastraRent AI Chatbot securely in production with proper API key management.

## 🔐 **Secure API Key Management**

### **Development Environment**
- API key is automatically used from the configuration file
- No additional setup required for local development

### **Production Environment**

#### **Option 1: Environment Variables (Recommended)**

1. **Set Environment Variable on Your Server:**
   ```bash
   export ENV_OPENROUTER_API_KEY="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"
   ```

2. **Add to Your Server Configuration:**

   **Apache (.htaccess):**
   ```apache
   SetEnv ENV_OPENROUTER_API_KEY "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"
   ```
   
   **Nginx:**
   ```nginx
   location / {
       proxy_set_header ENV_OPENROUTER_API_KEY "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";
   }
   ```

3. **Create a Server-Side Script (PHP Example):**
   ```php
   <?php
   // config.php
   header('Content-Type: application/javascript');
   echo "window.ENV_OPENROUTER_API_KEY = '" . $_ENV['ENV_OPENROUTER_API_KEY'] . "';";
   ?>
   ```

4. **Include in Your HTML:**
   ```html
   <script src="config.php"></script>
   <script src="js/config.js"></script>
   <script src="js/chatbot.js"></script>
   ```

#### **Option 2: Backend Proxy (Most Secure)**

1. **Create a Backend API Endpoint:**
   ```php
   <?php
   // api/chat.php
   header('Content-Type: application/json');
   header('Access-Control-Allow-Origin: *');
   header('Access-Control-Allow-Methods: POST');
   header('Access-Control-Allow-Headers: Content-Type');

   $apiKey = $_ENV['ENV_OPENROUTER_API_KEY'];
   $input = json_decode(file_get_contents('php://input'), true);

   $ch = curl_init('https://openrouter.ai/api/v1/chat/completions');
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
   curl_setopt($ch, CURLOPT_POST, true);
   curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($input));
   curl_setopt($ch, CURLOPT_HTTPHEADER, [
       'Authorization: Bearer ' . $apiKey,
       'HTTP-Referer: ' . $_SERVER['HTTP_ORIGIN'],
       'X-Title: Vastra Rent',
       'Content-Type: application/json'
   ]);

   $response = curl_exec($ch);
   curl_close($ch);

   echo $response;
   ?>
   ```

2. **Update the Chatbot to Use Backend:**
   ```javascript
   // In chatbot.js, replace the fetch call:
   const response = await fetch('/api/chat.php', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify(request)
   });
   ```

#### **Option 3: Cloudflare Workers (Advanced)**

1. **Create a Cloudflare Worker:**
   ```javascript
   // worker.js
   addEventListener('fetch', event => {
     event.respondWith(handleRequest(event.request))
   })

   async function handleRequest(request) {
     const apiKey = env.ENV_OPENROUTER_API_KEY;
     const url = 'https://openrouter.ai/api/v1/chat/completions';
     
     const modifiedRequest = new Request(url, {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${apiKey}`,
         'HTTP-Referer': request.headers.get('origin'),
         'X-Title': 'Vastra Rent',
         'Content-Type': 'application/json'
       },
       body: request.body
     });
     
     return fetch(modifiedRequest);
   }
   ```

## 📁 **File Structure**

```
vastrarent/
├── css/
│   └── chatbot.css              # Chatbot styles
├── js/
│   ├── config.js                # Configuration & API key management
│   └── chatbot.js               # Main chatbot functionality
├── home.html                    # Includes chatbot
├── product-details.html         # Includes chatbot
├── about.html                   # Includes chatbot
├── inventory.html               # Includes chatbot
├── profile.html                 # Includes chatbot
├── rental-status.html           # Includes chatbot
└── perfect-for-you.html         # Includes chatbot
```

## 🚀 **Deployment Steps**

### **1. Prepare Your Files**
- Upload all HTML, CSS, and JS files to your server
- Ensure the file structure is maintained
- Verify all chatbot scripts are included in HTML files

### **2. Set Up API Key Security**
Choose one of the methods above based on your hosting setup:

- **Shared Hosting**: Use Option 1 (Environment Variables)
- **VPS/Dedicated**: Use Option 1 or Option 2
- **Cloudflare**: Use Option 3 (Cloudflare Workers)

### **3. Test the Integration**
- Test the chatbot on your live site
- Verify AI responses are working
- Check that API key is not exposed in browser
- Test on different devices and browsers

### **4. Monitor Usage**
- Monitor OpenRouter API usage
- Set up alerts for high usage
- Track conversation quality

## 🔒 **Security Best Practices**

1. **Never expose API keys in client-side code**
2. **Use HTTPS in production**
3. **Implement rate limiting** (built into chatbot)
4. **Monitor API usage**
5. **Regularly rotate API keys**
6. **Use environment variables**
7. **Implement proper CORS policies**

## 📊 **Monitoring and Analytics**

### **Add Analytics to Track Usage:**
```javascript
// Add to chatbot.js
async function logUsage(usage) {
    // Send usage data to your analytics
    fetch('/api/analytics', {
        method: 'POST',
        body: JSON.stringify({
            tokens_used: usage.total_tokens,
            timestamp: new Date().toISOString()
        })
    });
}
```

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **API Key Not Working:**
   - Check environment variable is set
   - Verify API key format
   - Check server logs

2. **CORS Errors:**
   - Ensure proper headers are set
   - Check domain configuration

3. **Rate Limiting:**
   - Implement request throttling
   - Monitor usage limits

4. **Chatbot Not Loading:**
   - Check if config.js is loaded before chatbot.js
   - Verify all script paths are correct
   - Check browser console for errors

## 🎯 **Features Included**

### **AI Capabilities:**
- ✅ OpenRouter AI integration with Mistral model
- ✅ Intelligent conversation handling
- ✅ Context-aware responses
- ✅ Fallback responses for offline scenarios

### **UI/UX Features:**
- ✅ Matches Vastra Rent website theme
- ✅ Responsive design for all devices
- ✅ Smooth animations and transitions
- ✅ Quick reply buttons
- ✅ Typing indicators
- ✅ Notification badges

### **Security Features:**
- ✅ Environment-based API key management
- ✅ Rate limiting (10 requests per minute)
- ✅ Input validation and sanitization
- ✅ Secure error handling

### **Production Features:**
- ✅ Conversation history persistence
- ✅ Session management
- ✅ Error recovery
- ✅ Performance optimization

## 📞 **Support**

For issues with:
- **OpenRouter API:** Check their documentation
- **Deployment:** Contact your hosting provider
- **Chatbot Integration:** Review this guide

## 🔄 **Updates and Maintenance**

### **Regular Tasks:**
1. Monitor API usage and costs
2. Update API key if needed
3. Check for OpenRouter API updates
4. Review conversation logs for improvements

### **Backup Strategy:**
- Keep backup of configuration files
- Document any custom modifications
- Test updates in staging environment first

---

## 🎉 **Success Checklist**

Before going live, ensure:
- [ ] API key is securely configured
- [ ] HTTPS is enabled
- [ ] All pages include chatbot scripts
- [ ] Chatbot responds correctly
- [ ] Rate limiting is working
- [ ] Error handling is functional
- [ ] Mobile responsiveness is tested
- [ ] Analytics tracking is set up

**Remember:** Always test thoroughly in a staging environment before deploying to production! 