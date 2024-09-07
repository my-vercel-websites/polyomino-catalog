"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import Link from "next/link";
import { ReactNode, memo, useCallback, useEffect, useState } from "react";
import { Polyomino } from "../components/Polyomino";
import { Coord } from "../lib/coord";
import { getSymmetryGroup } from "../lib/getSymmetryGroup";
import { on } from "../lib/on";
import { relatedPolyominoes } from "../lib/relatedPolyominoes";
import { toBuffer } from "../lib/toBuffer";
import { toString } from "../lib/toString";

export interface PolyominoPageProps {
  getSymmetryGroupResult: ReturnType<typeof getSymmetryGroup>;
}

interface PolyominoCardProps {
  polyomino: Coord[];
  label: string;
  onClick: (e: React.MouseEvent) => void;
}

function PolyominoCard({ polyomino, label, onClick }: PolyominoCardProps) {
  return (
    <div className="flex flex-col items-center">
      <Polyomino
        onClick={onClick}
        polyomino={polyomino}
        width={100}
        height={100}
      />
      <Badge variant="secondary" className="mt-2">
        {label}
      </Badge>
    </div>
  );
}

interface RelatedProps extends PolyominoPageProps {
  onPolyominoClick: (polyomino: Coord[]) => void;
}

function RelatedInternal({
  getSymmetryGroupResult,
  onPolyominoClick,
}: RelatedProps) {
  const { symmetry, subtractive, additive } = relatedPolyominoes(
    getSymmetryGroupResult
  );
  const similar = [...subtractive, ...additive];

  const handlePolyominoClick = useCallback(
    (e: React.MouseEvent, polyomino: Coord[]) => {
      if (e.ctrlKey) {
        return;
      } else {
        e.preventDefault();
        e.stopPropagation();
        onPolyominoClick(polyomino);
      }
    },
    [onPolyominoClick]
  );

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
              <div className="grid grid-cols-4 tablet:grid-cols-3 desktop:grid-cols-2 gap-4">
                {symmetry.map((polyomino, i) => (
                  <PolyominoCard
                    key={toString(toBuffer(polyomino))}
                    polyomino={polyomino}
                    label={`Symmetry ${i + 1}`}
                    onClick={(e) => handlePolyominoClick(e, polyomino)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="similar">
            <div className="grid grid-cols-4 tablet:grid-cols-3 desktop:grid-cols-2 gap-4">
              {similar.map((polyomino, i) => (
                <PolyominoCard
                  key={toString(toBuffer(polyomino))}
                  polyomino={polyomino}
                  label={i < subtractive.length ? "Subtractive" : "Additive"}
                  onClick={(e) => handlePolyominoClick(e, polyomino)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

const Related = memo(RelatedInternal);

interface SidePaneProps {
  polyomino: Coord[];
  onClose: () => void;
  onPolyominoClick: (polyomino: Coord[]) => void;
  isOpen: boolean;
}

function SidePane({
  polyomino,
  onClose,
  onPolyominoClick,
  isOpen,
}: SidePaneProps) {
  useEffect(() => {
    return on(document, "keydown", (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    });
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed desktop:relative inset-y-0 right-0 w-full tablet:w-96 desktop:w-1/3 bg-background shadow-lg p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full desktop:translate-x-0"
      }`}
      aria-hidden={!isOpen}
    >
      <div className="flex justify-between items-center mb-4 desktop:hidden">
        <h2 className="text-2xl font-bold">Polyomino Details</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close side pane"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Polyomino polyomino={polyomino} width="100%" height="200px" />
      <Link href={`/${toString(toBuffer(polyomino))}`}>
        <Button className="mt-4 w-full">Open in Full Page</Button>
      </Link>
      <Related
        getSymmetryGroupResult={getSymmetryGroup(polyomino)}
        onPolyominoClick={onPolyominoClick}
      />
    </div>
  );
}

export function PolyominoPage({
  getSymmetryGroupResult,
}: PolyominoPageProps): ReactNode {
  const [symmetryGroup, polyomino] = getSymmetryGroupResult;
  const [sidePaneOpened, setSidePaneOpened] = useState(false);
  const [sidePanePolyomino, setSidePanePolyomino] = useState<Coord[]>(
    getSymmetryGroupResult[1]
  );

  const handlePolyominoClick = useCallback((clickedPolyomino: Coord[]) => {
    setSidePanePolyomino(clickedPolyomino);
    setSidePaneOpened(true);
  }, []);

  const handleCloseSidePane = useCallback(() => {
    setSidePaneOpened(false);
  }, []);

  return (
    <div className="container mx-auto p-4 desktop:flex desktop:gap-6">
      <div className="desktop:flex-1">
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
        <Related
          getSymmetryGroupResult={getSymmetryGroupResult}
          onPolyominoClick={handlePolyominoClick}
        />
      </div>
      {sidePaneOpened && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 desktop:hidden"
          onClick={handleCloseSidePane}
          aria-hidden="true"
        />
      )}
      <SidePane
        polyomino={sidePanePolyomino}
        onClose={handleCloseSidePane}
        onPolyominoClick={handlePolyominoClick}
        isOpen={sidePaneOpened}
      />
    </div>
  );
}
