import { cn } from "@/lib/utils";
import { State } from "@/state-machine";

export const InitialStateEditor = ({
  vector,
  onToggleCell,
}: {
  vector: number[];
  state: State;
  onToggleCell: (index: number) => void;
}) => {
  return (
    <div
      className={cn(
        "flex flex-row mx-auto justify-center gap-1 bg-gray-500 p-4 rounded-lg w-[130rem]",
        "absolute left-1/2 -translate-x-1/2"
      )}
    >
      {vector.map((cell, index) => (
        <div
          key={index}
          onClick={() => onToggleCell(index)}
          className={cn(
            "w-3 h-3 cursor-pointer",
            cell === 0 ? "bg-black" : "bg-white"
          )}
        />
      ))}
    </div>
  );
};
