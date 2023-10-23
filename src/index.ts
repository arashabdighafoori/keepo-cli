import Configuration from "./configuration";
import { File } from "./file";
import { configure, startup } from "./startup";

configure().then(async (configuration: Configuration) => {
  await startup(configuration);
});
