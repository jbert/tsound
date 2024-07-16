import * as RE from "fp-ts/Record";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

type Ctor<T> = new (...args: any[]) => T;

const isElt =
    <T extends HTMLElement>(
        filterType: Ctor<T>
    ): ((elt: HTMLElement) => elt is T) =>
    (elt): elt is T =>
        elt instanceof filterType;

const getElement =
    <T extends HTMLElement>(
        filter: (e: HTMLElement) => e is T,
        wrongTypeErr: string
    ): ((id: string) => E.Either<string, T>) =>
    (id) =>
        pipe(
            document.getElementById(id),
            E.fromNullable(`No element with id ${id}`),
            E.filterOrElse(filter, () => `${wrongTypeErr}: ${id}`)
        );

const wireButton = (
    id: string,
    handler: () => void
): E.Either<string, HTMLButtonElement> =>
    pipe(
        id,
        getElement(isElt(HTMLButtonElement), "Not button element"),
        E.map((button) => {
            button.onclick = handler;
            return button;
        })
    );

interface state {
    count: number;
}

const stopClicked = (s: state): state => {
    console.log(`stop clicked: ${JSON.stringify(s)}`);
    return { ...s, count: s.count + 1 };
};

const playClicked = (s: state): state => {
    console.log(`play clicked: ${JSON.stringify(s)}`);
    return { ...s, count: s.count + 1 };
};

const initialise = (): E.Either<string, string> => {
    let s: state = { count: 0 };
    const buttons = pipe(
        {
            play: wireButton("play-button", () => (s = playClicked(s))),
            stop: wireButton("stop-button", () => (s = stopClicked(s))),
        },
        RE.sequence(E.Applicative)
    );

    console.log(`Buttons: ${JSON.stringify(buttons)}`);

    // const audioCtx = new AudioContext();
    //    const source = new OscillatorNode(audioCtx);
    //    source.connect(audioCtx.destination);

    //    source.start();

    return E.right("Got button and audio");

    //    const gainNode = new GainNode(audioCtx);

    //    oscillator.connect(gainNode).connect(audioCtx.destination);

    /*
    oscillator.context;
    oscillator.numberOfInputs;
    oscillator.numberOfOutputs;
    oscillator.channelCount;
    */
};

function main() {
    E.fold(
        (e) => console.error(`Initialise failed: ${e}`),
        (m) => console.log(`Initialised: ${m}`)
    )(initialise());
}

main();
