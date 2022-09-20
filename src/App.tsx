import { useState, PropsWithChildren, useEffect } from "react";
import "./styles.css";

// A method specifing a grid
// caprure click order
// animate deselection somehow
// render a grid of cells

const GridLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className={"grid-layout"}>{children}</div>
);
const GridRow: FC<PropsWithChildren> = ({ children }) => (
  <div className={"row"}>{children}</div>
);
const EmptyCell: FC = () => <div className={"cell"} />;

type GridCellProps = {
  onClick: () => void;
  marked?: boolean;
};

const GridCell: FC<GridCellProps> = ({ onClick, marked }) => (
  <div
    className={`cell simple-border  ${marked ? "clicked" : "clickable"}`}
    onClick={onClick}
  />
);

function cellLable(x: number, y: number) {
  return `${x},${y}`;
}

const isMarked = (x: number, y: number, marked: string[]) =>
  marked.includes(cellLable(x, y));

const ReversableButtonGrid: FC<{ grid: boolean[][] }> = ({ grid }) => {
  const [clickOrder, setClickOrder] = useState<string[]>([]); // "x,y" <-- shape
  const [playingBack, setPlayingBack] = useState(false);

  const markCell = (x: number, y: number) =>
    setClickOrder((prev) =>
      isMarked(x, y, prev) ? prev : [...prev, cellLable(x, y)]
    );

  const allCellsMarked =
    clickOrder.length >=
    grid.reduce(
      (sum: number, row: number) => sum + row.filter((cell) => cell).length,
      0
    );

  useEffect(() => {
    if (allCellsMarked) {
      setPlayingBack(true);
    }
    if (clickOrder.length === 0) {
      setPlayingBack(false);
    }
  }, [allCellsMarked, clickOrder]);

  return (
    <GridLayout>
      {grid.map((row: boolean, y: number) => (
        <GridRow key={y}>
          {row.map((cell: boolean, x: number) =>
            cell ? (
              <GridCell
                key={x}
                marked={isMarked(x, y, clickOrder)}
                onClick={() => markCell(x, y)}
              />
            ) : (
              <EmptyCell key={x} />
            )
          )}
        </GridRow>
      ))}
    </GridLayout>
  );
};

const grid = [
  [true, true, true],
  [false, true, false],
  [true, true, true]
];

export default function App() {
  return (
    <>
      <ReversableButtonGrid grid={grid} />
    </>
  );
}
