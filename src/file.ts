import fs from "fs";
import process from "child_process";
import { tmpdir } from "os";
import prompts from "prompts";
import color from "./color";

export class File {
  public copy_folder = tmpdir();
  constructor(public dir: string, public file: string) {}

  public not_exists() {
    return new Promise<void>((resolve) => {
      if (!fs.existsSync(this.dir)) resolve();
    });
  }

  public raw_exists() {
    return fs.existsSync(this.dir + this.file);
  }

  public ensure() {
    return new Promise<void>((resolve) => {
      if (!fs.existsSync(this.dir)) fs.mkdirSync(this.dir);
      resolve();
    });
  }

  public write(content: string) {
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(`${this.dir}${this.file}`, content, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  public read() {
    return new Promise<string>((resolve, reject) => {
      fs.readFile(
        `${this.dir}${this.file}`,
        { encoding: "utf8" },
        (err, buf) => {
          if (!err) {
            resolve(buf.toString());
          } else {
            reject(err);
          }
        }
      );
    });
  }

  public async open(
    opener: string,
    decrypter: (content: string) => string,
    encrypter: (content: string) => string
  ) {
    const copy_loc = await this.copy(tmpdir(), decrypter);
    process.exec(`${opener} ${copy_loc}`, (err) => {
      if (err) {
        color.danger("ERROR", [
          {
            text: `There was some issue running: ${opener} ${copy_loc}`,
            colors: ["FgRed"],
          },
        ]);
        color.danger("ERROR", [
          {
            text: `${err.code} ${err.message}`,
            colors: ["FgRed"],
          },
        ]);
      }
      this.save_or_discard().then((response) => {
        if (response == "save") {
          this.write(
            encrypter(fs.readFileSync(copy_loc, { encoding: "utf8" }))
          );
        } else {
          color.info("DISPLAY", [
            {
              text: `Ignoring the changes.`,
              colors: ["FgCyan"],
            },
          ]);
        }
        fs.unlinkSync(copy_loc);
      });
    });
  }

  public copy(dir: string, decrypter: (content: string) => string) {
    const stamp = Date.now().toString();
    return new Promise<string>((resolve, reject) => {
      this.read().then((content) => {
        fs.writeFile(
          `${dir}\\keep-${stamp}.temp`,
          decrypter(content),
          (err) => {
            if (err) reject(err);
            else resolve(`${dir}\\keep-${stamp}.temp`);
          }
        );
      });
    });
  }

  public save_or_discard() {
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
  }
}
