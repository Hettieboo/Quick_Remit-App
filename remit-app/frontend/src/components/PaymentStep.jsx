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
