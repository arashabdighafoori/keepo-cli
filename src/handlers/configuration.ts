import { mediator } from "@arashghafoori/mediator";
import Configuration from "../configuration";

export default async function AddConfiguration() {
  const configuration = new Configuration({
    opener: "code",
  });
  await configuration.intialize();
  mediator.register_service({
    name: "configuration",
    life: "Singleton",
    instance: configuration,
  });
}
