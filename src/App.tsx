import { useEffect, useRef, useState } from "react";
import "./App.css";
import { CellularAutomaton } from "wasm-elementary-cellular-automaton";


const aliveInTheMiddle = new Uint8Array(128).fill(0);
aliveInTheMiddle[64] = 1;

const initialAutomaton = CellularAutomaton.new(30, aliveInTheMiddle);

function App() {
  const [vector, setVector] = useState<number[]>(new Array(128).fill(0));
  const [automaton, setAutomaton] = useState<CellularAutomaton>(initialAutomaton);
  const [rule, setRule] = useState<number>(30);

  useEffect(() => {
    setAutomaton(CellularAutomaton.new(rule, aliveInTheMiddle));
  }, [rule]);

  const intervalRef = useRef<number | null>(null);

  return (
    <>
      <input type="number" value={rule} min={0} max={255} onChange={(e) => setRule(parseInt(e.target.value))} />
      <div className="automaton">
        {vector.map((cell, index) => {
          return (
            <div key={index} className={cell === 1 ? "alive" : "dead"}></div>
          );
        })}
      </div>

      <button
        onClick={() => {
          if (intervalRef.current) return;
          const interval = setInterval(() => {
            automaton.step();
            setVector(Array.from(automaton.get_state()));
          }, 100);
          intervalRef.current = interval;
        }}
      >
        Start
      </button>

      <button
        onClick={() => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }}
      >
        Stop
      </button>

      <button
        onClick={() => {
          setAutomaton(CellularAutomaton.new(rule, aliveInTheMiddle));
          setVector(new Array(128).fill(0));
        }}
      >
        Reset
      </button>
    </>
  );
}

export default App;
