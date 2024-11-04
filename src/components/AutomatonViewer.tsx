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
          className={cn(
            "2xl:w-4 2xl:h-4 lg:h-2 lg:w-2  h-1 w-1 ",
            field === 0 ? "bg-black" : "bg-white"
          )}
        />
      ))}
    </div>
  );
};
