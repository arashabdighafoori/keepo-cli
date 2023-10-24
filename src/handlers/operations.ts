import AddRequireOperations from "./operation.require";
import AddSetOperation from "./operation.set";
import AddGetOperations from "./operation.get";
import AddOpenOperations from "./operation.open";
import AddInitOperations from "./operation.init";

export default function AddOperations() {
  AddSetOperation();
  AddGetOperations();
  AddOpenOperations();
  AddRequireOperations();
  AddInitOperations();
}
