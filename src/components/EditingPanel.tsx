import { State } from "@/state-machine";
import { Button } from "./ui/button";
import { RulesOptions } from "./RulesOptions";
import { InitialStateEditor } from "./InitialStateEditor";

export const EditingPanel = ({
  onChangeRule,
  onToggleCell,
  onSetVector,
  state,
  vector,
  rule,
}: {
  onChangeRule: (rule: number) => void;
  onToggleCell: (index: number) => void;
  onSetVector: (vector: Uint8Array) => void;
  state: State;
  vector: number[];
  rule: number;
}) => {
  if (state !== "editing") return null;

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

  return (
    <section>
      <form className="flex flex-col gap-8 mx-auto">
        <h3 className="text-lg font-bold">Rule</h3>
        <RulesOptions onChangeRule={onChangeRule} rule={rule} />
        <h3 className="text-lg font-bold">Initial State</h3>

        <div className="flex flex-row gap-2">
          {Object.values(options).map(({ name, getter }) => (
            <Button
              key={name}
              variant="outline"
              size="lg"
              type="button"
              onClick={() => onSetVector(getter())}
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
      </form>
    </section>
  );
};

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
