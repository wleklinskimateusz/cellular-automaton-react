import { State } from "@/state-machine";
import { Button } from "./ui/button";
import { RulesOptions } from "./RulesOptions";
import { InitialStateEditor } from "./InitialStateEditor";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const getAliveInTheMiddle = () => {
  const vector = new Uint8Array(128);
  vector[64] = 1;
  return vector;
};

const getRandomVector = () => {
  const vector = new Uint8Array(128);
  for (let i = 0; i < vector.length; i++) {
    vector[i] = Math.random() > 0.5 ? 1 : 0;
  }
  return vector;
};

const getEmptyVector = () => {
  return new Uint8Array(128).fill(0);
};

const getGlider = () => {
  const vector = new Uint8Array(128);
  vector[64] = 1;
  vector[63] = 1;
  vector[65] = 1;
  return vector;
};

const getReversedGlider = () => {
  const vector = new Uint8Array(128).fill(1);
  vector[64] = 0;
  vector[63] = 0;
  vector[65] = 0;
  return vector;
};

const getFullVector = () => {
  return new Uint8Array(128).fill(1);
};

const options = {
  aliveInTheMiddle: {
    name: "Alive in the middle",
    getter: getAliveInTheMiddle,
  },
  random: { name: "Random", getter: getRandomVector },
  empty: { name: "Empty", getter: getEmptyVector },
  glider: { name: "Glider", getter: getGlider },
  reversedGlider: { name: "Reversed Glider", getter: getReversedGlider },
  full: { name: "Full", getter: getFullVector },
};
export const EditingPanel = ({
  onChangeRule,
  onToggleCell,
  onSetVector,
  onSetBoundary,
  state,
  vector,
  rule,
  boundary,
}: {
  onChangeRule: (rule: number) => void;
  onToggleCell: (index: number) => void;
  onSetVector: (vector: Uint8Array) => void;
  onSetBoundary: (boundary: "periodic" | "fixed") => void;
  state: State;
  vector: number[];
  rule: number;
  boundary: "periodic" | "fixed";
}) => {
  const [startingVector, setStartingVector] =
    useState<keyof typeof options>("empty");
  if (state !== "editing") return null;

  return (
    <section>
      <form className="flex flex-col gap-8 mx-auto">
        <section>
          <h3 className="text-lg font-bold">Rule</h3>
          <RulesOptions onChangeRule={onChangeRule} rule={rule} />
        </section>

        <section>
          <h3 className="text-lg font-bold">Boundary</h3>
        </section>
        <section>
          <RadioGroup defaultValue={boundary} onValueChange={onSetBoundary}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="periodic" id="periodic" />
              <Label htmlFor="periodic">Periodic</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fixed" id="fixed" />
              <Label htmlFor="fixed">Fixed</Label>
            </div>
          </RadioGroup>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">Initial State</h3>

          <div className="flex flex-row gap-2">
            {Object.values(options).map(({ name, getter }) => (
              <Button
                key={name}
                variant="outline"
                size="lg"
                type="button"
                className={cn(
                  startingVector === name && "bg-blue-500 text-white"
                )}
                onClick={() => {
                  setStartingVector(name as keyof typeof options);
                  onSetVector(getter());
                }}
              >
                {name}
              </Button>
            ))}
          </div>

          <div className="relative">
            <InitialStateEditor
              vector={vector}
              onToggleCell={onToggleCell}
              state={state}
            />
          </div>
        </section>
      </form>
    </section>
  );
};
