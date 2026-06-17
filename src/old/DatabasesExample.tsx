import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Database } from "lucide-react";

export const DatabasesExample: React.FC = () => {
  const frame = useCurrentFrame();

  const revealFrame = 240;
  const revealed = frame >= revealFrame;

  const endCardStart = 360;
  const showEndCard = frame >= endCardStart;
  const endCardOpacity = Math.min(1, (frame - endCardStart) / 15);

  const progress = Math.max(
    0,
    100 - (frame / revealFrame) * 100
  );

  const answers = [
    "Foreign Key Cascade",
    "Read Replica",
    "Index",
    "Database Trigger",
  ];

  const correctIndex = 3;

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
        paddingLeft: 90,
        paddingRight: 90,
        paddingTop: 32,
        paddingBottom: 32,
        fontFamily:
          "Inter, Arial, Helvetica, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",

          justifyContent: "flex-start",

          paddingTop: 140,
        }}
      >
        {/* QUESTION BLOCK */}
        <div
          style={{
            marginBottom: 70,
          }}
        >
          {/* CATEGORY TAG */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,

              backgroundColor: "#0A2240",
              color: "#93C5FD",

              padding: "12px 24px",

              borderRadius: 999,

              fontSize: 30,
              fontWeight: 800,

              marginBottom: 28,
            }}
          >
            <Database
              size={28}
              strokeWidth={2.5}
            />
            <span>DATABASES</span>
          </div>

          {/* QUESTION */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#FFFFFF",
            }}
          >
            Rows appeared in the DB but
            no INSERT was executed.
            How? 🤔
          </div>
        </div>

        {/* ANSWERS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {answers.map((answer, index) => {
            const correct = index === correctIndex;

            return (
              <div
                key={answer}
                style={{
                  width: "100%",

                  display: "flex",
                  alignItems: "center",

                  paddingTop: 18,
                  paddingBottom: 18,
                  paddingLeft: 28,
                  paddingRight: 28,

                  borderRadius: 24,

                  border:
                    revealed && correct
                      ? "2px solid #22C55E"
                      : "2px solid #334155",

                  backgroundColor:
                    revealed && correct
                      ? "#14532D"
                      : "#1E293B",

                  boxShadow:
                    revealed && correct
                      ? "0 0 40px rgba(34,197,94,.35)"
                      : "none",

                  opacity:
                    revealed && !correct
                      ? 0.4
                      : 1,
                }}
              >
                {/* LETTER */}
                <div
                  style={{
                    width: 72,
                    height: 72,

                    borderRadius: 999,

                    backgroundColor:
                      revealed && correct
                        ? "#22C55E"
                        : "#334155",

                    color:
                      revealed && correct
                        ? "#0B1220"
                        : "#FFFFFF",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    fontSize: 30,
                    fontWeight: 800,

                    marginRight: 32,

                    flexShrink: 0,
                  }}
                >
                  {String.fromCharCode(65 + index)}
                </div>

                {/* ANSWER */}
                <div
                  style={{
                    flex: 1,

                    fontSize: 46,
                    fontWeight: 700,

                    paddingLeft: 12,
                    paddingRight: 24,
                  }}
                >
                  {answer}
                </div>

                {/* CHECK */}
                {revealed && correct && (
                  <div
                    style={{
                      fontSize: 36,
                      marginLeft: 20,
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
              marginTop: 70,
            }}
          >

            <div
              style={{
                height: 24,

                backgroundColor:
                  "#1E293B",

                borderRadius: 999,

                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",

                  width: `${progress}%`,

                  background:
                    "linear-gradient(90deg,#38BDF8,#4FD1C5)",
                }}
              />
            </div>
          </div>
        )}

        {/* EXPLANATION */}
        {revealed && (
          <div
            style={{
              marginTop: 60,

              backgroundColor:
                "#111827",

              border:
                "1px solid #1F2937",

              borderRadius: 24,

              padding: 36,
            }}
          >
            <div
              style={{
                fontSize: 42,
                fontWeight: 800,

                color: "#22C55E",

                marginBottom: 16,
              }}
            >
              ✓ Correct Answer
            </div>

            <div
              style={{
                fontSize: 54,
                lineHeight: 1.2,
                fontWeight: 600,

                color: "#CBD5E1",
              }}
            >
              Triggers automatically run database logic when data changes.
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};