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

    const file = new File(
      type == "LOCAL" ? process.cwd() : constants.globaldir,
      "/.keep"
    );

    if (!file.raw_exists()) {
      mediator.fire("log:update", `create the .keep file.`);
      file.write("{}");
    }

    const configuration = mediator.service("configuration") as Configuration;
    const opener = await configuration.get<string>("opener");

    const copy_loc = await file.open(opener, (content) => {
      return mediator.handle({
        name: "decrypt",
        encrypted: content,
      }) as string;
    });

    const prompt = mediator.handle({
      name: "prompt:open",
    }) as Promise<string>;

    prompt
      .then((value) => {
        if (value.toLowerCase() == "save") {
          file.save(copy_loc, (content) => {
            return mediator.handle({
              name: "encrypt",
              content: JSON.stringify(content),
            }) as string;
          });
        } else {
          file.close(copy_loc);
        }
      })
      .finally(() => mediator.fire("log:", {}));
  });
}
