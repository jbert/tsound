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

const stopClicked = () => {
    console.log("stop clicked");
};

const playClicked = () => {
    console.log("play clicked");
};

const initialise = (): E.Either<string, string> => {
    const buttons = pipe(
        "play-button",
        getElement(isElt(HTMLButtonElement), "Not button element"),
        E.map((playButton) => {
            playButton.onclick = playClicked;
            return { playButton };
        }),
        E.map((x) => {
            return {
                ...x,
                stopButton: pipe(
                    "stop-button",
                    getElement(isElt(HTMLButtonElement), "Not button element"),
                    E.map((stopButton) => {
                        stopButton.onclick = stopClicked;
                        return { stopButton };
                    })
                ),
            };
        })
    );

    console.log(`${buttons}`);

    const audioCtx = new AudioContext();
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
