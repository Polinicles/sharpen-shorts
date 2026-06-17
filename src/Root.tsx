import { Composition } from "remotion";
import { CommandExample } from "./CommandExample";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="ChallengeVideo1"
        component={CommandExample}
        durationInFrames={405} // 12s content + 1.5s end card at 30fps
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};