# Firebase Functions Documentation

## Overview

The Firebase Functions backend provides secure PDF export functionality for the BuildMyResume application. It uses Puppeteer with headless Chrome to convert encrypted HTML resumes into PDF files.

## Architecture

```
Frontend (React) → Encrypt HTML → Send to Firebase Function → Generate PDF → Return Base64
```

### Security Flow
1. Frontend encrypts resume HTML with AES encryption
2. Adds HMAC signature for integrity verification
3. Sends encrypted data to Firebase Function
4. Function verifies signature and decrypts HTML
5. Generates PDF using Puppeteer
6. Returns base64-encoded PDF to frontend

## Functions

### `api` - Main HTTP Function

**Endpoints:**
- `POST /export-pdf` - Converts encrypted HTML resumes to PDF format
- `POST /enhance-content` - AI-powered content enhancement for resumes

#### PDF Export Endpoint

**Purpose:** Converts encrypted HTML resumes to PDF format

**Security Features:**
- Rate limiting (20 requests per hour per IP)
- HMAC signature verification
- Input validation and sanitization
- CORS protection
- Helmet.js security headers

**Request Body:**
```json
{
  "encryptedData": "AES-encrypted JSON string",
  "signature": "HMAC-SHA256 signature"
}
```

**Response:**
```json
{
  "pdf": "base64-encoded-pdf-data"
}
```

**Error Responses:**
- `400` - Invalid request format
- `403` - Invalid signature
- `429` - Rate limit exceeded
- `500` - Server error

#### AI Enhancement Endpoint

**Purpose:** Enhances resume content using Google Gemini AI

**Security Features:**
- Rate limiting (30 requests per 15 minutes per IP, 5 per field)
- HMAC signature verification
- Input validation and content filtering
- Origin validation
- Content relevance validation

**Request Body:**
```json
{
  "field": "summary|jobDescription|skills|customSection",
  "content": "User content to enhance",
  "rejectedResponses": ["previously rejected suggestions"],
  "signature": "HMAC-SHA256 signature"
}
```

**Response:**
```json
{
  "enhancedContent": "AI-enhanced content",
  "originalContent": "Original user content",
  "field": "field-type"
}
```

**Error Responses:**
- `400` - Invalid content, validation failed, or content too long/short
- `403` - Invalid signature or origin not allowed
- `429` - Rate limit exceeded
- `500` - AI service error or configuration error

## Environment Variables

### Required
- `SHARED_SECRET` - Secret key for HMAC signature verification
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins

### AI Enhancement (Required for AI features)
- `GEMINI_API_KEY` - Google Gemini API key for AI content enhancement
- `GEMINI_MODEL` - Google Gemini model name (default: `gemini-2.0-flash-lite`)

### Optional
- `PORT` - Port for local development server (default: 5001)

## Local Development

### Prerequisites
- Node.js 20+
- Chrome/Chromium browser installed

### Setup
```bash
cd functions
npm install
```

### Running Locally
```bash
# Start local development server
npm run start:local

# Or start Firebase emulator
npm run start:firebase
```

The function will be available at `http://localhost:5001/export-pdf`

### Environment Setup
Create a `.env` file in the `functions` directory:
```env
SHARED_SECRET=your-shared-secret-here
ALLOWED_ORIGINS=http://localhost:8080,https://yourdomain.com
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-2.0-flash-lite
```

## AI Enhancement Configuration

### Available Models
The AI enhancement feature supports various Google Gemini models:

- `gemini-2.0-flash-lite` (default) - Fast, cost-effective for content enhancement
- `gemini-2.0-flash-exp` - Experimental version with enhanced capabilities
- `gemini-1.5-flash` - Alternative model for different use cases
- `gemini-1.5-pro` - More powerful model for complex enhancements

### Model Configuration
```bash
# Set model via Firebase Functions config
firebase functions:config:set gemini.model="gemini-2.0-flash-lite"

# Or set via environment variable
GEMINI_MODEL=gemini-2.0-flash-lite
```

### AI Generation Settings
The AI enhancement uses the following generation configuration:
- **Temperature:** 0.9 (creativity balance)
- **Top P:** 0.9 (nucleus sampling)
- **Top K:** 50 (token diversity)
- **Max Output Tokens:** 500 (response length limit)

## Production Deployment

### Firebase Functions
```bash
# Deploy to Firebase
npm run deploy

# View logs
npm run logs
```

### Configuration
- **Memory:** 1GB
- **Timeout:** 60 seconds
- **Max Instances:** 10
- **Runtime:** Node.js 20

## Security Considerations

### Rate Limiting
- General requests: 100 per 15 minutes
- PDF export: 20 per hour
- Based on IP address with X-Forwarded-For support

### Input Validation
- Maximum HTML size: 1MB
- Required fields: `encryptedData`, `signature`
- Type checking for all inputs

### CORS Configuration
- Configurable allowed origins
- Credentials support
- Secure defaults

### Error Handling
- No sensitive information in error messages
- Proper HTTP status codes
- Logging for debugging (development only)

## Dependencies

### Core Dependencies
- `firebase-functions` - Firebase Functions runtime
- `express` - HTTP server framework
- `puppeteer-core` - Headless Chrome for PDF generation
- `chrome-aws-lambda` - Chrome binary for serverless
- `crypto-js` - Encryption/decryption utilities

### Security Dependencies
- `helmet` - Security headers
- `cors` - CORS middleware
- `express-rate-limit` - Rate limiting

### Development Dependencies
- `typescript` - TypeScript compiler
- `eslint` - Code linting
- `@types/*` - TypeScript type definitions

## Troubleshooting

### Common Issues

#### PDF Generation Fails
- Check Chrome/Chromium installation
- Verify memory allocation (1GB minimum)
- Check timeout settings

#### Rate Limiting
- Monitor request frequency
- Implement client-side retry logic
- Consider increasing limits if needed

#### CORS Errors
- Verify `ALLOWED_ORIGINS` configuration
- Check frontend origin matches
- Ensure credentials are properly configured

#### Signature Verification Fails
- Verify `SHARED_SECRET` matches frontend
- Check HMAC algorithm consistency
- Validate request format

#### AI Enhancement Issues
- Verify `GEMINI_API_KEY` is valid and has sufficient quota
- Check `GEMINI_MODEL` is supported and available
- Monitor rate limits and usage patterns
- Validate content meets minimum requirements
- Check for suspicious content patterns

### Debugging
```bash
# View function logs
firebase functions:log

# Test locally with curl
curl -X POST http://localhost:5001/export-pdf \
  -H "Content-Type: application/json" \
  -d '{"encryptedData":"test","signature":"test"}'
```

## Performance Optimization

### Memory Usage
- PDF generation is memory-intensive
- 1GB allocation recommended
- Monitor memory usage in production

### Cold Starts
- Chrome binary loading can cause delays
- Consider keeping functions warm
- Use connection pooling if needed

### Caching
- No caching implemented (each request is unique)
- Consider implementing result caching for identical resumes

## Monitoring

### Metrics to Track
- Function execution time
- Memory usage
- Error rates
- Rate limit hits
- PDF generation success rate
- AI enhancement success rate
- AI API response times
- Content validation failures
- Model usage and costs

### Alerts
- High error rates
- Memory usage spikes
- Rate limit violations
- Function timeouts
- AI API quota exceeded
- High AI enhancement failure rates
- Unusual content validation patterns

## Future Enhancements

### Potential Improvements
- PDF compression
- Multiple format support (DOCX, etc.)
- Template caching
- Background processing for large files
- CDN integration for faster delivery

### Scalability
- Horizontal scaling with multiple instances
- Load balancing for high traffic
- Regional deployment for global users

---

For more information, see the [main README](../README.md) and [contributing guidelines](./CONTRIBUTING.md). 