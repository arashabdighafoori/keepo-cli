import prompts from "prompts";
import color from "../color";
import mediator from "../mediator";

export default function AddPrompts() {
  mediator.register_handler("prompt:open", () => {
    return new Promise<string>((resolve) => {
      prompts({
        type: "select",
        name: "value",
        message: color.wrap_all([
          ...color.pre_defined.Info(`INPUT`),
          { text: `Save or discard the opened file:`, colors: [`FgCyan`] },
        ]),
        choices: [
          { title: "Discard", value: "discard" },
          { title: "Save", value: "save" },
        ],
      }).then((response) => {
        resolve(response.value);
      });
    });
  });

  mediator.register_handler("prompt:initialize", () => {
    return new Promise<void>((resolve) => {
      prompts({
        type: "confirm",
        name: "confirm",
        message: color.wrap_all([
          ...color.pre_defined.Info(`INPUT`),
          {
            text: `A key already exists for this folder, confirm to reinitialize and encrypt everything again`,
            colors: [`FgCyan`],
          },
        ]),
      }).then(() => {
        resolve();
      });
    });
  });
}
