# Animal Marketplace Frontend

React Native + Expo + Expo Router + JavaScript/JSX frontend.

## Setup

```bash
npm install
```

Create `.env`:

```env
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_LAN_IP:5000/api
```

Example:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.10:5000/api
```

Do NOT use `localhost` when testing the Expo app on a physical iPhone/Android phone.

Start:

```bash
npx expo start
```

Scan the QR code with Expo Go.

## Backend

This frontend expects the Animal Marketplace backend APIs:

- `/auth/send-otp`
- `/auth/verify-otp`
- `/users/me`
- `/categories`
- `/sellers`
- `/listings`
- `/favorites`
- `/chat`
- `/payments`
- `/notifications`
- `/reports`
- `/reviews`
- `/uploads`

## Important

- JavaScript/JSX only.
- JWT is stored using Expo SecureStore.
- API secrets must NOT be placed in the mobile app.
- Seller listings require backend seller approval.
- Wild/prohibited animal validation is also enforced by the backend.
