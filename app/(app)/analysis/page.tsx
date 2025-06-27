'use client';

import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from "react";

interface ServiceStatus {
  status: 'healthy' | 'unhealthy' | 'pending';
  dataset_loaded?: boolean;
  error?: string;
}

interface TwinBuilding {
  longitude: number;
  latitude: number;
  build_year: number;
  area: number;
  building_type: string;
}

export default function DataAnalysisPage() {
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({status: 'pending'})
  const [street, setStreet] = useState<string>('');
  const [houseNumber, setHouseNumber] = useState<number | null>(null);
  const [houseNumberAddition, setHouseNumberAddition] = useState<string>('');
  const [twinBuildings, setTwinBuildings] = useState<TwinBuilding[]>([])

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

  const findTwinBuildings = async () => {
    try {
      const response = await fetch('/api/analysis/twin-buildings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          street: street,
          house_number: houseNumber,
          house_number_addition: houseNumberAddition,
        }),
      });
      const twins = await response.json();
      setTwinBuildings(twins);
    }
    catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log(twinBuildings);
  }, [twinBuildings]);

  // const makePrediction = async () => {
  //   try {
  //     const response = await fetch('/api/analysis/predict', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         street: street,
  //         house_number: houseNumber,
  //       }),
  //     });

  //     const result = await response.json();

  //     console.log(result);
  //   }
  //   catch {
      
  //   }
  // }

  return (
    <div>
      <p>Status: {serviceStatus.status}</p>
      {serviceStatus.status == 'healthy' && <p>Dataset loaded: {String(serviceStatus.dataset_loaded)}</p>}
      {serviceStatus.error && <p>Error: {serviceStatus.error}</p>}

      <Label htmlFor="street">Street:</Label>
      <Input id="street" type='text' value={street} onChange={e => setStreet(e.target.value)} required />

      <Label htmlFor="houseNumber">House Number:</Label>
      <Input id="houseNumber" type='number' value={String(houseNumber)} onChange={e => setHouseNumber(parseInt(e.target.value))} required />

      <Label htmlFor="houseNumberAddition">House Number Addition:</Label>
      <Input id="houseNumberAddition" type='text' value={houseNumberAddition} onChange={e => setHouseNumberAddition(e.target.value)} />

      <Button type='submit' onClick={findTwinBuildings} className="border-2 border-black border-solid" >Predict</Button>
    </div>
  )
}