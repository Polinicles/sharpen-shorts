import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

export const ChallengeVideo: React.FC = () => {
  const frame = useCurrentFrame();

  const revealFrame = 240; // Reveal the answer after 8 seconds (240 frames at 30fps)

  const revealed = frame >= revealFrame;

  const endCardStart = 360;
  const showEndCard = frame >= endCardStart;
  const endCardOpacity = Math.min(1, (frame - endCardStart) / 15);

  const progress = Math.max(0, 100 - (frame / revealFrame) * 100);

  const answers = ["Retry storm", "Deadlock", "GC issue", "Goroutine leak"];

  const correctIndex = 0;

  if (showEndCard) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#0B1220",
          fontFamily: "Inter, Arial, Helvetica, sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: endCardOpacity,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",

            background:
              "linear-gradient(120deg, rgba(138,123,255,0.2), rgba(99,230,190,0.2))",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#FFFFFF",

            padding: "14px 32px",

            borderRadius: 999,

            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Sharpen
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#E9ECF4",
            marginTop: 36,
          }}
        >
          sharpen.sh
        </div>

        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: "#9AA2B5",
            marginTop: 18,
            textAlign: "center",
          }}
        >
          One engineering challenge a day
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0B1220",
        color: "#F8FAFC",
        padding: 60,
        fontFamily: "Inter, Arial, Helvetica, sans-serif",
      }}
    >
      {/* CATEGORY */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 16,

          width: "fit-content",
          alignSelf: "flex-start",

          backgroundColor: "#172554",
          color: "#BFDBFE",

          padding: "12px 24px",

          borderRadius: 999,

          fontSize: 28,
          fontWeight: 800,

          marginBottom: 40,
        }}
      >
        <div
          style={{
            width: 28,
            display: "flex",
            justifyContent: "center",
          }}
        >
          🚀
        </div>

        <span>GOLANG</span>
      </div>

      {/* QUESTION */}
      <div
        style={{
          fontSize: 62,
          fontWeight: 800,
          lineHeight: 1.3,
          marginBottom: 55,
        }}
      >
        A Go service retries failed requests aggressively during outages.
        <br />
        <br />
        What caused CPU usage to spike?
      </div>

      {/* ANSWERS */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {answers.map((answer, index) => {
          const correct = index === correctIndex;

          return (
            <div
              key={answer}
              style={{
                display: "flex",
                alignItems: "center",

                padding: 26,

                borderRadius: 20,

                border:
                  revealed && correct
                    ? "2px solid #22C55E"
                    : "2px solid #334155",

                backgroundColor: revealed && correct ? "#14532D" : "#1E293B",

                boxShadow:
                  revealed && correct ? "0 0 50px rgba(34,197,94,.35)" : "none",

                opacity: revealed && !correct ? 0.4 : 1,
              }}
            >
              {/* LETTER */}
              <div
                style={{
                  width: 54,
                  height: 54,

                  borderRadius: 999,

                  backgroundColor: revealed && correct ? "#22C55E" : "#334155",

                  color: revealed && correct ? "#0B1220" : "#FFFFFF",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  fontSize: 24,
                  fontWeight: 800,

                  marginRight: 24,
                }}
              >
                {String.fromCharCode(65 + index)}
              </div>

              {/* ANSWER */}
              <div
                style={{
                  flex: 1,
                  fontSize: 44,
                  fontWeight: 700,
                }}
              >
                {answer}
              </div>

              {/* CORRECT ICON */}
              {revealed && correct && (
                <div
                  style={{
                    fontSize: 42,
                    marginLeft: 40,
                  }}
                >
                  ✅
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* PROGRESS BAR */}
      {!revealed && (
        <div
          style={{
            marginTop: 45,
          }}
        >
          <div
            style={{
              height: 18,

              backgroundColor: "#1E293B",

              borderRadius: 999,

              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,

                backgroundColor: "#38BDF8",
              }}
            />
          </div>
        </div>
      )}

      {/* EXPLANATION */}
      {revealed && (
        <div
          style={{
            marginTop: 35,

            backgroundColor: "#111827",

            border: "1px solid #1F2937",

            borderRadius: 24,

            padding: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,

              fontSize: 36,
              fontWeight: 800,

              color: "#22C55E",

              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 32,
                display: "flex",
                justifyContent: "center",
              }}
            >
              🎯
            </div>

            <span>Retry storm</span>
          </div>

          <div
            style={{
              fontSize: 38,
              lineHeight: 1.4,
              fontWeight: 500,

              color: "#CBD5E1",
            }}
          >
            Retries amplified the outage.
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
