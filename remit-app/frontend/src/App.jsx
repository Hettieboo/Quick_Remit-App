import { useState, useEffect } from 'react';
import './App.css';
import AmountStep from './components/AmountStep';
import RecipientStep from './components/RecipientStep';
import PaymentStep from './components/PaymentStep';
import ConfirmationStep from './components/ConfirmationStep';
import Header from './components/Header';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    sendAmount: 100,
    sendCurrency: 'USD',
    receiveCurrency: 'NGN',
    receiveAmount: 0,
    exchangeRate: 0,
    fee: 0,
    totalToPay: 0,
    senderName: '',
    senderEmail: '',
    recipientName: '',
    recipientAccount: '',
    recipientBank: '',
    recipientBankName: '',
    transactionId: null
  });

  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setFormData({
      sendAmount: 100,
      sendCurrency: 'USD',
      receiveCurrency: 'NGN',
      receiveAmount: 0,
      exchangeRate: 0,
      fee: 0,
      totalToPay: 0,
      senderName: '',
      senderEmail: '',
      recipientName: '',
      recipientAccount: '',
      recipientBank: '',
      recipientBankName: '',
      transactionId: null
    });
  };

  return (
    <div className="app">
      <Header />
      
      <div className="container">
        <div className="progress-bar">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <div className="step-label">Amount</div>
          </div>
          <div className={`progress-line ${currentStep >= 2 ? 'active' : ''}`}></div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <div className="step-label">Recipient</div>
          </div>
          <div className={`progress-line ${currentStep >= 3 ? 'active' : ''}`}></div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <div className="step-label">Payment</div>
          </div>
          <div className={`progress-line ${currentStep >= 4 ? 'active' : ''}`}></div>
          <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
            <div className="step-circle">4</div>
            <div className="step-label">Confirm</div>
          </div>
        </div>

        <div className="step-content">
          {currentStep === 1 && (
            <AmountStep 
              formData={formData} 
              updateFormData={updateFormData}
              nextStep={nextStep}
            />
          )}
          
          {currentStep === 2 && (
            <RecipientStep 
              formData={formData} 
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          
          {currentStep === 3 && (
            <PaymentStep 
              formData={formData} 
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          
          {currentStep === 4 && (
            <ConfirmationStep 
              formData={formData}
              resetFlow={resetFlow}
            />
          )}
        </div>
      </div>

      <footer className="footer">
        <p>🔒 Secure & Fast Money Transfers to Nigeria</p>
        <p className="disclaimer">Demo Version - Test Mode Only</p>
      </footer>
    </div>
  );
}

export default App;
