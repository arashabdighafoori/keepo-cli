import { Command } from "commander";
import color from "./color";
import Configuration from "./configuration";
import { File } from "./file";

export class Main {
  settings_text = `
${color.wrap(
  `It's also possible to change the settings from "%appdata%/.keep/config.json" in windows "/Users/user/Library/Preferences/.keep/config.json" in os x or "/home/user/.local/share/.keep/config.json" in linux.`,
  ["FgYellow"]
)}

The possible settings:
<opener> the command to open files, default: "code"
    `;

  // #region props

  argv: string[];
  global: File;
  cwd: File;

  private readonly data_folder =
    process.env.APPDATA ||
    (process.platform == "darwin"
      ? process.env.HOME + "/Library/Preferences"
      : process.env.HOME + "/.local/share");
  private readonly global_dir = this.data_folder + "/.keepo/";
  // #endregion

  constructor(private config: Configuration) {
    this.argv = process.argv.slice(1);
    this.global = new File(this.global_dir, ".keep");
    this.cwd = new File(process.cwd() + "/", ".keep");
  }

  public async run() {
    const program = new Command();

    program
      .name("keepo")
      .description(await this.config.get<string>("description"))
      .version(await this.config.get<string>("version"));

    this.add_get(program);
    this.add_set(program);
    this.add_require(program);
    this.add_open(program);
    this.add_init(program);
    this.add_key(program);
    this.add_global(program);
    this.add_settings(program);

    console.log("");
    program.parse();
    if (program.args.length === 0) program.help();
  }

  add_key(program: Command) {
    program
      .command("key")
      .description("the encryption key for the keep in the current directory.");
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
        let content: { [key: string]: unknown } = {};
        if (this.cwd.raw_exists()) content = JSON.parse(await this.cwd.read());
        else {
          color.warn("UPDATE", [
            {
              text: "create the .keep file.",
              colors: ["FgYellow"],
            },
          ]);
        }
        content[key] = value;
        this.cwd.write(this.secure(JSON.stringify(content), "LOCAL"));

        color.warn("UPDATE", [
          {
            text: `${key}:`,
            colors: [],
          },
          {
            text: value,
            colors: ["FgYellow"],
          },
        ]);
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
        if (!this.cwd.raw_exists()) {
          color.danger("NOT FOUND", [
            {
              text: `${key} was not found!`,
              colors: ["FgRed"],
            },
          ]);
        } else {
          const content = JSON.parse(await this.cwd.read());
          if (key in content) {
            color.info("DISPLAY", [
              {
                text: `${key}:`,
                colors: [],
              },
              {
                text: String(content[key]),
                colors: ["FgCyan"],
              },
            ]);
          } else {
            color.danger("NOT FOUND", [
              {
                text: `${key} was not found!`,
                colors: ["FgRed"],
              },
            ]);
          }
        }
      });
  }

  add_require(program: Command) {
    program
      .command("require")
      .description("add a key to requirements.")
      .argument("key", "the required key.")
      .action(async (key: string) => {
        const f = new File(process.cwd(), "\\.rkeep");
        const contents: { values: string[] } = { values: [] };
        if (f.raw_exists()) {
          const parsed = JSON.parse(await f.read());
          contents.values = parsed.values;
        } else {
          color.warn("UPDATE", [
            {
              text: "create the .rkeep file.",
              colors: ["FgYellow"],
            },
          ]);
        }
        if (!contents.values.includes(key)) {
          contents.values.push(key);
          await f.write(this.secure(JSON.stringify(contents), ""));
          color.warn("UPDATE", [
            {
              text: `${key} was added to requirements.`,
              colors: ["FgYellow"],
            },
          ]);
        } else {
          color.info("DISPLAY", [
            {
              text: `${key} is already required!`,
              colors: ["FgCyan"],
            },
          ]);
        }
      });
  }

  add_open(program: Command) {
    program
      .command("open")
      .description("open the keep in a temporary file.")
      .action(() => {
        if (!this.cwd.raw_exists()) {
          color.warn("UPDATE", [
            {
              text: "create the .keep file.",
              colors: ["FgYellow"],
            },
          ]);
          this.cwd.write("{}");
        }
        this.cwd.open(
          "code",
          (content) => {
            return this.decrypt(content, "LOCAL");
          },
          (content) => {
            return this.secure(content, "LOCAL");
          }
        );
      });
  }

  add_init(program: Command) {
    program
      .command("init")
      .description(
        "initialize the keep in the current directory with a specific encryption key, (or to add the encryption key for an existing .keep file)."
      );
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
        if (!this.global.raw_exists()) {
          color.danger("NOT FOUND", [
            {
              text: `${key} was not found!`,
              colors: ["FgRed"],
            },
          ]);
        } else {
          const content = JSON.parse(await this.global.read());
          if (key in content) {
            color.info("DISPLAY", [
              {
                text: `${key}:`,
                colors: [],
              },
              {
                text: String(content[key]),
                colors: ["FgCyan"],
              },
            ]);
          } else {
            color.danger("NOT FOUND", [
              {
                text: `${key} was not found!`,
                colors: ["FgRed"],
              },
            ]);
          }
        }
      });
  }

  add_global_set(global: Command) {
    global
      .command("set")
      .description("write or update a value to keep in the global keep.")
      .argument("key", "the key to keep the value.")
      .argument("value", "the value.")
      .action(async (key, value) => {
        let content: { [key: string]: unknown } = {};
        if (this.global.raw_exists())
          content = JSON.parse(await this.global.read());
        else {
          color.warn("UPDATE", [
            {
              text: "create the global .keep file.",
              colors: ["FgYellow"],
            },
          ]);
        }
        content[key] = value;
        this.global.write(this.secure(JSON.stringify(content), "GLOBAL"));

        color.warn("UPDATE", [
          {
            text: `${key}:`,
            colors: [],
          },
          {
            text: value,
            colors: ["FgYellow"],
          },
        ]);
      });
  }

  add_global_open(global: Command) {
    global
      .command("open")
      .description("open the global keep in a temporary file.")
      .action(() => {
        if (!this.global.raw_exists()) {
          color.warn("UPDATE", [
            {
              text: "create the global .keep file.",
              colors: ["FgYellow"],
            },
          ]);
          this.global.write("{}");
        }
        this.global.open(
          "code",
          (content) => {
            return this.decrypt(content, "LOCAL");
          },
          (content) => {
            return this.secure(content, "LOCAL");
          }
        );
      });
  }

  add_settings(program: Command) {
    const settings = program
      .command("settings")
      .description("the settings of keep.");
    this.add_settings_get(settings);
    this.add_settings_set(settings);
  }

  add_settings_get(settings: Command) {
    settings
      .command("get")
      .description("display a settings. use help for all the settings.")
      .addHelpText("after", this.settings_text)
      .argument("name", "the name of the setting.")
      .action((name) => {
        this.config.get(name).then((value) => {
          color.info("DISPLAY", [
            {
              text: `${name}:`,
              colors: [],
            },
            {
              text: String(value),
              colors: ["FgCyan"],
            },
          ]);
        });
      });
  }

  add_settings_set(settings: Command) {
    settings
      .command("set")
      .description(
        "change the default settings of the keep. use help for all the settings."
      )
      .addHelpText("after", this.settings_text)
      .argument("name", "the name of the setting.")
      .argument("value", "the value of the setting.")
      .action((name, value) => {
        this.config.set(name, value);
        color.warn("UPDATE", [
          {
            text: `${name}:`,
            colors: [],
          },
          {
            text: String(value),
            colors: ["FgYellow"],
          },
        ]);
      });
  }

  secure(content: string, encryption_name: string): string {
    return content;
  }
  decrypt(content: string, encryption_name: string): string {
    return content;
  }
}
