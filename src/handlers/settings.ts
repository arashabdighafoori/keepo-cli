import Configuration from "../configuration";
import constants from "../constants";
import { File } from "../file";
import mediator from "../mediator";

interface GetSettings {
  key: string;
}

interface SetSettings {
  key: string;
  value: string;
}

export default function AddSettingsOperations() {
  mediator.on("settings:set", async ({ key, value }: SetSettings) => {
    const config = new Configuration();
    await config.intialize(constants.default_configuration);
    config.set(key, value);
    mediator.fire("log:update", `the setting ${key}: ${value}`);
    mediator.fire("log:", {});
  });

  mediator.on("settings:get", async ({ key }: GetSettings) => {
    const config = new Configuration();
    await config.intialize(constants.default_configuration);
    const value = await config.get(key);
    mediator.fire("log:display", `setting ${key}: ${value}`);
    mediator.fire("log:", {});
  });
}
