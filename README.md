# TikTok Ads Creator Platform

A React-based application that enables users to create and manage TikTok ad campaigns with a streamlined, user-friendly interface.

## Features

- 🎯 Intuitive multi-step ad creation wizard
- 🔐 Secure OAuth 2.0 integration with TikTok
- 📊 Real-time ad preview functionality
- 🔐 PKCE-enhanced security for OAuth flows
- 🎨 Modern UI with gradient designs and smooth animations
- 🔄 Automatic token refresh mechanism

## Prerequisites

- Node.js (v18 or higher)
- Bun package manager
- TikTok Developer Account with Ads API access

## Installation

1. Clone the repository:

   ```bash
   git clone <your-frontend-repo-url>
   cd tiktok-ads-app
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Set up environment variables (see OAuth Setup section below)

4. Start the development server:

   ```bash
   bun run dev
   ```

## OAuth Setup Steps

1. **Create a TikTok Developer Account**:

   - Go to `https://developers.tiktok.com/`
   - Register and create a new app

2. **Configure Your TikTok App**:

   - Enable `ads.manage` and `user.info.basic` permissions
   - Add redirect URI: `http://localhost:5176/callback` (for development)

3. **Create Environment File**:

   ```bash
   cp .env.example .env
   ```

4. **Add Your Credentials**:

   ```env
   # Your TikTok App Credentials
   VITE_TIKTOK_CLIENT_KEY=your_client_key_here
   VITE_TIKTOK_CLIENT_SECRET=your_client_secret_here

   # OAuth Redirect URI (must match TikTok app configuration)
   VITE_TIKTOK_REDIRECT_URI=http://localhost:5176/callback
   ```

5. **Start Server**:
   - Frontend server: `bun run dev`

## How to Run the Project

### Development Mode

```bash
# Install dependencies
bun install

# Start the development server
bun run dev
```

The app will be available at `http://localhost:5176` (or next available port).

### Production Build

```bash
# Build for production
bun run build

# Preview production build locally
bun run preview
```

## Project Structure

```folder
tiktok-ads-app/
├── src/
│   ├── components/     # React components
│   │   ├── AdForm/     # Ad creation forms
│   │   ├── OAuth/      # OAuth components
│   │   └── Home.tsx    # Main home page
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app router
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── .env.example        # Environment variables template
└── package.json        # Dependencies and scripts
```

## OAuth Flow

1. User clicks "Connect TikTok Ads Account"
2. App initiates PKCE-enhanced OAuth flow
3. User authenticates with TikTok
4. TikTok redirects back with authorization code
5. Frontend exchanges code for token
6. App stores tokens securely in sessionStorage
7. User can now create ad campaigns

## Error Handling

The application includes comprehensive error handling for:

- Invalid client credentials
- Missing ads permissions
- Expired/revoked tokens
- Geo-restrictions
- Network errors

All errors are presented as human-readable messages to users without exposing raw API responses.

## Assumptions and Shortcuts Taken

### Assumptions

- TikTok Ads API access has been approved for your developer account
- User has basic knowledge of OAuth flows

### Shortcuts/Considerations

- Tokens are stored in sessionStorage (adequate for demo, consider refresh tokens for production)
- Frontend validation is paired with backend validation
- Mock data is used for music validation
- UI assumes responsive design but not tested on all devices

## Environment Variables

| Variable                  | Description              | Required                    |
| ------------------------- | ------------------------ | --------------------------- |
| VITE_TIKTOK_CLIENT_KEY    | TikTok app client key    | Yes                         |
| VITE_TIKTOK_CLIENT_SECRET | TikTok app client secret | Yes |
| VITE_TIKTOK_REDIRECT_URI  | OAuth redirect URI       | Yes                         |

## Troubleshooting

### Common Issues

- **OAuth fails**: Verify redirect URI matches TikTok app configuration
- **White screen**: Check browser console for errors
- **Connection issues**: Ensure server is running

### Port Conflicts

If port 5176 is in use, Vite will automatically select another port.

## Tech Stack

- React 19 with TypeScript
- Vite bundler
- Tailwind CSS (v4) with gradients
- React Router for navigation
- Axios for API calls

## Security Features

- PKCE (Proof Key for Code Exchange) for OAuth security
- Client secrets stored only on backend
- CSRF protection with state parameters
- Secure token storage in sessionStorage
- Input validation on frontend
