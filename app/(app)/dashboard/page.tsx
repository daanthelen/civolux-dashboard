import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PieChart from '@/components/pie-chart';
import BarChart from '@/components/bar-chart';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const tableData = [
  {
    id: 1,
    material: 'Bakstenen',
    quantity: 1200,
    location: 'Amsterdam',
    estimatedHouses: 24,
  },
  {
    id: 2,
    material: 'Hout',
    quantity: 850,
    location: 'Rotterdam',
    estimatedHouses: 17,
  },
  {
    id: 3,
    material: 'Beton',
    quantity: 1400,
    location: 'Utrecht',
    estimatedHouses: 28,
  },
  {
    id: 4,
    material: 'Staal',
    quantity: 400,
    location: 'Eindhoven',
    estimatedHouses: 8,
  },
  {
    id: 5,
    material: 'Graniet',
    quantity: 150,
    location: 'Maastricht',
    estimatedHouses: 9,
  },
  {
    id: 6,
    material: 'Koper',
    quantity: 120,
    location: 'Amsterdam',
    estimatedHouses: 16,
  },
  {
    id: 7,
    material: 'Dakpannen',
    quantity: 350,
    location: 'Heerlen',
    estimatedHouses: 21,
  },
];

const pieChartData = {
  labels: ['Bakstenen', 'Hout', 'Beton', 'Metaal'],
  datasets: [
    {
      data: [1200, 850, 1400, 400],
      backgroundColor: [
        'rgba(99,102,241,0.8)',    // Indigo 500
        'rgba(129,140,248,0.8)',   // Indigo 400
        'rgba(79,70,229,0.8)',     // Indigo 600
        'rgba(67,56,202,0.8)'      // Indigo 700
      ],
      borderColor: 'white',
      borderWidth: 2,
    }
  ],
}

const barChartData = {
  data: {
    labels: ['Bakstenen', 'Hout', 'Beton', 'Metaal'],
    datasets: [
      {
        label: 'Geschatte Huizen',
        data: [24, 17, 28, 8],
        backgroundColor: 'rgba(99,102,241,0.8)',
        borderRadius: 4
      }
    ],
  },
  options: {
    maintainAspectRatio: false,
  }
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/login');
  }

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
                <TableHead className='border border-gray-300 px-4 py-2 font-bold text-right text-indigo-700'>Locatie</TableHead>
                <TableHead className='border border-gray-300 px-4 py-2 font-bold text-right text-indigo-700'>Geschatte Huizen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map(data => (
                <TableRow key={data.id} className='hover:bg-indigo-50 even:bg-indigo-50'>
                  <TableCell className='border border-gray-300 px-4 py-2'>{data.material}</TableCell>
                  <TableCell className='border border-gray-300 px-4 py-2 text-right'>{data.quantity}</TableCell>
                  <TableCell className='border border-gray-300 px-4 py-2 text-right'>{data.location}</TableCell>
                  <TableCell className='border border-gray-300 px-4 py-2 text-right font-semibold'>{data.estimatedHouses}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card className='bg-white rounded-lg shadow'>
        <CardHeader>
          <CardTitle className='text-indigo-700 font-bold text-lg'>Visuele Overzichten</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='mb-10'>
            <h3 className='font-semibold text-indigo-600 mb-4'>Materiaalverdeling (m³)</h3>
            <div className='h-[400px]'>
              <PieChart data={pieChartData} />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-indigo-600 mb-4">Huizen Bouwvoorspelling per Materiaal</h3>
            <div className='h-[400px]'>
              <BarChart data={barChartData.data} options={barChartData.options} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}