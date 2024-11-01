import { cn } from "@/lib/utils";
import { State } from "@/state-machine";

export const AutomatonViewer = ({
  fields,
  state,
}: {
  fields: number[];
  state: State;
}) => {
  if (state === "editing") return null;

  return (
    <div className="flex flex-row w-[128rem] mx-auto justify-center absolute left-1/2 -translate-x-1/2">
      {fields.map((field, index) => (
        <div
          key={index}
          className={cn("w-4 h-4", field === 0 ? "bg-black" : "bg-white")}
        />
      ))}
    </div>
  );
};
