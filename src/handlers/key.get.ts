import constants from "../constants";
import { File } from "../file";
import mediator from "../mediator";

interface GetKey {
  name: string;
  folder: string;
}

export default function AddGetKey() {
  mediator.register_handler("key:get", (inp: GetKey) => {
    const { folder } = inp;
    return new Promise<string>((resolve, reject) => {
      const file = new File(constants.globaldir, `keys.json`);
      file
        .read()
        .then(JSON.parse)
        .then((data) => {
          if (folder in data) resolve(data[folder]);
          else {
            reject("not found");
          }
        })
        .catch(reject);
    });
  });
}
