import { useState } from 'react';
import { createTransaction } from '../services/api';

function PaymentStep({ formData, updateFormData, nextStep, prevStep }) {
  const [senderData, setSenderData] = useState({
    name: formData.senderName || '',
    email: formData.senderEmail || ''
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handlePayment = async () => {
    if (!senderData.name || !isValidEmail(senderData.email)) {
      setError('Please provide valid name and email');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // Update form data with sender info
      updateFormData({
        senderName: senderData.name,
        senderEmail: senderData.email
      });

      // Create transaction
      const transaction = await createTransaction({
        sender_name: senderData.name,
        sender_email: senderData.email,
        recipient_name: formData.recipientName,
        recipient_account: formData.recipientAccount,
        recipient_bank: formData.recipientBankName,
        send_amount: formData.sendAmount,
        send_currency: formData.sendCurrency,
        receive_amount: formData.receiveAmount,
        receive_currency: formData.receiveCurrency,
        exchange_rate: formData.exchangeRate,
        fee: formData.fee || 0
      });

      updateFormData({ transactionId: transaction.transaction_id });

      // Simulate payment processing delay
      setTimeout(() => {
        nextStep();
      }, 1500);

    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="step-card">
      <h2>Your details</h2>
      
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          value={senderData.name}
          onChange={(e) => setSenderData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="John Smith"
          className="form-input"
          disabled={processing}
        />
      </div>

      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          value={senderData.email}
          onChange={(e) => setSenderData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="john@example.com"
          className="form-input"
          disabled={processing}
        />
        <small className="form-help">You'll receive a receipt at this email</small>
      </div>

      <div className="transfer-summary">
        <h3>Transfer Summary</h3>
        <div className="summary-row">
          <span>You send:</span>
          <span className="amount">{formData.sendCurrency} {formData.sendAmount.toFixed(2)}</span>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-row">
          <span>Recipient gets:</span>
          <span className="amount highlight">₦ {formData.receiveAmount.toLocaleString('en-NG', { maximumFractionDigits: 2 })}</span>
        </div>
        <div className="summary-row small">
          <span>Exchange rate:</span>
          <span>1 {formData.sendCurrency} = {formData.exchangeRate.toFixed(2)} NGN</span>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-row small">
          <span>Recipient:</span>
          <span>{formData.recipientName}</span>
        </div>
        <div className="summary-row small">
          <span>Account:</span>
          <span>{formData.recipientAccount}</span>
        </div>
        <div className="summary-row small">
          <span>Bank:</span>
          <span>{formData.recipientBankName}</span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="button-group">
        <button 
          className="btn btn-secondary"
          onClick={prevStep}
          disabled={processing}
        >
          Back
        </button>
        <button 
          className="btn btn-primary btn-payment"
          onClick={handlePayment}
          disabled={processing || !senderData.name || !isValidEmail(senderData.email)}
        >
          {processing ? (
            <>
              <div className="spinner-small"></div>
              Processing...
            </>
          ) : (
            <>Pay {formData.sendCurrency} {formData.sendAmount.toFixed(2)}</>
          )}
        </button>
      </div>

      <p className="info-text">
        🔒 This is a demo. No real payment will be processed.
      </p>
    </div>
  );
}

export default PaymentStep;
