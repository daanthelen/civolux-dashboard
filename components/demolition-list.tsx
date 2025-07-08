'use client';

import { Demolition } from "@/types/map";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface DemolitionListProps {
  demolitions: Demolition[];
}

export function DemolitionList({ demolitions }: DemolitionListProps) {
  return (
    <ScrollArea className="h-full max-h-250 w-full border rounded-md">
      <div className="space-y-1">
        {!demolitions || demolitions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Geen sloopprojecten gevonden</p>
        ) : (
          demolitions?.map(demolition => (
            <Card key={demolition.id} className="p-0 border rounded-md">
              <CardContent className="flex items-center justify-between p-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{demolition.address}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </ScrollArea>
  )
}