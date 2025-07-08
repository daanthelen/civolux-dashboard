'use client';

import { useEffect, useState } from "react";
import { Material } from "@/types/map";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PieChart, { PieChartProps } from '@/components/pie-chart';
import BarChart, { BarChartProps } from '@/components/bar-chart';

interface TotalMaterial extends Material {
  buildings: number;
}

export default function DashboardComponent() {
  const [materials, setMaterials] = useState<TotalMaterial[]>([]);
  const [pieChartData, setPieChartData] = useState<PieChartProps | null>(null);
  const [barChartData, setBarChartData] = useState<BarChartProps | null>(null);

  useEffect(() => {
    const getMaterials = async () => {
      try {
        const response = await fetch('/api/analysis/materials');

        const materialResponse: TotalMaterial[] = await response.json();

        materialResponse.sort((a, b) => b.quantity - a.quantity);

        setMaterials(materialResponse);
      }
      catch (error) {
        console.error(error);
      }
    }

    getMaterials();
  }, []);

  useEffect(() => {
    if (!materials || materials.length === 0) return;

    const pieChartProps: PieChartProps = {
      data: {
        labels: materials.map(material => material.name),
        datasets: [
          {
            data: materials.map(material => material.quantity),
            backgroundColor: [
              'rgba(199,210,254,0.8)',
              'rgba(165,180,252,0.8)',
              'rgba(129,140,248,0.8)',
              'rgba(99,102,241,0.8)',
              'rgba(79,70,229,0.8)',
              'rgba(67,56,202,0.8)',
              'rgba(55,48,163,0.8)',
              'rgba(49,46,129,0.8)',
            ],
            borderColor: 'white',
            borderWidth: 2,
          },
        ],
      }
    };

    const barChartProps: BarChartProps = {
      data: {
        labels: materials.map(material => material.name),
        datasets: [
          {
            label: 'Gemiddeld materialen per gebouw',
            data: materials.map(material => material.quantity / material.buildings),
            backgroundColor: 'rgba(99,102,241,0.8)',
            borderRadius: 4,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
      }
    };

    setPieChartData(pieChartProps);
    setBarChartData(barChartProps);
  }, [materials]);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
      <Card className='lg:col-span-2 h-fit bg-white rounded-lg shadow overflow-auto'>
        <CardHeader>
          <CardTitle className='text-indigo-700 font-bold text-lg'>Overzicht Materialen</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className='min-w-full table-auto border-collapse border border-gray-200'>
            <TableHeader className='bg-indigo-100'>
              <TableRow>
                <TableHead className='border border-gray-300 px-4 py-2 font-bold text-left text-indigo-700'>Materiaal</TableHead>
                <TableHead className='border border-gray-300 px-4 py-2 font-bold text-right text-indigo-700'>Hoeveelheid (m³)</TableHead>
                <TableHead className='border border-gray-300 px-4 py-2 font-bold text-right text-indigo-700'>Aantal Gebouwen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map(material => (
                <TableRow key={material.name} className='hover:bg-indigo-50 even:bg-indigo-50'>
                  <TableCell className='border border-gray-300 px-4 py-2'>{material.name}</TableCell>
                  <TableCell className='border border-gray-300 px-4 py-2 text-right'>{material.quantity.toLocaleString()}</TableCell>
                  <TableCell className='border border-gray-300 px-4 py-2 text-right font-semibold'>{material.buildings}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {barChartData && (
            <div className="mt-10">
              <h3 className="font-semibold text-indigo-600 mb-3">Gemiddelden per Materiaal</h3>
              <div className='h-[250px]'>
                <BarChart data={barChartData.data} options={barChartData.options} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className='bg-white rounded-lg h-fit shadow'>
        <CardHeader>
          <CardTitle className='text-indigo-700 font-bold text-lg'>Visuele Overzichten</CardTitle>
        </CardHeader>
        <CardContent>
          {pieChartData && (
            <div className='mb-10'>
              <h3 className='font-semibold text-indigo-600 mb-3'>Materiaalverdeling (m³)</h3>
              <div className='h-[300px]'>
                <PieChart data={pieChartData.data} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}