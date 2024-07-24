import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
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

const wireInput = (
    id: string,
    handler: (v) => void
): E.Either<string, HTMLInputElement> => {
    let e = pipe(
        id,
        getElement(isElt(HTMLInputElement), "Not input element"),
        E.map((input) => {
            input.onchange = () => {
                handler(input.value);
            };
            input.oninput = () => {
                handler(input.value);
            };
            input.onclick = () => {
                handler(input.value);
            };
            return input;
        })
    );
    console.log(`wireInput: ${id} ${JSON.stringify(e)}`);
    return e;
};

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
    input: input;
    ctx?: AudioContext;
    sources?: Array<sourceNode>;
}

const initialiseState = (s: state): state => {
    const audioCtx = new AudioContext();

    const freq = s.input.freq;
    const fifth = (freq / 2) * 3;
    const minor3 = (freq / 4) * 5;
    const major3 = (freq / 5) * 6;

    const s1 = new OscillatorNode(audioCtx);
    s1.frequency.value = freq;
    const s2 = new OscillatorNode(audioCtx);
    s2.frequency.value = minor3;
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

interface input {
    freq: number;
}

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
    // Should match HTML. How to sync?
    const defaultFreq = 440;
    let s: state = {
        count: 0,
        input: { freq: defaultFreq },
    };

    const inputs: Array<[string, (v: string) => void]> = [
        [
            "freq-input",
            (v: string) => {
                console.log(`input handler running: ${JSON.stringify(s)}`);
                s = { ...s, input: { ...s.input, freq: +v } };
                console.log(`input handler ret: ${JSON.stringify(s)}`);
            },
        ],
    ];
    const buttons: Array<[string, () => void]> = [
        [
            "play-button",
            () => {
                s = playClicked(s);
            },
        ],
        [
            "stop-button",
            () => {
                s = stopClicked(s);
            },
        ],
    ];
    return pipe(
        inputs,
        A.traverse(E.Applicative)(([id, handler]) => wireInput(id, handler)),
        E.flatMap((v) =>
            pipe(
                buttons,
                A.traverse(E.Applicative)(([id, handler]) =>
                    wireButton(id, handler)
                )
            )
        ),
        E.map((e) => "Init OK")
    );
    /*
    return pipe(
        inputs,
        A.traverse(E.Applicative)((e: HTMLElement) => `{e} initialised OK`),
    );
        getElement(isElt(HTMLInputElement), "Not an input element"),
        "input-freq",
        E.map((inputFreq) => {
            inputFreq.onload
            return { ...s, input: { ...s.input, freq: +inputFreq.value } };
        }),
        E.flatMap((s: state) =>
            pipe(
                wireButton("play-button", () => playClicked(s)),
                E.map(() => s)
            )
        ),
        E.flatMap((s: state) =>
            pipe(
                wireButton("stop-button", () => stopClicked(s)),
                E.map(() => s)
            )
        ),
        E.map(() => "Initialised")
        */
};

function main() {
    E.fold(
        (e) => console.error(`Initialise failed: ${e}`),
        (m) => console.log(`Initialised: ${m}`)
    )(initialise());
}

main();
