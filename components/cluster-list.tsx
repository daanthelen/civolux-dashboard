'use client';

import { Cluster } from "@/types/map";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

interface ClusterListProps {
  clusters: Cluster[];
}

export function ClusterList({ clusters }: ClusterListProps) {
  return (
    <ScrollArea className="h-full max-h-screen w-full border rounded-md">
      <div className="space-y-1">
        {!clusters || clusters.length === 0 ? (
          <p className="text-xs 2xl:text-sm text-muted-foreground text-center py-8">Geen clusters</p>
        ) : (
          clusters?.map(cluster => (
            <Card key={cluster.id} className="p-0 border rounded-md">
              <CardContent className="flex items-center justify-between p-3">
                <div className="flex-1">
                  <p className="text-base 2xl:text-lg font-bold">Cluster {cluster.id + 1}</p>
                  <p className="text-xs 2xl:text-sm font-medium">Gemiddelde leeftijd: {cluster.average_age ? `${cluster.average_age.toLocaleString()} jaar` : 'Onbekend'}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </ScrollArea>
  )
}