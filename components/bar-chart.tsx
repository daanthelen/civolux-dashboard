'use client';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface BarChartProps {
  data: ChartData<'bar'>;
  options?: ChartOptions<'bar'>;
}

export default function BarChart({ data, options }: BarChartProps) {
  return (
    <Bar data={data} options={options} />
  )
}