const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function fetchExchangeRate(from, to, amount) {
  const response = await fetch(
    `${API_BASE_URL}/api/rates?from=${from}&to=${to}&amount=${amount}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch exchange rate');
  }
  
  const result = await response.json();
  return result.data;
}

export async function fetchBanks() {
  const response = await fetch(`${API_BASE_URL}/api/banks`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch banks');
  }
  
  const result = await response.json();
  return result.data;
}

export async function verifyAccount(accountNumber, bankCode) {
  const response = await fetch(`${API_BASE_URL}/api/verify-account`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      account_number: accountNumber,
      account_bank: bankCode
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to verify account');
  }
  
  const result = await response.json();
  return result.data;
}

export async function createTransaction(transactionData) {
  const response = await fetch(`${API_BASE_URL}/api/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transactionData)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create transaction');
  }
  
  const result = await response.json();
  return result.data;
}

export async function getTransaction(transactionId) {
  const response = await fetch(`${API_BASE_URL}/api/transactions/${transactionId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch transaction');
  }
  
  const result = await response.json();
  return result.data;
}
