import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import MapContainer from '@/components/map-container';
import MapComponent from "@/components/map";

export default function CalendarPage() {
  return (
    <div>
      <Card className='lg:col-span-2 h-fit bg-white rounded-lg shadow overflow-auto'>
        <CardHeader>
          <CardTitle className='text-indigo-700 font-bold text-2xl'>Sloopkalender</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-4 mb-6'>

          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              Table
              Calendar
            </div>
            <div className='h-[500px] w-[500px]'>
              <MapComponent />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}