# Nuveq Web Scraping Strategy

## 🔐 Authentication Approach

### Option 1: Environment Variables (Recommended)
Store Nuveq credentials in Vercel environment variables:
```env
NUVEQ_USERNAME=your_username
NUVEQ_PASSWORD=your_password
```

### Option 2: Encrypted Credentials
Use a service like Vercel's encrypted secrets or AWS Secrets Manager.

### Option 3: OAuth Token (If Available)
Check if Nuveq supports API tokens instead of username/password.

## 🕷️ Scraping Implementation

### 1. Session Management Function
```typescript
// api/nuveq/auth.ts
import { parse } from 'cookie';

let sessionCookie: string | null = null;
let sessionExpiry: Date | null = null;

async function getNuveqSession() {
  // Check if we have valid session
  if (sessionCookie && sessionExpiry && sessionExpiry > new Date()) {
    return sessionCookie;
  }
  
  // Login to get new session
  const response = await fetch('https://nuveq.cloud/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      username: process.env.NUVEQ_USERNAME!,
      password: process.env.NUVEQ_PASSWORD!,
    }),
    redirect: 'manual', // Don't follow redirects
  });
  
  // Extract session cookie
  const cookies = response.headers.get('set-cookie');
  if (cookies) {
    sessionCookie = cookies.split(';')[0];
    sessionExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  }
  
  return sessionCookie;
}
```

### 2. Data Fetching Functions
```typescript
// api/nuveq/scrape.ts
import * as cheerio from 'cheerio';

export async function fetchTodaysVisitors() {
  const session = await getNuveqSession();
  
  const response = await fetch('https://nuveq.cloud/visitor/todays-visitors', {
    headers: {
      'Cookie': session,
      'User-Agent': 'Mozilla/5.0...',
    },
  });
  
  const html = await response.text();
  const $ = cheerio.load(html);
  
  // Parse table data
  const visitors = [];
  $('table tbody tr').each((i, row) => {
    visitors.push({
      name: $(row).find('td:nth-child(1)').text(),
      email: $(row).find('td:nth-child(2)').text(),
      checkIn: $(row).find('td:nth-child(3)').text(),
      status: $(row).find('td:nth-child(4)').text(),
    });
  });
  
  return visitors;
}
```

### 3. API Routes Structure
```
/api/nuveq/
├── auth.ts          # Session management
├── visitors/
│   ├── today.ts     # Today's visitors
│   ├── pending.ts   # Pending approvals
│   ├── future.ts    # Future bookings
│   └── approve.ts   # Approve/reject actions
├── rooms/
│   ├── status.ts    # Room availability
│   └── book.ts      # Room booking
└── analytics/
    └── dashboard.ts # Analytics data
```

## 📊 Data Caching Strategy

### Browser-Side Caching
```typescript
// Use SWR or React Query for intelligent caching
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function useVisitors() {
  const { data, error, mutate } = useSWR('/api/nuveq/visitors/today', fetcher, {
    refreshInterval: 60000, // Refresh every minute
    revalidateOnFocus: true,
  });
  
  return {
    visitors: data,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
  };
}
```

### Server-Side Caching
```typescript
// Use Vercel KV or memory cache
const cache = new Map();

export async function getCachedData(key: string, fetcher: Function) {
  const cached = cache.get(key);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }
  
  const data = await fetcher();
  cache.set(key, {
    data,
    expiry: Date.now() + 5 * 60 * 1000, // 5 minutes
  });
  
  return data;
}
```

## 🛡️ Security Considerations

### 1. Never Expose Credentials
- Store in environment variables only
- Never log credentials
- Use server-side functions only

### 2. Rate Limiting
```typescript
// Implement rate limiting to avoid detection
import { RateLimiter } from 'limiter';

const limiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 'minute',
});

async function rateLimitedFetch(url: string) {
  await limiter.removeTokens(1);
  return fetch(url);
}
```

### 3. Error Handling
```typescript
// Graceful degradation if Nuveq is down
try {
  const data = await fetchFromNuveq();
  return { success: true, data };
} catch (error) {
  console.error('Nuveq fetch failed:', error);
  return { 
    success: false, 
    error: 'Unable to fetch data. Please try again later.',
    cached: getCachedFallback(),
  };
}
```

## 🚀 Implementation Steps

### Phase 1: Basic Scraping
1. Set up authentication function
2. Create visitor list scraper
3. Test with real credentials
4. Implement caching

### Phase 2: Interactive Features
5. Add approval/rejection actions
6. Implement room booking
7. Add visitor search/filter

### Phase 3: Advanced Features
8. Analytics aggregation
9. Automated reports
10. Real-time updates via polling

## 🧪 Testing Without Credentials

For development without real credentials:

### 1. Mock Data API
```typescript
// api/nuveq/mock.ts
export async function getMockVisitors() {
  return [
    { name: 'John Doe', email: 'john@example.com', status: 'approved' },
    { name: 'Jane Smith', email: 'jane@example.com', status: 'pending' },
  ];
}
```

### 2. Environment-Based Switching
```typescript
const isDev = process.env.NODE_ENV === 'development';
const useMock = !process.env.NUVEQ_USERNAME;

export async function getVisitors() {
  if (isDev && useMock) {
    return getMockVisitors();
  }
  return fetchRealVisitors();
}
```

## 📝 Required NPM Packages

```bash
npm install cheerio       # HTML parsing
npm install cookie        # Cookie parsing
npm install swr          # Data fetching/caching
npm install limiter      # Rate limiting
npm install playwright   # Alternative: headless browser (if needed)
```

## ⚠️ Fallback Strategy

If direct scraping fails due to:
- JavaScript-heavy pages
- CAPTCHA protection
- Complex authentication

### Alternative: Playwright Browser Automation
```typescript
import { chromium } from 'playwright';

async function browserScrape() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Login
  await page.goto('https://nuveq.cloud/login');
  await page.fill('#username', process.env.NUVEQ_USERNAME!);
  await page.fill('#password', process.env.NUVEQ_PASSWORD!);
  await page.click('#login-button');
  
  // Navigate and scrape
  await page.goto('https://nuveq.cloud/visitor/todays-visitors');
  const visitors = await page.$$eval('table tbody tr', rows => 
    rows.map(row => ({
      name: row.querySelector('td:nth-child(1)')?.textContent,
      // ... more fields
    }))
  );
  
  await browser.close();
  return visitors;
}
```

## 🔑 Next Steps

1. **Get Credentials Securely**: Add to Vercel environment variables
2. **Test Login**: Verify authentication endpoint and method
3. **Inspect HTML**: Check actual structure of Nuveq pages
4. **Build Incrementally**: Start with read-only operations
5. **Monitor Performance**: Track response times and optimize

---

*Note: This strategy prioritizes security and reliability while working within the constraints of not using Nuveq's paid API.*