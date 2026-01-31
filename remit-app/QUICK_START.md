# ⚡ Quick Start Guide

Get your remittance app running in **5 minutes**!

## Prerequisites Check

```bash
node --version  # Should be 18 or higher
npm --version   # Should be 9 or higher
```

Don't have Node.js? Download from [nodejs.org](https://nodejs.org/)

---

## Option 1: Automatic Setup (Recommended)

### Step 1: Make setup script executable
```bash
chmod +x setup.sh
```

### Step 2: Run setup
```bash
./setup.sh
```

### Step 3: Start servers (2 separate terminals)

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

### Step 4: Open browser
Navigate to: **http://localhost:3000**

---

## Option 2: Manual Setup

### Step 1: Install backend
```bash
cd backend
npm install
npm start
```

### Step 2: Install frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```

### Step 3: Open browser
Navigate to: **http://localhost:3000**

---

## ✅ You're Ready!

The app should now be running. Try sending a transfer:

1. **Amount:** Enter $100 USD
2. **Bank:** Select "Guaranty Trust Bank" (or any bank)
3. **Account:** Enter "0123456789" (any 10 digits work in demo)
4. **Your Details:** 
   - Name: Your Name
   - Email: your@email.com
5. **Pay:** Click the payment button
6. **Success:** View your receipt!

---

## 🚨 Common Issues

### Port Already in Use

**Backend (Port 3001):**
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

**Frontend (Port 3000):**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Node Modules Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Backend Won't Start
```bash
cd backend
rm -rf node_modules
npm install
npm start
```

### Frontend Won't Start
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

---

## 🚀 Deploy to Railway

### Quick Deploy

1. **Create Railway account:** https://railway.app/
2. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

3. **Login:**
   ```bash
   railway login
   ```

4. **Deploy backend:**
   ```bash
   cd backend
   railway init
   railway up
   ```

5. **Deploy frontend:**
   ```bash
   cd ../frontend
   railway init
   railway up
   ```

6. **Get URLs:** 
   ```bash
   railway domain
   ```

7. **Set frontend env variable:**
   - Go to Railway dashboard
   - Click frontend project
   - Variables → Add: `VITE_API_URL=your-backend-url`
   - Redeploy

### Alternative: Deploy via GitHub

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Railway Dashboard:**
   - New Project → Deploy from GitHub
   - Select repository
   - Deploy backend first
   - Deploy frontend second
   - Set `VITE_API_URL` environment variable

---

## 📱 Share Your Demo

Once deployed, share the Railway URL with your investor:

**Example:**
```
Hey [Investor Name],

Here's the live demo of QuickRemit:
👉 https://your-app.railway.app

Try sending a test transfer - the whole flow works!

Looking forward to discussing the opportunity.

Best,
[Your Name]
```

---

## 🎯 Next: Prepare Your Demo

Read the **DEMO_GUIDE.md** for:
- Investor pitch script
- Objection handling
- Key metrics
- Closing techniques

---

## 💡 Pro Tips

1. **Test before demo:** Run through the flow 3-4 times
2. **Check mobile:** Open on your phone to show responsiveness
3. **Prepare backup:** Have screenshots in case of internet issues
4. **Know your numbers:** Memorize the key stats from DEMO_GUIDE
5. **Be confident:** You built this - own it!

---

## 📞 Need Help?

- **Documentation:** See README.md
- **Demo Script:** See DEMO_GUIDE.md
- **Architecture:** See backend/server.js comments

---

**You're all set! Go get that investment! 🚀**
