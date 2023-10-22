import { File } from "../file";
import mediator from "../mediator";

interface Require {
  key: string;
}

export default function AddRequireOperations() {
  mediator.on("require", async (input: Require) => {
    const { key } = input;

    const file = new File(process.cwd(), "/.rkeep");

    let content: string[] = [];
    file
      .read()
      .then((data) => {
        content = JSON.parse(data);
      })
      .catch(() => {
        mediator.fire("log:update", `create the .rkeep file.`);
      })
      .finally(() => {
        if (!content.includes(key)) content.push(key);
        file.write(
          mediator.handle({
            name: "encrypt",
            content: JSON.stringify(content),
          }) as string
        );

        mediator.fire("log:update", `${key} was added to requirements.`);
        mediator.fire("log:", {});
      });
  });
}
