import { Main } from "./command";
import Configuration from "./configuration";

export async function configure() {
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
