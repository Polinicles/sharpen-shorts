import React from "react";
import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const FADE_FRAMES = 30;
const PEAK_VOLUME = 0.18;

export const Music: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const volume = interpolate(
    frame,
    [0, FADE_FRAMES, durationInFrames - FADE_FRAMES, durationInFrames],
    [0, PEAK_VOLUME, PEAK_VOLUME, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Audio
      src={staticFile("audio/background-music.mp4")}
      volume={volume}
      loop
    />
  );
};
