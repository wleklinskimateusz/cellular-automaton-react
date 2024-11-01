import { CellularAutomaton } from "wasm-elementary-cellular-automaton";
import { Actor, assign, setup, StateFrom } from "xstate";

type AutomatonContext = {
    rule: number;
    vector: Uint8Array;
    automaton: CellularAutomaton;
    interval: NodeJS.Timeout | null;
    resetCounter: number;
};

const initialVector = new Uint8Array(128).fill(0);

export const automatonMachineDefinition = setup({
    types: {
        events: {} as
            | { type: "toggle.cell"; index: number }
            | { type: "set.vector"; vector: Uint8Array }
            | { type: "rule.set"; rule: number }
            | { type: "run" }
            | { type: "step" }
            | { type: "stop" }
            | { type: "reset" }
            | { type: "save" }
            | { type: "edit" },
        context: {} as AutomatonContext,
    },
}).createMachine({
    context: {
        rule: 30,
        vector: initialVector,
        automaton: CellularAutomaton.new(30, initialVector),
        interval: null,
        resetCounter: 0,
    },
    id: "automaton",
    initial: "editing",
    exit: [
        ({ context }) => {
            if (context.interval) {
                clearInterval(context.interval);
                context.interval = null;
            }
            context.automaton.free();
        },
    ],
    states: {
        editing: {
            exit: [
                ({ context }) => {
                    context.automaton.set_initial_state(context.vector);
                    context.automaton.set_rule(context.rule);
                },
            ],
            on: {
                save: { target: "idle" },
                "rule.set": {
                    actions: assign({ rule: ({ event }) => event.rule }),
                },
                "toggle.cell": {
                    actions: assign({
                        vector: ({ event, context }) => {
                            const index = event.index;
                            if (index < 0 || index >= 128) {
                                throw new Error("Index out of bounds");
                            }
                            const vector = context.vector;
                            vector[index] = vector[index] === 0 ? 1 : 0;
                            return vector;
                        },
                    }),
                },
                "set.vector": {
                    actions: assign({
                        vector: ({ event }) => event.vector,
                    }),
                },
            },
        },
        idle: {
            entry: [
                ({ context }) => {
                    context.automaton.reset();
                    context.vector = context.automaton.get_state();
                    context.resetCounter += 1;
                },
            ],
            on: {
                run: { target: "running" },
                edit: { target: "editing" },
            },
        },
        running: {
            entry: [
                ({ context, self }) => {
                    context.interval = setInterval(() => {
                        self.send({ type: "step" });
                    }, 100);
                },
            ],
            on: {
                stop: { target: "stopped" },
                reset: { target: "idle" },
                step: {
                    actions: assign({
                        vector: ({ context }) => {
                            context.automaton.step();
                            return context.automaton.get_state();
                        },
                    }),
                },
            },
            exit: [
                ({ context }) => {
                    if (context.interval) {
                        clearInterval(context.interval);
                        context.interval = null;
                    }
                },
            ],
        },
        stopped: {
            on: {
                run: { target: "running" },
                reset: { target: "idle" },
            },
        },
    },
});

export type State = StateFrom<typeof automatonMachineDefinition>["value"];
export type Send = Actor<typeof automatonMachineDefinition>["send"];
