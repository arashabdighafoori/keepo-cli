import { mediator } from "@arashghafoori/mediator";
import { Main } from "./command";
import Configuration from "./configuration";
import constants from "./constants";
import AddConfiguration from "./handlers/configuration";
import { AddDecryption } from "./handlers/decryption";
import { AddEncryption } from "./handlers/encryption";
import AddKeyOperations from "./handlers/keys";
import AddLog from "./handlers/log";
import AddOperations from "./handlers/operations";
import AddPrompts from "./handlers/prompt";
import AddSettingsOperations from "./handlers/settings";

export async function configure() {
  AddLog();
  AddOperations();
  AddEncryption();
  AddDecryption();
  AddPrompts();
  AddKeyOperations();
  AddSettingsOperations();
  await AddConfiguration();

  const configuration = new Configuration();
  await configuration.intialize(constants.default_configuration);
  return configuration;
}

export async function startup(configuration: Configuration) {
  mediator.fire("log:", {});
  const command = new Main(configuration);
  await command.run();
}
