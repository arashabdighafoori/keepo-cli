import { Command } from "commander";
import AppCommand from "./command.app";
import GlobalCommand from "./command.global";
import SettingsCommand from "./command.settings";
import Configuration from "./configuration";

export class Main {
  constructor(private config: Configuration) {}

  public async run() {
    const program = new Command();

    program
      .name("keepo")
      .description(await this.config.get<string>("description"))
      .version(await this.config.get<string>("version"))
      .hook("preAction", () => {
        console.log("");
      })

    new AppCommand(program);
    new SettingsCommand(this.config, program);
    new GlobalCommand(program);

    program.parse();
    if (program.args.length === 0) program.help();
  }
}
