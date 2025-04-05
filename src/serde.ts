import { createBinarySerializer } from "@rbxts/flamework-binary-serializer";

import type { InputData } from "./structs";

const serializer = createBinarySerializer<InputData>();

export function serialize(inputData: InputData): buffer {
  return serializer.serialize(inputData).buffer;
}

export function deserialize(inputBuffer: buffer): InputData {
  return serializer.deserialize(inputBuffer);
}