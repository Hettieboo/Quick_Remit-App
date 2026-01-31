import { useState, useEffect } from 'react';
import { fetchExchangeRate } from '../services/api';

function AmountStep({ formData, updateFormData, nextStep }) {
  const [amount, setAmount] = useState(formData.sendAmount);
  const [currency, setCurrency] = useState(formData.sendCurrency);
  const [loading, setLoading] = useState(false);
  const [rateData, setRateData] = useState(null);

  useEffect(() => {
    loadRate();
  }, [amount, currency]);

  const loadRate = async () => {
    if (amount < 10) return;
    
    setLoading(true);
    try {
      const data = await fetchExchangeRate(currency, 'NGN', amount);
      setRateData(data);
      updateFormData({
        sendAmount: data.send_amount,
        sendCurrency: currency,
        receiveCurrency: 'NGN',
        receiveAmount: data.receive_amount,
        exchangeRate: data.rate,
        fee: data.fee,
        totalToPay: data.total_to_pay
      });
    } catch (error) {
      console.error('Failed to fetch rate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (amount >= 10 && rateData) {
      nextStep();
    }
  };

  return (
    <div className="step-card">
      <h2>How much do you want to send?</h2>
      
      <div className="amount-input-group">
        <div className="input-with-label">
          <label>You send</label>
          <div className="currency-input">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="100"
              min="10"
              step="10"
            />
            <select 
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="currency-select"
            >
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="EUR">EUR</option>
              <option value="AUD">AUD</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="exchange-loader">
            <div className="spinner"></div>
          </div>
        )}

        {!loading && rateData && (
          <div className="exchange-info">
            <div className="exchange-icon">⇅</div>
            <div className="rate-details">
              <div className="rate-text">
                1 {currency} = {rateData.rate.toFixed(2)} NGN
              </div>
              <div className="fee-text">
                Fee: {currency} {rateData.fee.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        <div className="input-with-label">
          <label>Recipient gets</label>
          <div className="currency-input receive-amount">
            <input
              type="text"
              value={rateData ? `₦ ${rateData.receive_amount.toLocaleString('en-NG', { maximumFractionDigits: 2 })}` : '₦ 0.00'}
              readOnly
              className="receive-input"
            />
            <span className="currency-label">NGN</span>
          </div>
        </div>
      </div>

      {rateData && (
        <div className="summary-box">
          <div className="summary-row">
            <span>Send amount:</span>
            <span>{currency} {rateData.send_amount.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Transfer fee:</span>
            <span>{currency} {rateData.fee.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total to pay:</span>
            <span>{currency} {rateData.total_to_pay.toFixed(2)}</span>
          </div>
        </div>
      )}

      <button 
        className="btn btn-primary btn-large"
        onClick={handleContinue}
        disabled={amount < 10 || loading || !rateData}
      >
        Continue
      </button>

      <p className="info-text">
        💡 Minimum transfer amount is {currency} 10
      </p>
    </div>
  );
}

export default AmountStep;
