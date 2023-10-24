import { Encryption } from "../encryption";
import mediator from "../mediator";
import crypto from "crypto";

export interface EncryptionRequest {
  name: string;
  content: string;
  folder: string;
}

export function AddEncryption() {
  mediator.register_handler<EncryptionRequest, Promise<string>>(
    "encrypt",
    ({ content, folder }) => {
      return new Promise<string>((resolve, reject) => {
        // check for key or generate it
        let key = "";
        (
          mediator.handle<any, Promise<string>>({
            name: "key:get",
            folder,
          }) as Promise<string>
        )
          .then((k) => {
            key = k;
          })
          .catch(() => {
            key = returnHash();
            mediator.fire("key:add", {
              folder,
              key: Buffer.from(key),
            });
          })
          .finally(() => {
            // encrypt content
            const out = cntnue(content, key);
            resolve(`${out.iv}.${out.encryptedData}`);
          });
      });
    }
  );
}

function returnHash() {
  const abc = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += abc[Math.floor(Math.random() * abc.length)];
  }
  return token;
}

function cntnue(content: string, key: string) {
  if (key === "") return { iv: "none", encryptedData: content };
  const enc = new Encryption(Buffer.from(key));
  const out = enc.encrypt(content);
  return out;
}
