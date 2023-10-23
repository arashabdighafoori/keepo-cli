import { mediator } from "@arashghafoori/mediator";
import { Command } from "commander";
import color from "./color";
import Configuration from "./configuration";

export default class SettingsCommand {
  settings_text = `
    ${color.wrap(
      `It's also possible to change the settings from "%appdata%/.keep/config.json" in windows "/Users/user/Library/Preferences/.keep/config.json" in os x or "/home/user/.local/share/.keep/config.json" in linux.`,
      ["FgYellow"]
    )}
    
    The possible settings:
    <opener> the command to open files, default: "code"
        `;

  constructor(public program: Command) {
    this.add_settings(program);
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
        mediator.fire("settings:get", { key: name });
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
        mediator.fire("settings:set", { key: name, value });
      });
  }
}
