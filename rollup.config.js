import { nodeResolve } from "@rollup/plugin-node-resolve";
import ts from "rollup-plugin-ts";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

const production = !process.env.ROLLUP_WATCH;

const default_config = (input, output, plugins) => ({
  input: input,
  output: output,
  plugins: [
    json(),
    nodeResolve({
      browser: false,
    }),
    commonjs(),
    ts({ tsconfig: production ? "tsconfig.json" : "tsconfig.json" }),
    ...plugins,
  ],
});

export default [
  default_config(
    "src/index.ts",
    [
      {
        dir: "./bin/lib/",
        format: "cjs",
      },
    ],
    []
  ),
];
