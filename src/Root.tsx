import { Composition } from "remotion";
import { Short } from "./Short";
import { getDurationInFrames } from "./content/duration";
import type { ShortContent } from "./content/types";
import queue from "./content/queue.json";

const FPS = 30;

export const RemotionRoot = () => {
  return (
    <>
      {(queue as ShortContent[]).map((content) => (
        <Composition<any, ShortContent>
          key={content.id}
          id={content.id}
          component={Short}
          durationInFrames={getDurationInFrames(content, FPS)}
          fps={FPS}
          width={1080}
          height={1920}
          defaultProps={content}
        />
      ))}
    </>
  );
};
