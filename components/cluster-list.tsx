'use client';

import { Cluster } from "@/types/map";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface ClusterListProps {
  clusters: Cluster[];
}

export function ClusterListPage({ clusters }: ClusterListProps) {
  return (
    <ScrollArea className="h-full w-full border rounded-md">
      <div className="space-y-1">
        {!clusters || clusters.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Geen clusters</p>
        ) : (
          clusters?.map(cluster => (
            <Card key={cluster.id} className="p-0 border rounded-md">
              <CardContent className="flex items-center justify-between p-3">
                <div className="flex-1">
                  <p className="text-lg font-bold">Cluster {cluster.id + 1}</p>
                  <p className="text-sm font-medium">Gemiddelde leeftijd: {cluster.average_age ? `${cluster.average_age} jaar` : 'Onbekend'}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </ScrollArea>
  )
}