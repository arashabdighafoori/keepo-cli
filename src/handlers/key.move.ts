import { File } from "../file";
import mediator from "../mediator";

interface MoveKey {
  folder: string;
  key: Buffer;
}

export default function AddMoveKey() {
  mediator.on("key:move", async (input: MoveKey) => {
    const { folder, key } = input;
    // translate files to new encryption
    const file = new File(folder, "/.keep");

    let content: { [key: string]: unknown } = {};
    file
      .read()
      .then(async (data) => {
        return (await mediator.handle({
          name: "decrypt",
          encrypted: data,
        })) as string;
      })
      .then((data) => {
        content = JSON.parse(data);
      })
      .catch(() => {
        mediator.fire("log:update", `creating the .keep file.`);
      })
      .finally(async () => {
        mediator.fire("key:add", { folder, key: key });

        file.write(
          await (mediator.handle({
            name: "encrypt",
            folder,
            content: JSON.stringify(content),
          }) as Promise<string>)
        );

        mediator.fire("log:", {});
      });
    // replace the existing key
  });
}
