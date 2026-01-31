import { useState, useEffect } from 'react';
import { fetchBanks, verifyAccount } from '../services/api';

function RecipientStep({ formData, updateFormData, nextStep, prevStep }) {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [accountVerified, setAccountVerified] = useState(false);
  
  const [recipientData, setRecipientData] = useState({
    account: formData.recipientAccount || '',
    bank: formData.recipientBank || '',
    name: formData.recipientName || ''
  });

  useEffect(() => {
    loadBanks();
  }, []);

  const loadBanks = async () => {
    setLoading(true);
    try {
      const data = await fetchBanks();
      setBanks(data);
    } catch (error) {
      console.error('Failed to fetch banks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAccount = async () => {
    if (recipientData.account.length !== 10 || !recipientData.bank) {
      return;
    }

    setVerifying(true);
    try {
      const data = await verifyAccount(recipientData.account, recipientData.bank);
      setRecipientData(prev => ({ ...prev, name: data.account_name }));
      setAccountVerified(true);
      
      const selectedBank = banks.find(b => b.code === recipientData.bank);
      updateFormData({
        recipientAccount: recipientData.account,
        recipientBank: recipientData.bank,
        recipientBankName: selectedBank?.name || '',
        recipientName: data.account_name
      });
    } catch (error) {
      console.error('Verification failed:', error);
      setAccountVerified(false);
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (recipientData.account.length === 10 && recipientData.bank) {
      handleVerifyAccount();
    } else {
      setAccountVerified(false);
    }
  }, [recipientData.account, recipientData.bank]);

  const handleContinue = () => {
    if (accountVerified) {
      nextStep();
    }
  };

  return (
    <div className="step-card">
      <h2>Who are you sending to?</h2>
      
      <div className="form-group">
        <label>Bank</label>
        <select
          value={recipientData.bank}
          onChange={(e) => setRecipientData(prev => ({ ...prev, bank: e.target.value }))}
          className="form-select"
          disabled={loading}
        >
          <option value="">Select bank</option>
          {banks.map(bank => (
            <option key={bank.code} value={bank.code}>
              {bank.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Account Number</label>
        <input
          type="text"
          value={recipientData.account}
          onChange={(e) => setRecipientData(prev => ({ 
            ...prev, 
            account: e.target.value.replace(/\D/g, '').slice(0, 10)
          }))}
          placeholder="0123456789"
          maxLength="10"
          className="form-input"
        />
        {recipientData.account.length === 10 && recipientData.bank && verifying && (
          <div className="verification-status verifying">
            <div className="spinner-small"></div>
            <span>Verifying account...</span>
          </div>
        )}
        {accountVerified && (
          <div className="verification-status verified">
            <span className="check-icon">✓</span>
            <span>Account verified</span>
          </div>
        )}
      </div>

      {accountVerified && (
        <div className="verified-account-box">
          <div className="account-icon">👤</div>
          <div className="account-details">
            <div className="account-name">{recipientData.name}</div>
            <div className="account-info">
              {recipientData.account} • {banks.find(b => b.code === recipientData.bank)?.name}
            </div>
          </div>
        </div>
      )}

      <div className="button-group">
        <button 
          className="btn btn-secondary"
          onClick={prevStep}
        >
          Back
        </button>
        <button 
          className="btn btn-primary"
          onClick={handleContinue}
          disabled={!accountVerified}
        >
          Continue
        </button>
      </div>

      <p className="info-text">
        🔒 Your recipient's information is encrypted and secure
      </p>
    </div>
  );
}

export default RecipientStep;
