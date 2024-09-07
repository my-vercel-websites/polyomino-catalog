"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import Link from "next/link";
import { ReactNode, memo, useCallback, useEffect, useState } from "react";
import { Comment } from "../components/Comment";
import { Polyomino } from "../components/Polyomino";
import { SymmetryGroup } from "../lib/SymmetryGroup";
import { Coord } from "../lib/coord";
import { getSymmetryGroup } from "../lib/getSymmetryGroup";
import { on } from "../lib/on";
import { relatedPolyominoes } from "../lib/relatedPolyominoes";
import { toBuffer } from "../lib/toBuffer";
import { toString } from "../lib/toString";

export interface PolyominoPageProps {
  getSymmetryGroupResult: ReturnType<typeof getSymmetryGroup>;
}

const gridClassName =
  "grid grid-cols-4 tablet:grid-cols-6 desktop:grid-cols-5 tablet:group-[.side-pane]:grid-cols-2 desktop:group-[.closed]:grid-cols-8 desktop:group-[.closed_.side-pane]:grid-cols-2 gap-4";

const getSymmetryGroupResultIndexToName = [
  "90°",
  "180°",
  "270°",
  "transpose",
  "flip X",
  "flip diagonally",
  "flip Y",
];

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
  const [_, self] = getSymmetryGroupResult;

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
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="symmetry">Symmetry</TabsTrigger>
            <TabsTrigger value="subtractive">Subtractive</TabsTrigger>
            <TabsTrigger value="additive">Additive</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className={gridClassName}>
              <PolyominoCard
                key={toString(toBuffer(self))}
                polyomino={self}
                label="self"
                onClick={(e) => handlePolyominoClick(e, self)}
              />
              {symmetry.map((polyomino, i) => (
                <PolyominoCard
                  key={toString(toBuffer(polyomino))}
                  polyomino={polyomino}
                  label={
                    getSymmetryGroupResultIndexToName[
                      getSymmetryGroupResult.indexOf(polyomino) - 2
                    ]
                  }
                  onClick={(e) => handlePolyominoClick(e, polyomino)}
                />
              ))}
              {subtractive.map((polyomino, i) => (
                <PolyominoCard
                  key={toString(toBuffer(polyomino))}
                  polyomino={polyomino}
                  label="Subtractive"
                  onClick={(e) => handlePolyominoClick(e, polyomino)}
                />
              ))}
              {additive.map((polyomino, i) => (
                <PolyominoCard
                  key={toString(toBuffer(polyomino))}
                  polyomino={polyomino}
                  label="Additive"
                  onClick={(e) => handlePolyominoClick(e, polyomino)}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="symmetry">
            {!symmetry.length ? (
              <div className="text-muted-foreground">
                No symmetry polyominoes.
              </div>
            ) : (
              <div className={gridClassName}>
                {symmetry.map((polyomino, i) => (
                  <PolyominoCard
                    key={toString(toBuffer(polyomino))}
                    polyomino={polyomino}
                    label={
                      getSymmetryGroupResultIndexToName[
                        getSymmetryGroupResult.indexOf(polyomino) - 2
                      ]
                    }
                    onClick={(e) => handlePolyominoClick(e, polyomino)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="subtractive">
            <div className={gridClassName}>
              {subtractive.map((polyomino, i) => (
                <PolyominoCard
                  key={toString(toBuffer(polyomino))}
                  polyomino={polyomino}
                  label="Subtractive"
                  onClick={(e) => handlePolyominoClick(e, polyomino)}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="additive">
            <div className={gridClassName}>
              {additive.map((polyomino, i) => (
                <PolyominoCard
                  key={toString(toBuffer(polyomino))}
                  polyomino={polyomino}
                  label="Additive"
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
      className={`group side-pane fixed desktop:relative inset-y-0 right-0 w-full tablet:w-96 desktop:w-1/3 bg-background shadow-lg p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
        isOpen
          ? "translate-x-0"
          : "translate-x-full desktop:translate-x-0 desktop:hidden"
      }`}
      aria-hidden={!isOpen}
    >
      <div className="flex justify-between items-center mb-4">
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

interface BadgesProps {
  polyomino: Coord[];
  symmetryGroup: SymmetryGroup;
}

function Badges({ polyomino, symmetryGroup }: BadgesProps) {
  return (
    <div className="flex flex-wrap gap-x-4">
      <Badge className="mt-4">Symmetry Group: {symmetryGroup}</Badge>
      <Badge className="mt-4">Tile count: {polyomino.length}</Badge>
      {[
        "All",
        "Rotation2FoldMirror90",
        "Rotation2FoldMirror45",
        "Rotation2Fold",
      ].includes(symmetryGroup) && (
        <Badge className="mt-4">Rotation 2 Fold</Badge>
      )}
      {["All", "Rotation4Fold"].includes(symmetryGroup) && (
        <Badge className="mt-4">Rotation 4 Fold</Badge>
      )}
      {["All", "Rotation2FoldMirror90", "Mirror90"].includes(symmetryGroup) && (
        <Badge className="mt-4">Mirror 90°</Badge>
      )}
      {["All", "Rotation2FoldMirror45", "Mirror45"].includes(symmetryGroup) && (
        <Badge className="mt-4">Mirror 45°</Badge>
      )}
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
    <div
      className={`${
        sidePaneOpened ? "opened" : "closed"
      } group container mx-auto p-4 desktop:flex desktop:gap-6`}
    >
      <div className="desktop:flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Main Polyomino</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <Polyomino polyomino={polyomino} width="40vw" height="40vw" />
              <Badges polyomino={polyomino} symmetryGroup={symmetryGroup} />
            </div>
          </CardContent>
        </Card>
        <Related
          getSymmetryGroupResult={getSymmetryGroupResult}
          onPolyominoClick={handlePolyominoClick}
        />
        <Comment canonized={toString(toBuffer(polyomino))} />
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
