'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: ChartData<'pie'>;
}

export default function PieChart({ data }: PieChartProps) {
  return (
    <Pie data={data} />
  )
}