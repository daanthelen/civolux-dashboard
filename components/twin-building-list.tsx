'use client';

import { Building } from "@/types/map";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card"

interface TwinBuildingListProps {
  twinBuildings: Building[];
}

export function TwinBuildingList({ twinBuildings }: TwinBuildingListProps) {
  return (
    <ScrollArea className="h-full w-full border rounded-md">
      <div className="space-y-1">
        {!twinBuildings || twinBuildings.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No Twin Buildings found</p>
        ) : (
          twinBuildings?.map(twinBuilding => (
            <Card key={twinBuilding.id} className="p-0 border rounded-md">
              <CardContent className="flex items-center justify-between p-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{twinBuilding.address}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </ScrollArea>
  )
}