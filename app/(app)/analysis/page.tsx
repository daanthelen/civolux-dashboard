'use client';

import { useState, useEffect } from "react";

interface ServiceStatus {
  status: 'healthy' | 'unhealthy' | 'pending';
  dataset_loaded?: boolean;
  error?: string;
}

export default function DataAnalysisPage() {
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({status: 'pending'})

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

  return (
    <div>
      <p>Status: {serviceStatus.status}</p>
      {serviceStatus.status == 'healthy' && <p>Dataset loaded: {String(serviceStatus.dataset_loaded)}</p>}
      {serviceStatus.error && <p>Error: {serviceStatus.error}</p>}
    </div>
  )
}