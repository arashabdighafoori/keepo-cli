import fs from "fs";
import process from "child_process";

export class File {
  constructor(public dir: string, public file: string) {}

  public not_exists() {
    return new Promise<void>((resolve) => {
      if (!fs.existsSync(this.dir)) resolve();
    });
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

  public async open_in_vs() {
    process.exec(`code ${this.dir}${this.file}`, (err, stdout, stderr) => {
      console.log(err);
    });
  }
}
