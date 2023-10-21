import color from "../color";
import mediator from "../mediator";

export default function AddLog() {
  mediator.on("log:update", (text: string) => {
    color.warn("UPDATE", [
      {
        text: text,
        colors: ["FgYellow"],
      },
    ]);
  });

  mediator.on("log:display", (text: string) => {
    color.info("DISPLAY", [
      {
        text: text,
        colors: [],
      },
    ]);
  });

  mediator.on("log:not found", (text: string) => {
    color.danger("NOT FOUND", [
      {
        text: `${text} was not found!`,
        colors: ["FgRed"],
      },
    ]);
  });

  mediator.on("log:", () => {
    console.log("");
  });
}
