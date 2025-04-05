import type { DataType } from "@rbxts/flamework-binary-serializer";

export interface InputEntry {
  readonly type: DataType.u8;
  readonly state: DataType.u8;
  readonly key?: DataType.u16;
  readonly gameProcessedEvent: boolean;
  readonly time: DataType.f32;
}

export type InputData = DataType.Packed<DataType.Packed<InputEntry>[]>;