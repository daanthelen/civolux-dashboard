'use client';

import { Building } from "@/types/map";
import { Card, CardContent } from "@/components/ui/card";

interface TwinBuildingListItemProps {
  twinBuilding: Building;
  onClick: (twinbuilding: Building) => void;
}

export function TwinBuildingListItem({ twinBuilding, onClick }: TwinBuildingListItemProps) {
  return (
    <Card
      key={twinBuilding.id}
      className="p-0 border rounded-md hover:cursor-pointer hover:bg-gray-100"
      onClick={() => onClick(twinBuilding)}
    >
      <CardContent className="flex items-center justify-between p-3">
        <div className="flex-1">
          <p><span className="text-sm font-medium">{twinBuilding.address}</span> <span className="text-sm font-normal">({twinBuilding.building_type})</span></p>
        </div>
      </CardContent>
      </Card>
  )
}