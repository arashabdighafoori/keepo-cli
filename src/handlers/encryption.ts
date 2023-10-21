import mediator from "../mediator";

export interface EncryptionRequest {
  name: string;
  content: string;
}

export function AddEncryption() {
  mediator.register_handler<EncryptionRequest, string>(
    "encrypt",
    ({ content }) => {
      return content;
    }
  );
}
