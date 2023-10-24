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
    const path = type == "LOCAL" ? process.cwd() : constants.globaldir;
    const file = new File(path, "/.keep");

    let content: { [key: string]: unknown } = {};
    file
      .read()
      .then(async (data) => {
        return await (mediator.handle({
          name: "decrypt",
          folder: path,
          encrypted: data,
        }) as Promise<string>);
      })
      .then((data) => {
        content = JSON.parse(data);
      })
      .catch(() => {
        mediator.fire("log:update", `creating the .keep file.`);
      })
      .finally(async () => {
        content[key] = value;

        file.write(
          await (mediator.handle({
            name: "encrypt",
            folder: path,
            content: JSON.stringify(content),
          }) as Promise<string>)
        );

        mediator.fire("log:update", `${key}: ${value}`);
        mediator.fire("log:", {});
      });
  });
}
