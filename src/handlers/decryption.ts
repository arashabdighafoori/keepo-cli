import color from "../color";
import constants from "../constants";
import { Encryption } from "../encryption";
import mediator from "../mediator";

export interface DecryptionRequest {
  name: string;
  encrypted: string;
  folder: string;
}

export function AddDecryption() {
  mediator.register_handler<DecryptionRequest, Promise<string>>(
    "decrypt",
    ({ encrypted, folder }) => {
      return new Promise<string>((resolve, reject) => {
        const iv = encrypted.split(".")[0];
        encrypted = encrypted.split(".")[1];
        if (iv === "none") return encrypted;
        (
          mediator.handle<any, Promise<string>>({
            name: "key:get",
            folder,
          }) as Promise<string>
        )
          .then((key) => {
            // encrypt content
            if (key === "") resolve(encrypted);
            const enc = new Encryption(Buffer.from(key));
            const decrypted = enc.decrypt({ iv, encryptedData: encrypted });
            resolve(decrypted);
          })
          .catch((r) => {
            mediator.fire(
              "log:not found",
              folder === constants.globaldir
                ? "encryption for global keep"
                : "encryption for local keep"
            );
            color.info("INFO", [
              {
                text: "You can use ` keepo init <key> ` to initialize a local directory with a given encryption key.",
                colors: [],
              },
            ]);
            mediator.fire("log:", {})
          });
      });
    }
  );
}
