import { useEffect, useState } from 'react';

function ConfirmationStep({ formData, resetFlow }) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  const shareReceipt = () => {
    const receiptText = `
Transfer Successful! 🎉

Transaction ID: ${formData.transactionId}
From: ${formData.senderName}
To: ${formData.recipientName}
Amount Sent: ${formData.sendCurrency} ${formData.sendAmount.toFixed(2)}
Amount Received: ₦${formData.receiveAmount.toLocaleString('en-NG', { maximumFractionDigits: 2 })}
Exchange Rate: 1 ${formData.sendCurrency} = ${formData.exchangeRate.toFixed(2)} NGN
    `.trim();

    if (navigator.share) {
      navigator.share({
        title: 'Transfer Receipt',
        text: receiptText
      });
    } else {
      navigator.clipboard.writeText(receiptText);
      alert('Receipt copied to clipboard!');
    }
  };

  return (
    <div className="step-card confirmation">
      {showConfetti && <div className="confetti">🎉</div>}
      
      <div className="success-icon">
        <div className="success-circle">
          <span className="checkmark">✓</span>
        </div>
      </div>

      <h2>Transfer Successful!</h2>
      <p className="success-message">
        Your money is on its way to {formData.recipientName}
      </p>

      <div className="receipt-card">
        <div className="receipt-header">
          <h3>Receipt</h3>
          <span className="transaction-id">ID: {formData.transactionId?.slice(0, 8)}</span>
        </div>

        <div className="receipt-body">
          <div className="receipt-row">
            <span className="label">From</span>
            <span className="value">{formData.senderName}</span>
          </div>
          <div className="receipt-row">
            <span className="label">To</span>
            <span className="value">{formData.recipientName}</span>
          </div>
          <div className="receipt-divider"></div>
          <div className="receipt-row">
            <span className="label">You sent</span>
            <span className="value">{formData.sendCurrency} {formData.sendAmount.toFixed(2)}</span>
          </div>
          <div className="receipt-row">
            <span className="label">Fee</span>
            <span className="value">{formData.sendCurrency} {formData.fee.toFixed(2)}</span>
          </div>
          <div className="receipt-row">
            <span className="label">Total paid</span>
            <span className="value bold">{formData.sendCurrency} {formData.totalToPay.toFixed(2)}</span>
          </div>
          <div className="receipt-divider"></div>
          <div className="receipt-row highlight-row">
            <span className="label">Recipient gets</span>
            <span className="value bold large">₦ {formData.receiveAmount.toLocaleString('en-NG', { maximumFractionDigits: 2 })}</span>
          </div>
          <div className="receipt-row">
            <span className="label">Exchange rate</span>
            <span className="value">1 {formData.sendCurrency} = {formData.exchangeRate.toFixed(2)} NGN</span>
          </div>
          <div className="receipt-divider"></div>
          <div className="receipt-row">
            <span className="label">Bank</span>
            <span className="value">{formData.recipientBankName}</span>
          </div>
          <div className="receipt-row">
            <span className="label">Account</span>
            <span className="value">{formData.recipientAccount}</span>
          </div>
        </div>

        <div className="receipt-footer">
          <p className="delivery-time">⚡ Delivered in ~1 hour</p>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          className="btn btn-outline"
          onClick={shareReceipt}
        >
          📤 Share Receipt
        </button>
        <button 
          className="btn btn-primary"
          onClick={resetFlow}
        >
          Send Another Transfer
        </button>
      </div>

      <p className="info-text">
        📧 A copy of this receipt has been sent to {formData.senderEmail}
      </p>
    </div>
  );
}

export default ConfirmationStep;
