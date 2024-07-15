import * as E from "fp-ts/Either";
//import { pipe } from "fp-ts/function";

/*
const isButton = (elt: HTMLElement): elt is HTMLButtonElement => {
    return elt instanceof HTMLButtonElement;
};

const getElement = (id: string): E.Either<string, HTMLElement> =>
    pipe(
        document.getElementById(id),
        E.fromNullable(`No element with id ${id}`)
    );

const playClicked = () => console.log("play clicked");
*/

const initialise = (): E.Either<string, string> => {
    return E.right("all good");
    //    const playButton = pipe("play-button", getElement, E.filterOrElse(isButton, () => "Not a button"), E.fold((e) => console.log("Can't get play button"), (b) => b.onclick=playClicked);
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
