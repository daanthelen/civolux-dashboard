'use client';

import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from "react";

interface ServiceStatus {
  status: 'healthy' | 'unhealthy' | 'pending';
  datasets_loaded?: boolean;
  error?: string;
}



export default function DataAnalysisPage() {
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({status: 'pending'})
  const [street, setStreet] = useState<string>('');
  const [houseNumber, setHouseNumber] = useState<number | null>(null);
  const [houseNumberAddition, setHouseNumberAddition] = useState<string>('');

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
      {serviceStatus.status == 'healthy' && <p>Dataset loaded: {String(serviceStatus.datasets_loaded)}</p>}
      {serviceStatus.error && <p>Error: {serviceStatus.error}</p>}

      <Label htmlFor="street">Street:</Label>
      <Input id="street" type='text' value={street} onChange={e => setStreet(e.target.value)} required />

      <Label htmlFor="houseNumber">House Number:</Label>
      <Input id="houseNumber" type='number' value={String(houseNumber)} onChange={e => setHouseNumber(parseInt(e.target.value))} required />

      <Label htmlFor="houseNumberAddition">House Number Addition:</Label>
      <Input id="houseNumberAddition" type='text' value={houseNumberAddition} onChange={e => setHouseNumberAddition(e.target.value)} />

      <Button type='submit' onClick={makePrediction} className="border-2 border-black border-solid" >Predict</Button>
    </div>
  )
}