import { MapMarker } from "@/types/map";
import { useState } from "react";
import { BsHouseFill } from 'react-icons/bs';

interface MarkerProps {
  marker: MapMarker;
  onMarkerClick?: (marker: MapMarker) => void;
}

export default function MarkerComponent({ marker, onMarkerClick }: MarkerProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMarkerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  }

  return (
    <div
      // className='relative' // A container to position the tooltip relative to
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={handleMarkerClick}
    >
      <div className='flex flex-col items-center drop-shadow-xl/25 transition-all duration-200 ease hover:translate-y-[-2px] hover:drop-shadow-xl/30'>
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
          <p>Bouwjaar: {marker.buildYear}</p>
          <p>Oppervlakte: {marker.area}m<sup>2</sup></p>
          <div className='absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-solid border-t-white border-r-transparent border-b-transparent border-l-transparent drop-shadow-xl/30' />
        </div>
      )}
    </div>
  )
}