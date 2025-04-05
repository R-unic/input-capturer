# @rbxts/input-capturer
A module to record and then playback user inputs

## Example
```ts
import InputCapturer from "@rbxts/input-capturer";

InputCapturer.start();
task.wait(5); // capture inputs for 5 seconds
InputCapturer.stop();

const inputBuffer = InputCapturer.getCaptured();
InputCapturer.replay(inputBuffer, print).await(); // playback inputs using `print`
```