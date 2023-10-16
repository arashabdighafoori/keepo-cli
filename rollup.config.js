import { nodeResolve } from "@rollup/plugin-node-resolve";
import ts from "rollup-plugin-ts";

const production = !process.env.ROLLUP_WATCH;

const default_config = (input, output) => ({
  input: input,
  output: output,
  plugins: [
    nodeResolve(),
    ts({ tsconfig: production ? "tsconfig.json" : "tsconfig.json" }),
  ],
});

export default [
  default_config("src/index.ts", [
    {
      dir: "/",
      format: "cjs",
    },
  ])
];
