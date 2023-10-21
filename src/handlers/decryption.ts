import mediator from "../mediator";

export interface DecryptionRequest {
  name: string;
  encrypted: string;
}

export function AddDecryption() {
  mediator.register_handler<DecryptionRequest, string>(
    "decrypt",
    ({ encrypted }) => {
      return encrypted;
    }
  );
}
