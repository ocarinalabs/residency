# Reverse Engineering Nuveq API - Step-by-Step Guide

## 🔍 Phase 1: Analyzing the Form with Browser DevTools

### Step 1: Inspect the Registration Form

1. **Open the form in Chrome/Edge**
   ```
   https://nuveq.cloud/modules/visitors/regv.php?keytoken=8zyCek2N9hS5u2jcS1aC4E6KzO0
   ```

2. **Open DevTools** (F12 or right-click → Inspect)

3. **Go to Network Tab**
   - Clear existing requests (🚫 button)
   - Check "Preserve log" ✅
   - Filter by "Fetch/XHR" or "Doc"

4. **Fill and Submit the Form**
   - Use test data:
     - Name: "Test Visitor"
     - Email: "test@example.com"
     - IC/Passport: "TEST123456"
     - Phone: "+60123456789"

5. **Capture the Request**
   - Look for POST request to `regv.php` or similar
   - Right-click the request → Copy → Copy as cURL
   - Save this for testing in Postman

### Step 2: Analyze Request Details

In DevTools Network tab, click on the request to see:

**Headers Tab:**
```http
Request URL: https://nuveq.cloud/modules/visitors/regv.php?keytoken=8zyCek2N9hS5u2jcS1aC4E6KzO0
Request Method: POST
Content-Type: application/x-www-form-urlencoded

Important headers to note:
- Cookie: [any session cookies]
- Referer: [origin page]
- User-Agent: [browser info]
```

**Payload Tab:**
```
Example form data (URL encoded):
visitor_name=Test+Visitor
visitor_email=test%40example.com
visitor_ic=TEST123456
visitor_phone=%2B60123456789
submit=Next
```

**Response Tab:**
- Check if it returns JSON, HTML, or redirects
- Look for success indicators or error messages
- Note any returned tokens or IDs

## 🧪 Phase 2: Testing with Postman/Insomnia

### Create a Postman Collection

1. **Import the cURL command** you copied
2. **Create environment variables:**
   ```json
   {
     "nuveq_base": "https://nuveq.cloud",
     "registration_token": "8zyCek2N9hS5u2jcS1aC4E6KzO0",
     "test_email": "test@example.com"
   }
   ```

3. **Test different scenarios:**
   - Valid submission
   - Missing fields
   - Invalid data
   - Duplicate submissions

### Document the API Behavior

Create a test matrix:

| Test Case | Request | Response | Status |
|-----------|---------|----------|--------|
| Valid form | All fields filled | Success page/redirect | 200/302 |
| Missing name | No visitor_name | Error message | 400 |
| Invalid email | Bad email format | Validation error | 400 |
| Duplicate IC | Same IC twice | Already registered | 409 |

## 💻 Phase 3: Implementing the Proxy

### Step 1: Create API Route in Next.js

```typescript
// app/api/nuveq/register/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 1. Parse incoming JSON from our form
    const body = await request.json();
    
    // 2. Map our fields to Nuveq's expected format
    const formData = new URLSearchParams({
      'visitor_name': body.fullName,
      'visitor_email': body.email,
      'visitor_ic': body.icPassport,
      'visitor_phone': body.phoneNumber,
      'submit': 'Next'
    });

    // 3. Forward to Nuveq
    const response = await fetch(
      `${process.env.NUVEQ_REGISTRATION_URL}?keytoken=${process.env.NUVEQ_REGISTRATION_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0', // Mimic browser
          'Referer': process.env.NUVEQ_BASE_URL,
        },
        body: formData.toString(),
        redirect: 'manual', // Don't follow redirects automatically
      }
    );

    // 4. Handle response
    const responseText = await response.text();
    
    // Parse response for success indicators
    if (response.status === 302) {
      // Handle redirect - extract visitor pass token
      const location = response.headers.get('location');
      const keyTokenMatch = location?.match(/keyToken=([^&]+)/);
      
      if (keyTokenMatch) {
        return NextResponse.json({
          success: true,
          keyToken: keyTokenMatch[1],
          passUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pass/${keyTokenMatch[1]}`
        });
      }
    }

    // Check for success in HTML response
    if (responseText.includes('successfully registered')) {
      // Extract any tokens from the response
      return NextResponse.json({
        success: true,
        message: 'Registration successful'
      });
    }

    // Handle errors
    return NextResponse.json({
      success: false,
      message: 'Registration failed',
      debug: process.env.NODE_ENV === 'development' ? responseText : undefined
    }, { status: 400 });

  } catch (error) {
    console.error('Registration proxy error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
```

### Step 2: Handle Session/Cookies (if needed)

```typescript
// If Nuveq requires session management
import { cookies } from 'next/headers';

// Store Nuveq cookies
const nuveqCookies = response.headers.get('set-cookie');
if (nuveqCookies) {
  // Parse and store in our cookie jar
  cookies().set('nuveq_session', nuveqCookies, {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });
}

// Forward cookies in subsequent requests
const cookieStore = cookies();
const sessionCookie = cookieStore.get('nuveq_session');

const response = await fetch(url, {
  headers: {
    'Cookie': sessionCookie?.value || '',
    // ... other headers
  }
});
```

## 🎨 Phase 4: Building Our Beautiful Form

```typescript
// app/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const formSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  icPassport: z.string().min(6, 'IC/Passport is required'),
  phoneNumber: z.string().min(10, 'Valid phone number required'),
});

export default function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      icPassport: '',
      phoneNumber: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/nuveq/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Registration successful!');
        
        // Redirect to visitor pass if we got a token
        if (result.keyToken) {
          window.location.href = `/pass/${result.keyToken}`;
        }
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          {...form.register('fullName')}
          placeholder="John Doe"
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          {...form.register('email')}
          placeholder="john@example.com"
        />
      </div>
      
      <div>
        <Label htmlFor="icPassport">IC/Passport Number</Label>
        <Input
          id="icPassport"
          {...form.register('icPassport')}
          placeholder="A12345678"
        />
      </div>
      
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          {...form.register('phoneNumber')}
          placeholder="+60123456789"
        />
      </div>
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
}
```

## 🚪 Phase 5: Analyzing Door Controls

### Inspect the Visitor Pass Page

1. **Open the visitor pass URL**
   ```
   https://nuveq.cloud/modules/visitors/visitor_pass.php?keyToken=vYxI6j1U2DxY74YvV4hL00pPKF14JUYfzH4D0Cymf
   ```

2. **Inspect button clicks in DevTools**
   - Click each door button
   - Capture the requests (likely AJAX/Fetch)
   - Note the endpoints and payloads

3. **Expected findings:**
   ```javascript
   // Each button might send:
   POST /modules/visitors/door_control.php
   {
     "keyToken": "vYxI6j1U2DxY74YvV4hL00pPKF14JUYfzH4D0Cymf",
     "action": "open",
     "door_id": 1
   }
   ```

### Implement Door Control Proxy

```typescript
// app/api/nuveq/door/route.ts

export async function POST(request: NextRequest) {
  const { keyToken, doorId, action } = await request.json();
  
  // Forward to Nuveq's door control endpoint
  const response = await fetch(
    `${process.env.NUVEQ_BASE_URL}/modules/visitors/door_control.php`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyToken,
        door_id: doorId,
        action: action || 'open'
      })
    }
  );
  
  // Log in Convex for audit trail
  await logDoorAccess({
    keyToken,
    doorId,
    action,
    timestamp: new Date(),
    success: response.ok
  });
  
  return NextResponse.json({
    success: response.ok,
    message: response.ok ? 'Door opened' : 'Access denied'
  });
}
```

## 🧪 Testing Checklist

- [ ] Test form submission with valid data
- [ ] Test form validation (missing/invalid fields)
- [ ] Verify visitor pass URL is returned
- [ ] Test door control buttons
- [ ] Check mobile responsiveness
- [ ] Test error handling
- [ ] Verify Convex logging
- [ ] Test email notifications

## 🔒 Security Considerations

1. **Never expose Nuveq credentials client-side**
2. **Validate all input on our server**
3. **Rate limit API endpoints**
4. **Log all access attempts**
5. **Use HTTPS everywhere**
6. **Implement CSRF protection**
7. **Sanitize data before forwarding**

## 📝 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CORS errors | All requests must go through our backend proxy |
| Session expired | Implement session refresh mechanism |
| Form fields don't match | Use DevTools to find exact field names |
| Response parsing fails | Check if response is HTML vs JSON |
| Rate limiting | Implement request throttling |

## 🚀 Next Steps

1. Complete the DevTools inspection
2. Test with Postman to verify behavior
3. Implement the proxy endpoints
4. Build the UI components
5. Test end-to-end flow
6. Deploy to staging environment

---

*Remember: We're creating a better UX layer, not breaking security. Always respect rate limits and terms of service.*