# AI-Powered Content Enhancement

> **BuildMyResume** now includes intelligent AI-powered content enhancement to help you create more professional, ATS-friendly resumes.

## 🚀 Overview

The AI enhancement feature uses Google's Gemini to intelligently improve your resume content. When you click the "Enhance" button next to supported fields, the AI will:

- **Improve language and professionalism** - Transform basic statements into compelling, professional descriptions
- **Optimize for ATS systems** - Use keywords and formatting that Applicant Tracking Systems can easily parse
- **Add action verbs and quantifiable results** - Make your achievements more impactful
- **Maintain your original meaning** - Enhance without changing the core information you provided

## ✨ Supported Fields

The AI enhancement is available for the following resume fields:

### 📝 **Professional Summary**
- Enhances your professional background description
- Adds action verbs and quantifiable achievements
- Optimizes for ATS keyword matching

### 💼 **Job Descriptions**
- Improves descriptions of your roles and responsibilities
- Adds specific achievements and metrics
- Uses industry-standard terminology

### 📋 **Custom Section Content**
- Enhances any custom section content you add
- Maintains relevance to the section's purpose
- Improves professional presentation

### 🏷️ **Custom Section Headings**
- Suggests professional section titles
- Ensures consistency with resume standards

## 🎯 How It Works

### 1. **Click Enhance**
When you click the "Enhance" button next to a supported field, the AI will:
- Analyze your current content
- Generate an improved version
- Immediately replace the content in the field

### 2. **Accept or Reject**
After enhancement, you'll see "Accept" and "Reject" buttons:
- **Accept**: Keep the AI-enhanced version
- **Reject**: Restore your original content

### 3. **Smart Suggestions**
- Each enhancement attempt provides a different suggestion
- Previously rejected suggestions won't appear again
- AI validates content relevance before enhancement

## 🔒 Security & Privacy

### **Data Protection**
- All AI requests are encrypted and signed
- Content is validated and sanitized before processing
- No personal data is stored by the AI service

### **Rate Limiting**
- **5 enhancement attempts per field per resume**
- Prevents abuse and controls costs
- Resets when you create a new resume

### **Input Validation**
- AI validates content relevance before enhancement
- Blocks inappropriate or irrelevant content
- Prevents enhancement of placeholder text

## 🛠️ Technical Implementation

### **Frontend Components**
- `AIEnhanceButton` - Reusable enhancement button component
- `ResumeContext` - Manages enhancement counts and state
- `ai.ts` - Service for API communication

### **Backend Security**
- **Multi-level rate limiting** (30 req/15min per IP, 5 req/15min per field)
- **Mandatory request signatures** using HMAC
- **Input validation and sanitization**
- **Origin validation** for production

### **AI Integration**
- Google Gemini API
- Field-specific prompt engineering
- Content validation within AI prompts
- Rejected response tracking

## 📊 Usage Limits

| Feature | Limit | Description |
|---------|-------|-------------|
| **Enhancement Attempts** | 5 per field per resume | Maximum enhancements per field |
| **Rate Limiting** | 30 requests per 15 minutes | Per IP address |
| **Field Rate Limiting** | 5 requests per 15 minutes | Per field per IP |
| **Content Length** | 1000 characters max | Per enhancement request |

## 🎨 User Experience

### **Visual Indicators**
- Enhancement button shows loading state
- Accept/Reject buttons appear after enhancement
- Toast notifications for feedback
- Remaining enhancement count in notifications

### **Error Handling**
- Clear error messages for failed enhancements
- Graceful handling of network issues
- Content validation feedback
- Rate limit notifications

## 🔧 Setup Instructions

### **1. Get Gemini API Key**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key for configuration

### **2. Environment Configuration**

#### **Local Development**
Create `functions/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash-lite
SHARED_SECRET=your_secure_secret_here
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:3000
```

#### **Production (Firebase)**
Set Firebase Functions config:
```bash
firebase functions:config:set gemini.api_key="your_gemini_api_key_here"
firebase functions:config:set gemini.model="gemini-2.0-flash-lite"
firebase functions:config:set security.shared_secret="your_secure_secret_here"
firebase functions:config:set security.allowed_origins="https://buildmyresume.live,https://www.buildmyresume.live"
```

### **3. Install Dependencies**
```bash
cd functions
npm install @google/generative-ai
```

### **4. Model Configuration (Optional)**
You can customize the AI model used for enhancement:

```bash
# Available models:
# - gemini-2.0-flash-lite (default) - Fast, cost-effective
# - gemini-2.0-flash-exp - Experimental version
# - gemini-1.5-flash - Alternative model
# - gemini-1.5-pro - More powerful model

# Set via environment variable
GEMINI_MODEL=gemini-2.0-flash-lite

# Or via Firebase Functions config
firebase functions:config:set gemini.model="gemini-2.0-flash-lite"
```

### **5. Deploy Functions**
```bash
firebase deploy --only functions
```

## 🚨 Security Features

### **Request Validation**
- **HMAC Signature**: Every request must include a valid signature
- **Origin Validation**: Only requests from allowed domains are accepted
- **Input Sanitization**: Blocks malicious content and scripts
- **Content Filtering**: Prevents enhancement of inappropriate content

### **Rate Limiting**
- **Global Rate Limit**: 30 requests per 15 minutes per IP
- **Field-Specific Limit**: 5 requests per 15 minutes per field per IP
- **User Limit**: 5 enhancement attempts per field per resume

### **Content Validation**
- **Relevance Check**: AI validates content is appropriate for the field
- **Length Limits**: Prevents excessive content processing
- **Pattern Detection**: Blocks suspicious or repetitive content

## 🔍 Troubleshooting

### **Common Issues**

#### **"Request signature required"**
- Ensure `VITE_SHARED_SECRET` is set in frontend
- Check that backend `SHARED_SECRET` matches

#### **"Invalid request signature"**
- Verify the shared secret is correct
- Check for environment variable issues

#### **"Content validation failed"**
- Ensure content is relevant to the field
- Check for inappropriate or placeholder text

#### **"Rate limit exceeded"**
- Wait 15 minutes before trying again
- Check if you've reached the 5-attempt limit per field

### **Debug Mode**
Enable debug logging in `functions/src/index.ts`:
```typescript
const DEBUG_MODE = process.env.NODE_ENV === 'development';
```

## 📈 Performance Optimization

### **AI Response Time**
- Average response time: 2-4 seconds
- Optimized prompts for faster processing
- Caching of common enhancement patterns

### **Cost Management**
- Rate limiting prevents excessive API usage
- Content validation reduces unnecessary requests
- Efficient prompt engineering minimizes token usage

## 🔮 Future Enhancements

### **Planned Features**
- **Industry-specific enhancements** - Tailored suggestions based on job field
- **Skill gap analysis** - AI suggestions for missing skills
- **Resume scoring** - AI-powered resume quality assessment
- **Custom enhancement prompts** - User-defined enhancement criteria

### **API Improvements**
- **Batch enhancement** - Enhance multiple fields at once
- **Enhancement history** - Track and reuse successful enhancements
- **Template-specific prompts** - Optimize for different resume styles

## 📞 Support

For issues with AI enhancement:

1. **Check the troubleshooting section** above
2. **Verify your API key** is valid and has sufficient quota
3. **Review rate limits** and usage patterns
4. **Check browser console** for detailed error messages

## 🔗 Related Documentation

- **[Firebase Functions](./FUNCTIONS.md)** - Backend implementation details
- **[Security Checklist](./PUBLIC_REPO_CHECKLIST.md)** - Security best practices
- **[Contributing Guidelines](./CONTRIBUTING.md)** - How to contribute to AI features

---

**AI Enhancement** - Making your resume more professional, one enhancement at a time! 🤖✨
