import { Command } from "commander";
import mediator from "./mediator";

export default class AppCommand {
  constructor(public program: Command) {
    this.add_get(program);
    this.add_set(program);
    this.add_require(program);
    this.add_open(program);
    this.add_init(program);
    this.add_key(program);
  }

  add_key(program: Command) {
    program
      .command("key")
      .description("the encryption key of the keep in the current directory.");
  }

  add_set(program: Command) {
    program
      .command("set")
      .description(
        "write or update a value to keep in the current working directory."
      )
      .argument("key", "the key to keep the value.")
      .argument("value", "the value.")
      .action(async (key: string, value: string) => {
        mediator.fire("set", {
          type: "LOCAL",
          key,
          value,
        });
      });
  }

  add_get(program: Command) {
    program
      .command("get")
      .description(
        "display the value of a key in current directory or global keep."
      )
      .argument("key", "the key to search for.")
      .action(async (key: string) => {
        mediator.fire("get", { type: "LOCAL", key });
      });
  }

  add_require(program: Command) {
    program
      .command("require")
      .description("add a key to requirements.")
      .argument("key", "the required key.")
      .action((key: string) => {
        mediator.fire("require", { key });
      });
  }

  add_open(program: Command) {
    program
      .command("open")
      .description("open the keep in a temporary file.")
      .action(() => {
        mediator.fire("open", { type: "LOCAL" });
      });
  }

  add_init(program: Command) {
    program
      .command("init")
      .description(
        "initialize the keep in the current directory with a specific encryption key, (or to add the encryption key for an existing .keep file)."
      )
      .argument("key", "the key to use to initialize the folder.")
      .action((key: string) => {
        mediator.fire("init", { key });
      });
  }
}
