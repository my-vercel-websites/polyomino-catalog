"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { memo, ReactNode } from "react";
import { Polyomino } from "../components/Polyomino";
import { getSymmetryGroup } from "../lib/getSymmetryGroup";
import { relatedPolyominoes } from "../lib/relatedPolyominoes";

export interface PolyominoPageProps {
  getSymmetryGroupResult: ReturnType<typeof getSymmetryGroup>;
}

function RelatedInternal({ getSymmetryGroupResult }: PolyominoPageProps) {
  const { symmetry, subtractive, additive } = relatedPolyominoes(
    getSymmetryGroupResult
  );
  const similar = [...subtractive, ...additive];

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Related Polyominoes</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="symmetry">
          <TabsList>
            <TabsTrigger value="symmetry">Symmetry</TabsTrigger>
            <TabsTrigger value="similar">Similar</TabsTrigger>
          </TabsList>
          <TabsContent value="symmetry">
            {!symmetry.length ? (
              <div className="text-muted-foreground">
                No symmetry polyominoes.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {symmetry.map((polyomino, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <Polyomino polyomino={polyomino} width={100} height={100} />
                    <Badge variant="secondary" className="mt-2">
                      Symmetry {i + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="similar">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {similar.map((polyomino, i) => (
                <div key={i} className="flex flex-col items-center">
                  <Polyomino polyomino={polyomino} width={100} height={100} />
                  <Badge variant="outline" className="mt-2">
                    {i < subtractive.length ? "Subtractive" : "Additive"}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

const Related = memo(RelatedInternal);

export function PolyominoPage({
  getSymmetryGroupResult,
}: PolyominoPageProps): ReactNode {
  const [symmetryGroup, polyomino] = getSymmetryGroupResult;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Main Polyomino</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <Polyomino polyomino={polyomino} width="100%" height="40vw" />
            <Badge className="mt-4">Symmetry Group: {symmetryGroup}</Badge>
          </div>
        </CardContent>
      </Card>
      <Related getSymmetryGroupResult={getSymmetryGroupResult} />
    </div>
  );
}
