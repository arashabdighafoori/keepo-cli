import constants from "../constants";
import { File } from "../file";
import mediator from "../mediator";

interface AddKey {
  folder: string;
  key: Buffer;
}

export default function AddAddKey() {
  mediator.on("key:add", (data: AddKey) => {
    const { folder } = data;
    const key = data.key.toString();
    const file = new File(constants.globaldir, `keys.json`);

    let content: { [key: string]: unknown } = {};
    file
      .read()
      .then((data) => {
        content = JSON.parse(data);
      })
      .catch(() => {
        mediator.fire("log:update", `creating the keys.json file.`);
      })
      .finally(() => {
        content[folder] = key;
        file.write(JSON.stringify(content));
        if (folder !== constants.globaldir)
          mediator.fire("log:update", `the key for folder "${folder}": ${key}`);
      });
  });
}
