import type { UserConfig } from "@commitlint/types";

const MENTION_PATTERN = /@[a-z][\w-]*/gi;
const BACKTICK_CODE_PATTERN = /`[^`]*`/g;

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  plugins: [
    {
      rules: {
        "no-at-mentions": ({ body, subject }) => {
          const text = `${subject || ""} ${body || ""}`.replaceAll(
            BACKTICK_CODE_PATTERN,
            "",
          );

          const mentions = text.match(MENTION_PATTERN);

          if (mentions && mentions.length > 0) {
            return [
              false,
              `Avoid bare @mentions in commit messages (found: ${mentions.join(", ")}). Wrap in backticks: \`@example\``,
            ];
          }
          return [true, ""];
        },
      },
    },
  ],
  rules: {
    "no-at-mentions": [2, "always"],
  },
};

export default config;
