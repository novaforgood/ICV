<p>
  <h1>Inner City Visions (ICV)</h1>
  <p>
    A <b>Next.js + TypeScript + Firebase</b> web application built for the nonprofit 
    <b>Inner City Visions (ICV)</b> to streamline client intake, case management, and real-time service outcome tracking.
  </p>
</p>

## Dev Environment Setup
### 1. Clone the repository
```bash
git clone https://github.com/YOURUSERNAME/icv-client-management.git
```
### 2. Configure Environment Variables
<p>Create a .env file with the following variables:</p>

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

RESEND_API_KEY=
```

### 3. Setup Next.js
<p>Run the following commands:</p>

```
cd icv
pnpm install
pnpm run dev
```

