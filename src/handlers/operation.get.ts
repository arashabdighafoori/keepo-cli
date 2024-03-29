import constants from "../constants";
import { File } from "../file";
import mediator from "../mediator";

interface Get {
  type: "LOCAL" | "GLOBAL";
  key: string;
}

export default function AddGetOperations() {
  mediator.on("get", (input: Get) => {
    const { key, type } = input;

    const path = type == "LOCAL" ? process.cwd() : constants.globaldir;
    const file = new File(
      path,
      "/.keep"
    );

    if (!file.raw_exists()) {
      mediator.fire("log:not found", key);
    }
    file
      .read()
      .then((data) => {
        return mediator.handle({ name: "decrypt", encrypted: data, folder: path }) as string;
      })
      .then((data: string) => {
        const content = JSON.parse(data);
        mediator.fire("log:display", `${key}: ${content[key]}`);
      })
      .catch(() => mediator.fire("log:not found", key))
      .finally(() => mediator.fire("log:", {}));
  });
}
