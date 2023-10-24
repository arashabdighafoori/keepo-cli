import Configuration from "../configuration";
import constants from "../constants";
import { File } from "../file";
import mediator from "../mediator";

interface Open {
  type: "LOCAL" | "GLOBAL";
}

export default function AddOpenOperations() {
  mediator.on("open", async (input: Open) => {
    const { type } = input;

    const path = type == "LOCAL" ? process.cwd() : constants.globaldir;
    const file = new File(path, "/.keep");

    if (!file.raw_exists()) {
      mediator.fire("log:update", `creating the .keep file.`);
      file.write("{}");
    }

    const configuration = mediator.service("configuration") as Configuration;
    const opener = await configuration.get<string>("opener");

    const copy_loc = await file.open(opener, (content) => {
      const p = mediator.handle({
        name: "decrypt",
        folder: path,
        encrypted: content,
      }) as Promise<string>;
      return p;
    });

    const prompt = mediator.handle({
      name: "prompt:open",
    }) as Promise<string>;

    prompt
      .then((value) => {
        if (value.toLowerCase() == "save") {
          file.save(copy_loc, async (content) => {
            return await (mediator.handle({
              name: "encrypt",
              folder: path,
              content: JSON.stringify(content),
            }) as Promise<string>);
          });
        } else {
          file.close(copy_loc);
        }
      })
      .finally(() => mediator.fire("log:", {}));
  });
}
