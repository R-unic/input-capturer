import { RunService, UserInputService } from "@rbxts/services";

import type { InputEntry } from "./structs";
import { deserialize, serialize } from "./serde";

if (!RunService.IsClient())
  throw "[@rbxts/input-capturer]: Cannot run input capturer on server";

namespace InputCapturer {
  const capturedInputs: InputEntry[] = [];
  let capturingInput = false;
  let inputTime = 0;

  /**
   * Starts capturing input. If capturing is already started, this function does nothing.
   * To capture input, this function must be called before the input is given.
   * After calling this function, all input given will be captured until {@link stop()} is called.
   */
  export function start(): void {
    if (capturingInput) return;
    capturedInputs.clear();
    inputTime = 0;
    capturingInput = true;
  }

  /** Stops capturing input. If capturing is already stopped, this function does nothing. */
  export function stop(): void {
    if (!capturingInput) return;
    capturingInput = false;
  }

  /** @returns The captured input data in an input buffer. */
  export function getCaptured(): buffer {
    return serialize(capturedInputs);
  }

  export type InputCallback = (input: InputEntry) => void | Promise<void>;
  /**
   * Replay the given input buffer, calling the callback function for each input in the buffer.
   * The callback function is called with the input and the time at which the input was given.
   * The function returns a promise which is resolved when the replay is finished.
   * @param inputBuffer The buffer to replay.
   * @param inputCallback The callback to call for each input in the buffer.
   */
  export async function replay(inputBuffer: buffer, inputCallback: InputCallback): Promise<void> {
    return new Promise(async resolve => {
      const inputData = deserialize(inputBuffer);
      let i = 0;

      while (i < inputData.size()) {
        const input = inputData[i];
        await inputCallback(input);

        const nextInput = inputData[i + 1];
        if (nextInput) {
          const timeDiff = nextInput.time - input.time;
          if (timeDiff > 0.001) // only wait if there's a noticeable time difference
            task.wait(timeDiff);
        }

        i++;
      }
      resolve();
    });
  }

  function trackInput(inputObject: InputObject, gameProcessedEvent: boolean): void {
    capturedInputs.push({
      type: inputObject.UserInputType.Value,
      state: inputObject.UserInputState.Value,
      key: inputObject.KeyCode.Value === 0 ? undefined : inputObject.KeyCode.Value,
      time: inputTime,
      gameProcessedEvent
    });
  }

  UserInputService.InputBegan.Connect(trackInput);
  UserInputService.InputEnded.Connect(trackInput);
  RunService.RenderStepped.Connect(dt => {
    if (!capturingInput) return;
    inputTime += dt;
  });
}

export = InputCapturer;