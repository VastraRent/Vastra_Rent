# VastraRent Chatbot Troubleshooting Guide

## 🚨 **Problem: Chatbot Not Visible on Website**

### **Quick Fix Steps:**

1. **Open Browser Console (F12)**
   - Press F12 or right-click → Inspect → Console
   - Look for any error messages

2. **Test Chatbot Functions:**
   ```javascript
   // Test if chatbot is initialized
   testChatbotVisibility()
   
   // Force show chatbot
   forceShowChatbot()
   
   // Manual initialization
   initVastraChatbot()
   ```

3. **Check Script Loading Order:**
   ```html
   <!-- Correct order in HTML files -->
   <script src="js/env-config.js"></script>
   <script src="js/config.js"></script>
   <script src="js/chatbot.js"></script>
   ```

### **Common Issues & Solutions:**

#### **Issue 1: Scripts Not Loading**
- **Symptoms:** Console shows "VastraRent Config not loaded"
- **Solution:** Ensure all script files exist and are in correct order

#### **Issue 2: CSS Conflicts**
- **Symptoms:** Chatbot elements exist but are invisible
- **Solution:** Check for CSS conflicts or z-index issues

#### **Issue 3: JavaScript Errors**
- **Symptoms:** Console shows JavaScript errors
- **Solution:** Fix syntax errors or missing dependencies

### **Debugging Steps:**

1. **Check Console for Errors:**
   - Look for red error messages
   - Check for missing file errors

2. **Verify File Structure:**
   ```
   vastrarent/
   ├── js/
   │   ├── env-config.js    ✅ Required
   │   ├── config.js        ✅ Required  
   │   └── chatbot.js       ✅ Required
   ├── css/
   │   └── chatbot.css      ✅ Required
   └── home.html            ✅ Include scripts
   ```

3. **Test Individual Components:**
   ```javascript
   // Check if config is loaded
   console.log('Config:', window.VastraRentConfig)
   
   // Check if chatbot instance exists
   console.log('Chatbot:', window.vastraChatbot)
   
   // Check DOM elements
   console.log('Container:', document.getElementById('chatbot-container'))
   ```

### **Manual Testing:**

1. **Open chatbot-test.html** in your browser
2. **Check console** for debugging information
3. **Use test buttons** to verify functionality

### **Production Deployment:**

For production websites, ensure:
- API key is properly configured
- HTTPS is enabled
- No JavaScript errors in console
- All required files are uploaded

### **Still Not Working?**

1. **Clear browser cache** and refresh
2. **Try different browser** (Chrome, Firefox, Safari)
3. **Check file permissions** on server
4. **Verify all dependencies** are loaded

### **Contact Support:**

If issues persist:
- Check browser console for specific errors
- Verify all files are properly uploaded
- Test on different devices/browsers
- Contact hosting provider for server issues

---

## 🎯 **Success Checklist**

- [ ] Console shows "🔧 Chatbot initialization complete"
- [ ] Chatbot toggle button visible (bottom-right corner)
- [ ] Clicking toggle button opens chat window
- [ ] No JavaScript errors in console
- [ ] All required files loaded successfully
