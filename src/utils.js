// limit the device pixel ratio to 2 for high pixel ratio devices to save power consumption (esp. mobile devices)
export const getDevicePixelRatio = () => Math.min(window.devicePixelRatio, 2);
