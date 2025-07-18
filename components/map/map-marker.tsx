import { MapMarker } from "@/types/map";
import { useEffect, useState } from "react";
import { BsHouseFill } from 'react-icons/bs';
import BarChart, { BarChartProps } from "../dashboard/bar-chart";

interface MarkerProps {
  marker: MapMarker;
  onMarkerClick?: (marker: MapMarker) => void;
}

export default function MarkerComponent({ marker, onMarkerClick }: MarkerProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [chartProps, setChartProps] = useState<BarChartProps | null>(null);

  const handleMarkerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  }

  useEffect(() => {
    if (!marker.materials || marker.materials.length === 0) return;

    const barchartProps: BarChartProps = {
      data: {
        labels: marker.materials.map(material => material.name),
        datasets: [
          {
            label: 'Materialen',
            data: marker.materials.map(material => +material.quantity),
            backgroundColor: 'rgba(99,102,241,0.8)',
            borderRadius: 4
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        animation: false,
      }
    };

    setChartProps(barchartProps);
  }, [marker]);

  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={handleMarkerClick}
    >
      <div className='flex flex-col items-center drop-shadow-xl/20 transition-all duration-200 ease hover:translate-y-[-2px] hover:drop-shadow-xl/25'>
        <div
          className='flex justify-center items-center w-[40px] h-[40px] rounded-full'
          style={{ backgroundColor: marker.color || '#329dd7' }}
        >
          <BsHouseFill size={22} fill='white' className='mb-[2px]' />
        </div>
        <div
          className='h-[0px] w-[0px] mt-[-6px] border-l-14 border-l-transparent border-r-14 border-r-transparent border-t-18'
          style={{ borderTopColor: marker.color || '#329dd7' }}
        />
      </div>

      {showTooltip && (
        <div className='flex flex-col absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 bg-white bg-opacity-80 text-xs px-3 py-2 rounded-md whitespace-nowrap pointer-events-none opacity-100 transition-opacity duration-200 ease-in-out drop-shadow-xl/30'>
          <p className="font-bold mb-2 text-sm">{marker.address}</p>
          {marker.buildYear && <p>Bouwjaar: {marker.buildYear}</p>}
          {marker.area && <p>Oppervlakte: {marker.area}m<sup>2</sup></p>}
          {chartProps && (
            <div className="h-60">
              <BarChart data={chartProps.data} options={chartProps?.options} />
            </div>
          )}
          <div className='absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-solid border-t-white border-r-transparent border-b-transparent border-l-transparent drop-shadow-xl/30' />
        </div>
      )}
    </div>
  )
}