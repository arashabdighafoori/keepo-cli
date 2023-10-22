import constants from "../constants";
import { File } from "../file";
import mediator from "../mediator";

interface Set {
  type: "LOCAL" | "GLOBAL";
  key: string;
  value: string;
}

export default function AddSetOperation() {
  mediator.on("set", (input: Set) => {
    const { key, value, type } = input;

    const file = new File(
      type == "LOCAL" ? process.cwd() : constants.globaldir,
      "/.keep"
    );

    let content: { [key: string]: unknown } = {};
    file
      .read()
      .then((data) => {
        content = JSON.parse(data);
      })
      .catch(() => {
        mediator.fire("log:update", `create the .keep file.`);
      })
      .finally(() => {
        content[key] = value;
        file.write(
          mediator.handle({
            name: "encrypt",
            content: JSON.stringify(content),
          }) as string
        );

        mediator.fire("log:update", `${key}: ${value}`);
        mediator.fire("log:", {});
      });
  });
}
