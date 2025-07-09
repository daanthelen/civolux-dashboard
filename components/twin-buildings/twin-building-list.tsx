'use client';

import { Building } from "@/types/map";
import { ScrollArea } from "../ui/scroll-area";
import { TwinBuildingListItem } from "./twin-building-list-item";

interface TwinBuildingListProps {
  twinBuildings: Building[];
  onTwinBuildingClick: (twinBuilding: Building) => void;
}

export function TwinBuildingList({ twinBuildings = [], onTwinBuildingClick }: TwinBuildingListProps) {
  return (
    <ScrollArea className="h-full w-full border rounded-md shadow-sm">
      <div className="space-y-1">
        {!twinBuildings || twinBuildings.length === 0 ? (
          <p className="text-xs 2xl:text-sm text-muted-foreground text-center py-8">Geen Twin Buildings gevonden</p>
        ) : (
          twinBuildings?.map(twinBuilding => (
            <TwinBuildingListItem
              key={twinBuilding.id}
              twinBuilding={twinBuilding}
              onClick={onTwinBuildingClick}
            />
          ))
        )}
      </div>
    </ScrollArea>
  )
}