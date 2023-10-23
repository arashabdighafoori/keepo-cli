import { mediator } from "@arashghafoori/mediator";
import Configuration from "../configuration";
import constants from "../constants";

export default async function AddConfiguration() {
  const configuration = new Configuration();
  await configuration.intialize(constants.default_configuration);
  mediator.register_service({
    name: "configuration",
    life: "Singleton",
    instance: configuration,
  });
}
