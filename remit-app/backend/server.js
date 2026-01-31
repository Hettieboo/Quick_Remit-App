const express = require('express');
const cors = require('cors');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

// Create transactions table
db.serialize(() => {
  db.run(`
    CREATE TABLE transactions (
      id TEXT PRIMARY KEY,
      sender_name TEXT,
      sender_email TEXT,
      recipient_name TEXT,
      recipient_account TEXT,
      recipient_bank TEXT,
      send_amount REAL,
      send_currency TEXT,
      receive_amount REAL,
      receive_currency TEXT,
      exchange_rate REAL,
      fee REAL,
      status TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Flutterwave configuration
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY || 'FLWSECK_TEST-REPLACEME';
const FLW_BASE_URL = 'https://api.flutterwave.com/v3';

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Remit API is running' });
});

// Get exchange rates - WITH HIDDEN MARKUP
app.get('/api/rates', async (req, res) => {
  try {
    const { from = 'USD', to = 'NGN', amount = 100 } = req.query;
    
    // Fetch real-time rates from ExchangeRate-API
    try {
      const rateResponse = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${from}`
      );
      
      if (rateResponse.data && rateResponse.data.rates && rateResponse.data.rates[to]) {
        const realRate = rateResponse.data.rates[to];
        
        // Apply 1.5% markup (hidden in the rate)
        const markup = 0.015; // 1.5%
        const displayRate = realRate * (1 - markup);
        
        const sendAmount = parseFloat(amount);
        const receiveAmount = sendAmount * displayRate;
        
        // Calculate your profit (for internal tracking)
        const profit = sendAmount * realRate - receiveAmount;
        
        return res.json({
          success: true,
          data: {
            from_currency: from,
            to_currency: to,
            rate: displayRate, // Rate shown to user (with markup)
            send_amount: sendAmount,
            receive_amount: receiveAmount,
            total_to_pay: sendAmount, // No separate fee shown
            // Internal tracking (not shown to user)
            _internal: {
              real_rate: realRate,
              markup_percentage: markup * 100,
              profit: profit
            }
          }
        });
      }
    } catch (apiError) {
      console.error('Live rate API failed:', apiError.message);
      // Fall through to fallback rates
    }
    
    // Fallback to static rates if API fails
    console.log('Using fallback rates');
    const fallbackRates = {
      'USD-NGN': 1580,
      'GBP-NGN': 2100,
      'EUR-NGN': 1720,
      'AUD-NGN': 1050,
    };
    
    const rateKey = `${from}-${to}`;
    const realRate = fallbackRates[rateKey] || 1580;
    
    // Apply markup to fallback rates too
    const markup = 0.015;
    const displayRate = realRate * (1 - markup);
    
    const sendAmount = parseFloat(amount);
    const receiveAmount = sendAmount * displayRate;
    const profit = sendAmount * realRate - receiveAmount;
    
    res.json({
      success: true,
      data: {
        from_currency: from,
        to_currency: to,
        rate: displayRate,
        send_amount: sendAmount,
        receive_amount: receiveAmount,
        total_to_pay: sendAmount,
        note: 'Using cached rates',
        _internal: {
          real_rate: realRate,
          markup_percentage: markup * 100,
          profit: profit
        }
      }
    });
    
  } catch (error) {
    console.error('Rate fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch rates' 
    });
  }
});

// Verify Nigerian bank account
app.post('/api/verify-account', async (req, res) => {
  try {
    const { account_number, account_bank } = req.body;
    
    // In production, you'd call Flutterwave's account verification
    // For prototype, we'll simulate success
    
    if (!account_number || !account_bank) {
      return res.status(400).json({
        success: false,
        message: 'Account number and bank code required'
      });
    }
    
    // Simulate account verification
    setTimeout(() => {
      res.json({
        success: true,
        data: {
          account_number: account_number,
          account_name: 'John Doe', // Simulated
          bank_name: getNigerianBankName(account_bank)
        }
      });
    }, 1000);
    
  } catch (error) {
    console.error('Account verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify account' 
    });
  }
});

// Get list of Nigerian banks
app.get('/api/banks', (req, res) => {
  // Simulated Nigerian banks list
  const banks = [
    { code: '044', name: 'Access Bank' },
    { code: '063', name: 'Access Bank (Diamond)' },
    { code: '050', name: 'Ecobank Nigeria' },
    { code: '070', name: 'Fidelity Bank' },
    { code: '011', name: 'First Bank of Nigeria' },
    { code: '214', name: 'First City Monument Bank' },
    { code: '058', name: 'Guaranty Trust Bank' },
    { code: '030', name: 'Heritage Bank' },
    { code: '301', name: 'Jaiz Bank' },
    { code: '082', name: 'Keystone Bank' },
    { code: '526', name: 'Parallex Bank' },
    { code: '076', name: 'Polaris Bank' },
    { code: '101', name: 'Providus Bank' },
    { code: '221', name: 'Stanbic IBTC Bank' },
    { code: '068', name: 'Standard Chartered Bank' },
    { code: '232', name: 'Sterling Bank' },
    { code: '100', name: 'Suntrust Bank' },
    { code: '032', name: 'Union Bank of Nigeria' },
    { code: '033', name: 'United Bank For Africa' },
    { code: '215', name: 'Unity Bank' },
    { code: '035', name: 'Wema Bank' },
    { code: '057', name: 'Zenith Bank' }
  ];
  
  res.json({ success: true, data: banks });
});

// Create transaction
app.post('/api/transactions', (req, res) => {
  try {
    const {
      sender_name,
      sender_email,
      recipient_name,
      recipient_account,
      recipient_bank,
      send_amount,
      send_currency,
      receive_amount,
      receive_currency,
      exchange_rate,
      fee
    } = req.body;
    
    const transactionId = uuidv4();
    
    db.run(
      `INSERT INTO transactions 
       (id, sender_name, sender_email, recipient_name, recipient_account, 
        recipient_bank, send_amount, send_currency, receive_amount, 
        receive_currency, exchange_rate, fee, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        transactionId,
        sender_name,
        sender_email,
        recipient_name,
        recipient_account,
        recipient_bank,
        send_amount,
        send_currency,
        receive_amount,
        receive_currency,
        exchange_rate,
        fee,
        'pending'
      ],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to create transaction'
          });
        }
        
        // Simulate payment processing
        setTimeout(() => {
          db.run(
            'UPDATE transactions SET status = ? WHERE id = ?',
            ['completed', transactionId]
          );
        }, 2000);
        
        res.json({
          success: true,
          data: {
            transaction_id: transactionId,
            status: 'pending',
            message: 'Transaction initiated successfully'
          }
        });
      }
    );
  } catch (error) {
    console.error('Transaction creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create transaction' 
    });
  }
});

// Get transaction by ID
app.get('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  
  db.get(
    'SELECT * FROM transactions WHERE id = ?',
    [id],
    (err, row) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch transaction'
        });
      }
      
      if (!row) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }
      
      res.json({ success: true, data: row });
    }
  );
});

// Get all transactions (for demo purposes)
app.get('/api/transactions', (req, res) => {
  db.all(
    'SELECT * FROM transactions ORDER BY created_at DESC LIMIT 50',
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch transactions'
        });
      }
      
      res.json({ success: true, data: rows || [] });
    }
  );
});

// Helper function
function getNigerianBankName(code) {
  const banks = {
    '044': 'Access Bank',
    '063': 'Access Bank (Diamond)',
    '050': 'Ecobank Nigeria',
    '070': 'Fidelity Bank',
    '011': 'First Bank of Nigeria',
    '214': 'First City Monument Bank',
    '058': 'Guaranty Trust Bank',
    '030': 'Heritage Bank',
    '301': 'Jaiz Bank',
    '082': 'Keystone Bank',
    '076': 'Polaris Bank',
    '221': 'Stanbic IBTC Bank',
    '232': 'Sterling Bank',
    '033': 'United Bank For Africa',
    '057': 'Zenith Bank'
  };
  
  return banks[code] || 'Unknown Bank';
}

app.listen(PORT, () => {
  console.log(`🚀 Remit API server running on port ${PORT}`);
  console.log(`📊 Test the API: http://localhost:${PORT}/health`);
  console.log(`💱 Real-time rates with hidden 1.5% markup`);
});
