import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

const x = pipe(E.right("hi"), E.bindTo("foo"));

console.log(x);
