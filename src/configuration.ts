import { mediator } from "@arashghafoori/mediator";
import fs from "fs";
import constants from "./constants";
import { File } from "./file";

export default class Configuration {
  private readonly filename = "config.json";

  private options: { [key: string]: unknown } = {};
  private package_json: { [key: string]: unknown } = {};
  private file: File;

  constructor(private force_remap = false) {
    this.file = new File(constants.globaldir, this.filename);
  }

  public async intialize(default_options: { [key: string]: unknown }) {
    await this.file.ensure();
    if (this.force_remap || !this.file.raw_exists()) {
      mediator.fire("log:update", "intializing the configuration.");
      this.file.write(JSON.stringify(default_options));
      this.options = default_options;
    } else {
      const reponse = await this.file.read();
      this.options = JSON.parse(reponse);
    }

    this.package_json = JSON.parse(
      fs.readFileSync(`${__dirname}/package.json`, "utf8")
    );
  }

  public get<T>(key: string) {
    return new Promise<T>((resolve) => {
      if (key in this.package_json) {
        resolve(this.package_json[key] as T);
      }
      if (key in this.options) {
        resolve(this.options[key] as T);
      }
    });
  }

  public set(name: string, value: string) {
    this.options[name] = value;
    this.file.write(JSON.stringify(this.options));
  }
}
