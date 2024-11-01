import "./App.css";
import { Button } from "./components/ui/button";

import { useMachine } from "@xstate/react";
import { Snapshots } from "./components/Snapshots";
import { EditingPanel } from "./components/EditingPanel";
import { automatonMachineDefinition, Send, State } from "./state-machine";
import { AutomatonViewer } from "./components/AutomatonViewer";

const aliveInTheMiddle = new Uint8Array(128).fill(0);
aliveInTheMiddle[64] = 1;

function App() {
  const [
    {
      value: state,
      context: { vector: uIntVector, resetCounter, rule },
    },
    send,
  ] = useMachine(automatonMachineDefinition);
  const vector = Array.from(uIntVector);

  return (
    <main className="flex flex-col gap-8 py-8 max-w-screen-2xl mx-auto">
      <h1 className="text-4xl text-center font-bold">Cellular Automaton</h1>
      <h2 className="text-3xl text-center font-bold">
        {capitalize(state)} {state !== "editing" ? `- Rule ${rule}` : ""}
      </h2>
      <EditingPanel
        state={state}
        vector={vector}
        rule={rule}
        onChangeRule={(rule) => send({ type: "rule.set", rule })}
        onToggleCell={(index) => send({ type: "toggle.cell", index })}
        onSetVector={(vector) => send({ type: "set.vector", vector })}
      />
      <div className="flex flex-row w-[128rem] h-32 mx-auto justify-center">
        <AutomatonViewer fields={vector} state={state} />
      </div>

      <div className="flex gap-4 p-4 relative items-center justify-center">
        <ActionButtons state={state} send={send} />
      </div>
      <Snapshots newRow={vector} resetCounter={resetCounter} state={state} />
    </main>
  );
}

const ActionButtons = ({ state, send }: { state: State; send: Send }) => {
  if (state === "editing") {
    return (
      <Button size="lg" onClick={() => send({ type: "save" })}>
        Save
      </Button>
    );
  }
  if (state === "idle") {
    return (
      <>
        <Button size="lg" onClick={() => send({ type: "run" })}>
          Start
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => send({ type: "edit" })}
        >
          Edit
        </Button>
      </>
    );
  }

  if (state === "running") {
    return (
      <>
        <Button size="lg" onClick={() => send({ type: "stop" })}>
          Stop
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => send({ type: "reset" })}
        >
          Reset
        </Button>
      </>
    );
  }
  if (state === "stopped") {
    return (
      <>
        <Button size="lg" onClick={() => send({ type: "run" })}>
          Run
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => send({ type: "reset" })}
        >
          Reset
        </Button>
      </>
    );
  }
  state satisfies never;
  return null;
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default App;
