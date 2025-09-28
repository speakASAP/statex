# Direct Form Integration Guide

## 🎯 Overview

This guide explains how to integrate forms that send data directly to the external notification service, bypassing the StateX backend API. This approach simplifies the architecture and provides better performance.

## 🏗 Architecture

### Direct Communication Pattern
```
Frontend Form → HTTP POST → External Notification Service → Email/SMS/Push
```

### Benefits
- **Simplified Architecture**: No intermediate backend layer
- **Better Performance**: Direct communication reduces latency
- **Reduced Dependencies**: Fewer moving parts
- **Easier Maintenance**: Single point of integration

## 📁 Files Created/Modified

### New Files
- `frontend/src/services/notificationService.ts` - Direct notification service client
- `frontend/src/components/forms/DirectForm.tsx` - Simple HTML form component
- `frontend/src/components/forms/DirectForm.css` - Form styling
- `frontend/src/app/direct-contact/page.tsx` - Example contact page
- `frontend/src/app/direct-prototype/page.tsx` - Example prototype page
- `frontend/notification-service.env.example` - Environment configuration example

### Modified Files
- `frontend/src/config/env.ts` - Added notification service configuration
- `frontend/src/components/sections/FormSection.tsx` - Updated to use direct service

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
# External Notification Service Configuration
NEXT_PUBLIC_NOTIFICATION_SERVICE_URL=http://localhost:${FRONTEND_PORT:-3000}
NEXT_PUBLIC_NOTIFICATION_SERVICE_API_KEY=your-api-key-here

# Base URL for the application
NEXT_PUBLIC_BASE_URL=http://localhost:${FRONTEND_PORT:-3000}
```

### Production Configuration

For production, update the environment variables:

```bash
NEXT_PUBLIC_NOTIFICATION_SERVICE_URL=https://notifications.statex.cz
NEXT_PUBLIC_NOTIFICATION_SERVICE_API_KEY=prod-secure-api-key
NEXT_PUBLIC_BASE_URL=https://statex.cz
```

## 🚀 Usage

### Using DirectForm Component

```tsx
import { DirectForm } from '@/components/forms/DirectForm';

export default function ContactPage() {
  return (
    <DirectForm
      formType="contact"
      title="Send us a Message"
      subtitle="We'll get back to you within 24 hours"
      submitButtonText="📤 Send Message"
    />
  );
}
```

### Using Updated FormSection

The existing `FormSection` component has been updated to use the direct notification service:

```tsx
import { FormSection } from '@/components/sections/FormSection';

export default function PrototypePage() {
  return (
    <FormSection
      pageType="prototype"
      variant="prototype"
      title="Get Your Free Prototype"
      subtitle="Tell us about your idea — we'll create a working prototype for free"
      showVoiceRecording={true}
      showFileUpload={true}
      showContactFields={true}
      submitButtonText="🚀 Get Prototype in 24 Hours"
    />
  );
}
```

## 📡 API Integration

### Notification Service Endpoints

The forms send data to these endpoints:

#### Send Notification
```
POST /api/notifications
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <API_KEY>
User-Agent: StateX-Frontend/1.0
```

**Request Body:**
```json
{
  "type": "prototype_request" | "contact_form",
  "recipient": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "content": {
    "subject": "New Prototype Request - StateX",
    "message": "Form content...",
    "metadata": {
      "formType": "prototype",
      "source": "statex-frontend"
    }
  },
  "attachments": [],
  "timestamp": "2024-01-01T00:00:00.000Z",
  "source": "statex-frontend"
}
```

#### Health Check
```
GET /api/health
```

**Headers:**
```
Authorization: Bearer <API_KEY>
User-Agent: StateX-Frontend/1.0
```

## 🎨 Styling

### CSS Classes

The `DirectForm` component uses these CSS classes:

- `.stx-direct-form` - Main form container
- `.stx-form-header` - Form header section
- `.stx-form-title` - Form title
- `.stx-form-subtitle` - Form subtitle
- `.stx-form` - Form element
- `.stx-form-field` - Individual form field
- `.stx-form-label` - Field label
- `.stx-form-input` - Text input
- `.stx-form-textarea` - Textarea input
- `.stx-form-submit` - Submit button
- `.stx-form-success` - Success message
- `.stx-form-error` - Error message
- `.stx-form-privacy` - Privacy notice

### Theme Support

The forms support all StateX themes:
- Light theme (default)
- Dark theme (`data-theme="dark"`)
- EU theme (`data-theme="eu"`)
- UAE theme (`data-theme="uae"`)

## 🧪 Testing

### Manual Testing

1. **Start the notification service** on the configured URL
2. **Navigate to a form page** (e.g., `/direct-contact`)
3. **Fill out the form** with test data
4. **Submit the form** and verify the notification is sent
5. **Check the notification service logs** for received data

### Automated Testing

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DirectForm } from '@/components/forms/DirectForm';

test('submits form successfully', async () => {
  render(<DirectForm formType="contact" />);
  
  // Fill form
  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
  fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test message' } });
  
  // Submit form
  fireEvent.click(screen.getByRole('button', { name: /send message/i }));
  
  // Wait for success message
  await waitFor(() => {
    expect(screen.getByText(/form submitted successfully/i)).toBeInTheDocument();
  });
});
```

## 🔒 Security Considerations

### API Key Management
- Store API keys in environment variables
- Use different keys for development/production
- Never commit keys to version control
- Rotate keys regularly

### Data Privacy
- Sensitive data is sent to external service
- Ensure notification service is GDPR compliant
- Implement data retention policies
- Use HTTPS for all communications

### CORS Configuration
Ensure your notification service allows requests from your frontend domain:

```javascript
// Example CORS configuration for notification service
app.use(cors({
  origin: ['https://statex.cz', 'https://www.statex.cz', 'http://localhost:${FRONTEND_PORT:-3000}'],
  credentials: true
}));
```

## 🚨 Error Handling

### Network Errors
- Connection timeout (10 seconds)
- Service unavailable
- Invalid API key
- Malformed request

### User Experience
- Clear error messages
- Retry functionality
- Fallback to alternative contact methods
- Graceful degradation

### Error Messages
```typescript
// Example error handling
try {
  const response = await directNotificationService.sendPrototypeRequest(data);
  if (!response.success) {
    throw new Error(response.error || 'Submission failed');
  }
} catch (error) {
  setSubmitStatus('error');
  setSubmitMessage(
    error instanceof Error 
      ? error.message 
      : 'An error occurred while submitting the form. Please try again.'
  );
}
```

## 📊 Monitoring

### Success Metrics
- Form submission success rate
- Response time
- User completion rate
- Error frequency

### Logging
```typescript
// Success logging
console.log('✅ Notification sent successfully:', result.notificationId);

// Error logging
console.error('❌ Failed to send notification:', error);
```

## 🔄 Migration Strategy

### Phase 1: Parallel Implementation
- Keep existing backend API
- Add direct form as alternative
- A/B test both approaches

### Phase 2: Gradual Migration
- Update high-traffic forms first
- Monitor performance and errors
- Gradually migrate remaining forms

### Phase 3: Backend Cleanup
- Remove unused backend endpoints
- Clean up email service code
- Update documentation

## 🎯 Next Steps

### For Notification Service Development
1. **Implement required endpoints**:
   - `POST /api/notifications` - Send notifications
   - `GET /api/health` - Health check
   - `GET /api/version` - Version info

2. **Add email sending capability**:
   - SMTP integration
   - Email templates
   - Delivery tracking

3. **Implement additional features**:
   - SMS notifications
   - Push notifications
   - Webhook support
   - Admin dashboard

### For StateX Integration
1. **Test all form types** with direct integration
2. **Monitor performance** and error rates
3. **Update user documentation** with new contact methods
4. **Implement fallback mechanisms** for service unavailability

---

This direct form integration provides a clean, efficient way to send form data directly to your notification service while maintaining a great user experience.

