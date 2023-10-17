import { Command } from "commander";
import Configuration from "./configuration";

export class Main {
  argv: string[];

  constructor(private config: Configuration) {
    this.argv = process.argv.slice(1);
  }

  public async run() {
    const program = new Command();

    program
      .name("keepo")
      .description(await this.config.get<string>("description"))
      .version(await this.config.get<string>("version"));

    program.parse();
  }
}
