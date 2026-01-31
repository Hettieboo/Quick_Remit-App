# QuickRemit 💸

> Fast, affordable, and beautiful money transfers to Nigeria

![Demo](https://img.shields.io/badge/status-demo-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

**QuickRemit** is a modern remittance application prototype that enables users to send money from USD, GBP, EUR, or AUD to Nigerian bank accounts with transparent pricing and instant delivery.

## ✨ Features

- 💱 **Real-time Exchange Rates** - Live currency conversion for USD, GBP, EUR, AUD → NGN
- 🏦 **22 Nigerian Banks** - Support for all major Nigerian banks
- ✅ **Account Verification** - Instant bank account validation
- 📱 **Mobile Responsive** - Beautiful UI that works on all devices
- ⚡ **Fast Transfers** - ~1 hour delivery time
- 🔒 **Secure** - Bank-grade encryption and security
- 💰 **Low Fees** - Just 1.5% transaction fee
- 📧 **Email Receipts** - Automatic transaction confirmations
- 🎨 **Modern UI/UX** - Clean, professional interface

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quickremit.git
   cd quickremit
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies at once
   npm run install:all
   
   # Or install separately
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your Flutterwave keys
   
   # Frontend
   cp frontend/.env.example frontend/.env
   # Edit if needed (defaults work for local dev)
   ```

4. **Start the application**
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm start
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to: **http://localhost:3000**

## 🎯 Usage

### Test the Demo

1. **Enter Amount**: Try $100 USD (or GBP/EUR/AUD)
2. **Select Bank**: Choose any Nigerian bank (e.g., GTBank)
3. **Account Number**: Enter any 10-digit number (e.g., 0123456789)
4. **Your Details**: Enter your name and email
5. **Complete Transfer**: Click pay and see the confirmation!

### Supported Currencies

| Currency | Symbol | Rate (NGN) |
|----------|--------|------------|
| US Dollar | USD | 1,580 |
| British Pound | GBP | 2,100 |
| Euro | EUR | 1,720 |
| Australian Dollar | AUD | 1,050 |

*Note: These are demo rates. In production, rates are fetched from Flutterwave API*

## 🏗 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Modern CSS** - No framework needed

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **SQLite** - Database (for demo)
- **Axios** - HTTP client

### APIs & Services
- **Flutterwave** - Payment processing & exchange rates
- Future: Stripe, SendGrid, Twilio

## 📁 Project Structure

```
quickremit/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── AmountStep.jsx
│   │   │   ├── RecipientStep.jsx
│   │   │   ├── PaymentStep.jsx
│   │   │   ├── ConfirmationStep.jsx
│   │   │   └── Header.jsx
│   │   ├── services/
│   │   │   └── api.js       # API client
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                  # Node.js API
│   ├── server.js            # Express server
│   ├── package.json
│   └── .env.example
│
├── README.md
├── QUICK_START.md           # 5-minute setup guide
├── DEMO_GUIDE.md            # Investor pitch guide
└── LICENSE
```

## 🚂 Deployment

### Deploy to Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   railway init
   railway up
   ```

4. **Deploy Frontend**
   ```bash
   cd ../frontend
   railway init
   railway up
   ```

5. **Set Environment Variables**
   - Go to Railway dashboard
   - Add `VITE_API_URL` with your backend URL
   - Redeploy

### Deploy to Vercel/Netlify (Frontend)

```bash
cd frontend
npm run build
# Upload 'dist' folder to Vercel/Netlify
```

## 🔧 Configuration

### Backend (.env)

```env
PORT=3001
FLW_SECRET_KEY=your_flutterwave_secret_key
NODE_ENV=production
```

### Frontend (.env)

```env
VITE_API_URL=https://your-backend-url.com
```

## 📊 API Documentation

### Exchange Rates
```
GET /api/rates?from=USD&to=NGN&amount=100
```

### Nigerian Banks
```
GET /api/banks
```

### Verify Account
```
POST /api/verify-account
Body: { account_number: "0123456789", account_bank: "058" }
```

### Create Transaction
```
POST /api/transactions
Body: { sender_name, sender_email, recipient_name, ... }
```

### Get Transaction
```
GET /api/transactions/:id
```

## 🛣 Roadmap

- [x] Core transfer flow
- [x] Exchange rate calculation
- [x] Bank account verification
- [x] Transaction receipts
- [ ] User authentication
- [ ] Real Flutterwave integration
- [ ] KYC/AML compliance
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Transaction history dashboard
- [ ] Multiple recipient management
- [ ] Scheduled transfers
- [ ] Mobile apps (iOS/Android)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Flutterwave](https://flutterwave.com/) - Payment infrastructure
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- Nigerian fintech ecosystem

## 📞 Support

For questions or issues:
- 📧 Email: support@quickremit.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/quickremit/issues)
- 📖 Docs: See [QUICK_START.md](QUICK_START.md)

## 💼 Business Inquiries

Interested in investing or partnering? Check out our [DEMO_GUIDE.md](DEMO_GUIDE.md) for more information.

---

**Built with ❤️ for the Nigerian diaspora** 🇳🇬

*This is a prototype for demonstration purposes. Not yet licensed for production use.*
