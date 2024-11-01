import { State } from "@/state-machine";
import { useRef, useEffect } from "react";

export const Snapshots = ({
  newRow,
  resetCounter = 0,
  state,
}: {
  newRow: number[];
  resetCounter?: number;
  state: State;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawnRowsRef = useRef(0);
  const squareSize = 5;
  const cols = newRow.length;
  const maxRows = 100;

  console.log(resetCounter);
  console.log(drawnRowsRef.current);

  useEffect(() => {
    drawnRowsRef.current = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [resetCounter]);

  useEffect(() => {
    if (state !== "running") return;
    if (!newRow || newRow.length === 0) return;
    if (drawnRowsRef.current >= maxRows) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const row = drawnRowsRef.current;
    newRow.forEach((color, col) => {
      ctx.fillStyle = color === 0 ? "black" : "white";
      const x = col * squareSize;
      const y = row * squareSize;
      ctx.fillRect(x, y, squareSize, squareSize);
    });

    drawnRowsRef.current += 1;
  }, [newRow, state]);

  if (state !== "running" && state !== "stopped") return null;

  return (
    <div
      className="border border-black mx-auto"
      style={{
        height: maxRows * squareSize,
        width: cols * squareSize,
      }}
    >
      <canvas
        ref={canvasRef}
        width={cols * squareSize}
        height={maxRows * squareSize}
        style={{
          display: "block",
          width: `${cols * squareSize}px`,
          height: `${maxRows * squareSize}px`,
        }}
      />
    </div>
  );
};
