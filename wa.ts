import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

type Ctor<T> = new (...args: any[]) => T;

const isElt = <T extends HTMLElement>(
    filterType: Ctor<T>
): ((elt: HTMLElement) => elt is T) => {
    return (elt): elt is T => elt instanceof filterType;
};

const isButton = isElt(HTMLButtonElement);
const isAudio = isElt(HTMLAudioElement);

const getElement = (id: string): E.Either<string, HTMLElement> =>
    pipe(
        document.getElementById(id),
        E.fromNullable(`No element with id ${id}`)
    );

const playClicked = () => console.log("play clicked");

const initialise = (): E.Either<string, any> => {
    const pb = pipe(
        "play-button",
        getElement,
        E.filterOrElse(isButton, () => "Not a button"),
        E.map((b) => (b.onclick = playClicked))
    );

    const ae = pipe(
        "the-audio",
        getElement,
        E.filterOrElse(isAudio, () => "Not audio element")
    );

    return E.right("Got button and audio");
    //    const audio = pipe("the-audio", getElement, E.map(isAudio));

    //    const audioCtx = new AudioContext();

    //    const oscillator = new OscillatorNode(audioCtx);
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
