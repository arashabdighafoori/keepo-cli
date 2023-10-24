import { File } from "../file";
import mediator from "../mediator";

interface Require {
  key: string;
}

export default function AddRequireOperations() {
  mediator.on("require", (input: Require) => {
    const { key } = input;

    const file = new File(process.cwd(), "/.rkeep");

    let content: string[] = [];
    file
      .read()
      .then((data) => {
        console.log(data);
        content = JSON.parse(data);
      })
      .catch(() => {
        mediator.fire("log:update", `creating the .rkeep file.`);
      })
      .finally(() => {
        console.log(content);
        if (!content.includes(key)) content.push(key);
        file.write(JSON.stringify(content, null, 2));

        mediator.fire("log:update", `${key} was added to requirements.`);
        mediator.fire("log:", {});
      });
  });
}
