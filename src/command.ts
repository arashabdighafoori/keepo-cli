import { Command } from "commander";
import color from "./color";
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

    const settings_text = `
${color.wrap(
  `It's also possible to change the settings from "%appdata%/.keep/config.json" in windows "/Users/user/Library/Preferences/.keep/config.json" in os x or "/home/user/.local/share/.keep/config.json" in linux.`,
  ["FgYellow"]
)}

The possible settings:
<opener> the command to open files, default: "code"
    `;

    program
      .command("set")
      .description(
        "Write or update a value to keep in the current working directory."
      )
      .argument("key", "The key to keep the value.")
      .argument("value", "The value.");

    program
      .command("require")
      .description("Add a key to requirements.")
      .argument("key", "The required key.");

    program
      .command("get")
      .description(
        "Display the value of a key in current directory or global keep."
      )
      .argument("key", "The key to search for.");

    program.command("open").description("Open the keep in a temporary file.");

    program
      .command("key")
      .description("The encryption key for the keep in the current directory.");

    program
      .command("init")
      .description(
        "Initialize the keep in teh current directory with a specific encryption key, (or to add the encryption key for an existing .keep file)."
      );

    const global = program
      .command("global")
      .description("The keep Shared between all of the directories.");

    global
      .command("set")
      .description("Write or update a value to keep in the global keep.")
      .argument("key", "The key to keep the value.")
      .argument("value", "The value.");

    global
      .command("get")
      .description("Display the value of a key in global keep.")
      .argument("key", "The key to search for.");

    global
      .command("open")
      .description("Open the global keep in a temporary file.");

    program
      .command("settings")
      .description(
        "Change the default settings of the keep. use help for all the settings."
      )
      .addHelpText("after", settings_text)
      .argument("name", "The name of the setting.")
      .argument("value", "The value of the setting.");

    program.parse();
    if (program.args.length === 0) program.help();
  }
}
