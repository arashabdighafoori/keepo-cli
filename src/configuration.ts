import fs from "fs";
import { File } from "./file";

interface ConfigurationOptions {
  opener?: string;
}

export default class Configuration {
  private readonly data_folder = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
  private readonly dir = this.data_folder + "/.keepo/";
  private readonly filename = "config.json";
  
  private options: ConfigurationOptions = {};
  private package_json: { [key: string]: unknown } = {};
  private file: File;

  constructor(
    private default_options: ConfigurationOptions,
    private force_remap = false
  ) {
    this.file = new File(this.dir, this.filename);
  }

  public async intialize() {
    await this.file.ensure();
    if (this.force_remap) {
      this.file.write(JSON.stringify(this.default_options));
      this.options = this.default_options;
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
        resolve(this.package_json[key] as T);
      }
    });
  }
}
