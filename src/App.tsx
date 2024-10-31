import { useRef, useState } from "react";
import "./App.css";
import { CellularAutomaton } from "wasm-elementary-cellular-automaton";
import { Input } from "@/components/ui/input";
import { Button } from "./components/ui/button";
import { cn } from "./lib/utils";

const aliveInTheMiddle = new Uint8Array(128).fill(0);
aliveInTheMiddle[64] = 1;

function App() {
  const [vector, setVector] = useState<number[]>(new Array(128).fill(0));
  const [isRunning, setIsRunning] = useState(false);
  const automaton = useRef<CellularAutomaton>(
    CellularAutomaton.new(30, aliveInTheMiddle)
  );

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const start = () => {
    if (intervalRef.current) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      automaton.current.step();
      setVector(Array.from(automaton.current.get_state()));
    }, 100);
  };

  const reset = () => {
    stop();
    automaton.current.reset();
    setVector(Array.from(automaton.current.get_state()));
  };

  return (
    <>
      <Input
        type="number"
        min={0}
        max={255}
        onChange={(e) => {
          const rule = parseInt(e.target.value);
          automaton.current.set_rule(rule);
        }}
      />
      <div className="flex flex-row  justify-center">
        {vector.map((cell, index) => (
          <div
            key={index}
            className={cn("w-2 h-2", cell === 0 ? "bg-black" : "bg-white")}
          />
        ))}
      </div>

      <div className="flex gap-4 p-4 items-center justify-center">
        {isRunning ? (
          <Button onClick={stop}>Stop</Button>
        ) : (
          <Button onClick={start}>Start</Button>
        )}
        <Button onClick={reset}>Reset</Button>
      </div>
    </>
  );
}

export default App;
