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

**Endpoint:** `POST /export-pdf`

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

## Environment Variables

### Required
- `SHARED_SECRET` - Secret key for HMAC signature verification
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins

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
```

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

### Alerts
- High error rates
- Memory usage spikes
- Rate limit violations
- Function timeouts

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