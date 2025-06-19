'use client';

import { useState, useEffect } from "react";

interface ServiceStatus {
  status: 'healthy' | 'unhealthy' | 'pending';
  dataset_loaded?: boolean;
  error?: string;
}

export default function DataAnalysisPage() {
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({status: 'pending'})
  const [street, setStreet] = useState<string>('');
  const [houseNumber, setHouseNumber] = useState<number | null>(null);

  useEffect(() => {
    checkServiceHealth();
  }, []);

  const checkServiceHealth = async () => {
    try {
      const response = await fetch('/api/analysis/health');
      const status = await response.json();
      setServiceStatus(status);
    }
    catch (error) {
      setServiceStatus({
        status: 'unhealthy',
        error: (error as Error).message,
      });
    }
  }

  const makePrediction = async () => {
    try {
      const response = await fetch('/api/analysis/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          street: street,
          house_number: houseNumber,
        }),
      });

      const result = await response.json();

      console.log(result);
    }
    catch {
      
    }
  }

  return (
    <div>
      <p>Status: {serviceStatus.status}</p>
      {serviceStatus.status == 'healthy' && <p>Dataset loaded: {String(serviceStatus.dataset_loaded)}</p>}
      {serviceStatus.error && <p>Error: {serviceStatus.error}</p>}

      <p>Street:</p>
      <input type='text' value={street} onChange={e => setStreet(e.target.value)} required />

      <p>House Number:</p>
      <input type='number' value={String(houseNumber)} onChange={e => setHouseNumber(parseInt(e.target.value))} required />

      <button type='submit' onClick={makePrediction} className="border-2 border-black border-solid" >Predict</button>
    </div>
  )
}