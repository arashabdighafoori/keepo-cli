import fs from "fs";
import process from "child_process";
import prompts from "prompts";
import color from "./color";
import constants from "./constants";

export class File {
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

  public open(opener: string, decrypter: (content: string) => Promise<string>) {
    return new Promise<string>((resolve, reject) => {
      (async () => {
        const copy_loc = await this.copy(constants.tmpdir, decrypter);
        process.exec(`${opener} ${copy_loc}`, (err) => {
          if (err) {
            reject(err);
          }
          resolve(copy_loc);
        });
      })();
    });
  }

  public save(
    copy_loc: string,
    encrypter: (content: string) => Promise<string>
  ) {
    encrypter(JSON.parse(fs.readFileSync(copy_loc, { encoding: "utf8" }))).then(
      (encrypted) => {
        this.write(encrypted);
        fs.unlinkSync(copy_loc);
      }
    );
  }

  public close(copy_loc: string) {
    fs.unlinkSync(copy_loc);
  }

  public copy(dir: string, decrypter: (content: string) => Promise<string>) {
    const path = `${dir}\\keep-temporary.json`;
    return new Promise<string>((resolve, reject) => {
      this.read().then((content) => {
        if (content === "{}") {
          fs.writeFile(path, content, (err) => {
            if (err) reject(err);
            else resolve(path);
          });
        } else {
          decrypter(content)
            .then((content) => JSON.stringify(JSON.parse(content), null, 2))
            .then((c) => {
              fs.writeFile(path, c, (err) => {
                if (err) reject(err);
                else resolve(path);
              });
            });
        }
      });
    });
  }
}
