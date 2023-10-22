import { tmpdir } from "os";

export default class {
  public static tmpdir = (() => {
    return tmpdir();
  })();

  public static root =
    process.env.APPDATA ||
    (process.platform == "darwin"
      ? process.env.HOME + "/Library/Preferences"
      : process.env.HOME + "/.local/share");

  public static globaldir = this.root + "/.keepo/"

}
