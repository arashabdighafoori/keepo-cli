import { Main } from "./command";
import Configuration from "./configuration";
import AddConfiguration from "./handlers/configuration";
import { AddDecryption } from "./handlers/decryption";
import { AddEncryption } from "./handlers/encryption";
import AddLog from "./handlers/log";
import AddOperations from "./handlers/operations";
import AddPrompts from "./handlers/prompt";

export async function configure() {
  AddLog();
  AddOperations();
  AddEncryption();
  AddDecryption();
  AddPrompts();
  await AddConfiguration();

  const configuration = new Configuration(
    {
      opener: "code",
    },
    true
  );
  await configuration.intialize();
  return configuration;
}

export async function startup(configuration: Configuration) {
  const command = new Main(configuration);
  await command.run();
}
