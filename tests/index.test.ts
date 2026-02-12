import { describe, expect, it } from "vitest";

import { greet } from "../src/index";

describe("greet", () => {
  it("should greet a person by name", () => {
    expect(greet("World")).toBe("Hello, World!");
  });

  it("should handle empty string", () => {
    expect(greet("")).toBe("Hello, !");
  });

  it("should handle special characters", () => {
    expect(greet("John Doe")).toBe("Hello, John Doe!");
  });
});
