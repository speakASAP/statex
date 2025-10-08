# Contact Types and User Identification

This document describes how the StateX platform handles different contact types and user identification for form submissions and summary persistence.

## Overview

The StateX platform supports multiple contact types for form submissions:

- **Email** (📧 Email)
- **LinkedIn** (💼 LinkedIn)
- **WhatsApp** (📱 WhatsApp)
- **Telegram** (✈️ Telegram)

All contact types are properly handled for user identification, session management, and summary persistence.

## Contact Type Handling

### Form Submission Structure

The form submission includes the following contact-related fields:

```typescript
interface FormSubmission {
  name: string;
  contactType: "email" | "linkedin" | "whatsapp" | "telegram";
  contactValue: string;  // The actual contact information
  description: string;
  // ... other fields
}
```

### User Identification Logic

The system uses the `contact_value` field to generate a unique user ID, ensuring that users are properly identified regardless of their chosen contact method:

```python
# User ID generation uses contact_value, not just email
contact_value = submission.get("contact_value", submission.get("user_email", "unknown"))
user_id = hashlib.md5(contact_value.encode()).hexdigest()
```

### Session Directory Structure

User sessions are organized by contact value, not email:

```text
data/uploads/
├── {user_id_hash}/           # Generated from contact_value
│   ├── sess_{timestamp}_{id}/
│   │   ├── form_data.md
│   │   ├── summary.md        # Summary persisted here
│   │   └── files/
│   └── ...
```

## Implementation Details

### Submission Service Changes

1. **Submission Record**: Now includes both `contact_type` and `contact_value`
2. **User ID Generation**: Uses `contact_value` instead of just `user_email`
3. **Session Management**: Based on contact value for consistent user identification
4. **Summary Persistence**: Works with all contact types

### Contact Type Examples

#### Email Contact

```json
{
  "contactType": "email",
  "contactValue": "user@example.com",
  "user_email": "user@example.com"
}
```

#### Telegram Contact

```json
{
  "contactType": "telegram",
  "contactValue": "@username",
  "user_email": "user@example.com"  // Still required for form processing
}
```

#### LinkedIn Contact

```json
{
  "contactType": "linkedin",
  "contactValue": "https://linkedin.com/in/username",
  "user_email": "user@example.com"
}
```

#### WhatsApp Contact

```json
{
  "contactType": "whatsapp",
  "contactValue": "+1234567890",
  "user_email": "user@example.com"
}
```

## Summary Persistence

The summary persistence logic has been updated to work with all contact types:

### Before (Email Only)

```python
user_email = submission.get("user_email", "unknown")
user_id = hashlib.md5(user_email.encode()).hexdigest()
```

### After (All Contact Types)

```python
contact_value = submission.get("contact_value", submission.get("user_email", "unknown"))
user_id = hashlib.md5(contact_value.encode()).hexdigest()
```

## Benefits

1. **Universal Support**: All contact types work seamlessly
2. **Consistent Identification**: Users are identified by their chosen contact method
3. **Proper Session Management**: Sessions are organized by contact value
4. **Summary Persistence**: Summaries are saved regardless of contact type
5. **Backward Compatibility**: Email-only submissions still work

## Testing

### Test Cases

1. **Email Submission**: Verify user ID generation and summary persistence
2. **Telegram Submission**: Verify user ID generation and summary persistence
3. **LinkedIn Submission**: Verify user ID generation and summary persistence
4. **WhatsApp Submission**: Verify user ID generation and summary persistence
5. **Mixed Contact Types**: Verify different users with different contact types don't conflict

### Test Commands

```bash
# Test email submission
curl -X POST http://localhost:8002/api/submissions/ \
  -F "user_email=test@example.com" \
  -F "contact_type=email" \
  -F "contact_value=test@example.com" \
  -F "description=Test submission"

# Test telegram submission
curl -X POST http://localhost:8002/api/submissions/ \
  -F "user_email=test@example.com" \
  -F "contact_type=telegram" \
  -F "contact_value=@testuser" \
  -F "description=Test submission"

# Test summary persistence
curl -X POST http://localhost:8002/api/submissions/{submission_id}/summary \
  -H "Content-Type: application/json" \
  -d '{"summary": "Test summary"}'
```

## Migration Notes

### Existing Submissions

Existing submissions that only have `user_email` will continue to work:

- The system falls back to `user_email` if `contact_value` is not available
- No data migration is required
- Backward compatibility is maintained

### New Submissions

New submissions should include both `contact_type` and `contact_value`:

- This ensures proper user identification
- Enables support for all contact types
- Provides better user experience

## Troubleshooting

### Common Issues

1. **Summary Not Saved**: Check if `contact_value` is properly set in submission
2. **Wrong User ID**: Verify that `contact_value` is being used for user ID generation
3. **Session Not Found**: Ensure contact value is consistent between submission and summary persistence

### Debug Commands

```bash
# Check submission data
curl http://localhost:8002/api/submissions/{submission_id}

# Check session directory structure
ls -la data/uploads/

# Check form data
cat data/uploads/{user_id}/sess_{timestamp}_{id}/form_data.md
```

## Best Practices

1. **Always Include Contact Type**: Set both `contact_type` and `contact_value`
2. **Validate Contact Values**: Ensure contact values are properly formatted
3. **Handle Edge Cases**: Consider what happens with empty or invalid contact values
4. **Test All Contact Types**: Verify functionality with each contact type
5. **Monitor User Experience**: Ensure users can easily provide their preferred contact method
