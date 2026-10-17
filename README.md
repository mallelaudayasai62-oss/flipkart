# Flipkart storefront

A responsive Next.js demo storefront with searchable product cards, department filters, a persistent shopping bag, a local demo session, and a demo order submission.

## Demo boundaries

- The catalog contains 32 sample products across 10 departments.
- Sign-in is a browser-local demo session, not identity verification. It does not ask for or store a password.
- Orders are saved in this browser's local storage only. Shipping details are not saved or sent to a server.
- No payment provider is connected. The checkout does not collect card data or charge a payment method.

## Run locally

```powershell
cd C:\nani_projects\flipkart
npm install
npm run dev
```

Open the local URL printed by Next.js (usually `http://localhost:3000`).

The login and checkout screens are frontend demos only. They do not create accounts, send credentials, process payments, or submit orders to a backend. Product images are loaded from Unsplash.
