# Nuveq Integration Setup

## Quick Start

### 1. Add Credentials to `.env.local`
```env
NUVEQ_USERNAME=your_nuveq_username
NUVEQ_PASSWORD=your_nuveq_password
NEXT_PUBLIC_URL=http://localhost:3000
```

### 2. Test the Connection
Visit: http://localhost:3000/api/nuveq/test

This will show:
- Whether credentials are configured
- If authentication works
- If visitor data can be fetched

### 3. View Dashboard
Visit: http://localhost:3000/dashboard

The dashboard will:
- Automatically fetch visitor data from Nuveq
- Show connection status
- Display visitors in the data table
- Refresh every 60 seconds

## API Endpoints Created

### Authentication
- `POST /api/nuveq/auth` - Authenticates with Nuveq and gets session cookie

### Visitors
- `GET /api/nuveq/visitors/today` - Fetches today's visitors

### Testing
- `GET /api/nuveq/test` - Tests the entire integration

## How It Works

1. **Authentication**: The auth endpoint logs into Nuveq using your credentials and stores the session cookie
2. **Scraping**: Uses Cheerio to parse HTML from Nuveq pages
3. **Data Transformation**: Converts scraped data into structured JSON
4. **Dashboard Integration**: Dashboard fetches data via API and displays it

## Troubleshooting

### "Nuveq credentials not configured"
- Make sure you've added `NUVEQ_USERNAME` and `NUVEQ_PASSWORD` to `.env.local`
- Restart the development server after adding credentials

### "Authentication failed"
- Check your username and password are correct
- The login endpoint might have changed - check the console for details

### "No visitor table found"
- The HTML structure of Nuveq might have changed
- Check the debug information in the API response
- May need to update the selectors in `/api/nuveq/visitors/today/route.ts`

## Next Steps

Once the basic scraping is confirmed working, we can add:
- More endpoints (pending visitors, future bookings, etc.)
- Approval/rejection actions
- Room management
- Analytics aggregation
- Caching for better performance