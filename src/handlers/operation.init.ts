import constants from "../constants";
import { File } from "../file";
import mediator from "../mediator";

interface Get {
  key: string;
}

export default function AddInitOperations() {
  mediator.on("init", (input: Get) => {
    const { key } = input;
    const folder = process.cwd();

    // is there a key
    const get_key_promise = mediator.handle({
      name: "key:get",
      folder: folder,
    }) as Promise<string>;
    get_key_promise
      .then(() => {
        // a key already exists
        const prompt = mediator.handle({
          name: "prompt:initialize",
        }) as Promise<void>;

        prompt.then(() => {
          // they have confirmed to reinitialize
          reinitialize(key, folder);
        });
      })
      .catch(() => {
        // there are no key for the folder, initialize
        initialize(key, folder);
      });
  });

  function reinitialize(key: string, folder: string) {
    mediator.fire("key:move", { folder, key });
  }

  function initialize(key: string, folder: string) {
    mediator.fire("key:add", { folder, key });
  }
}
