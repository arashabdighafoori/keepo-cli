import { Command } from "commander";
import color from "./color";
import constants from "./constants";
import { File } from "./file";
import mediator from "./mediator";

export default class GlobalCommand {
  global: File;
  constructor(public program: Command) {
    this.global = new File(constants.globaldir, ".keep");
    this.add_global(program);
  }

  add_global(program: Command) {
    const global = program
      .command("global")
      .description("the keep Shared between all of the directories.");
    this.add_global_set(global);
    this.add_global_get(global);
    this.add_global_open(global);
  }

  add_global_get(global: Command) {
    global
      .command("get")
      .description("display the value of a key in global keep.")
      .argument("key", "the key to search for.")
      .action(async (key: string) => {
        mediator.fire("get", { type: "GLOBAL", key });
      });
  }

  add_global_set(global: Command) {
    global
      .command("set")
      .description("write or update a value to keep in the global keep.")
      .argument("key", "the key to keep the value.")
      .argument("value", "the value.")
      .action(async (key, value) => {
        mediator.fire("set", {
          type: "GLOBAL",
          key,
          value,
        });
      });
  }

  add_global_open(global: Command) {
    global
      .command("open")
      .description("open the global keep in a temporary file.")
      .action(() => {
        mediator.fire("open", { type: "GLOBAL" });
      });
  }
}
