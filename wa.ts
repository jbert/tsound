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

interface sourceNode extends AudioNode {
    start(): void;
    stop(): void;
}

interface state {
    count: number;
    ctx?: AudioContext;
    sources?: Array<sourceNode>;
}

const initialiseState = (s: state): state => {
    const audioCtx = new AudioContext();

    const freq = 440;
    const fifth = (freq / 2) * 3;
    const minor3 = (freq / 4) * 5;
    const major3 = (freq / 5) * 6;

    const s1 = new OscillatorNode(audioCtx);
    s1.frequency.value = freq;
    const s2 = new OscillatorNode(audioCtx);
    s2.frequency.value = major3;
    const s3 = new OscillatorNode(audioCtx);
    s3.frequency.value = fifth;

    const sources: Array<sourceNode> = [s1, s2, s3];

    const mixer = new GainNode(audioCtx);
    mixer.gain.value = 1 / sources.length;

    sources.map((s) => {
        s.connect(mixer);
        s.start();
    });
    mixer.connect(audioCtx.destination);

    return { ...s, ctx: audioCtx, sources: sources };
};

const stateInitialised = (s: state): boolean => {
    return s.ctx !== undefined;
};

const playClicked = (s: state): state => {
    console.log(`play clicked: ${JSON.stringify(s)}`);
    console.log("running");
    if (!stateInitialised(s)) {
        console.log("initialising");
        s = initialiseState(s);
    }

    return { ...s, count: s.count + 1 };
};

const stopClicked = (s: state): state => {
    console.log(`stop clicked: ${JSON.stringify(s)}`);
    s.sources?.map((s) => s.stop());
    s.ctx?.close();
    s.ctx = undefined;
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
