import { text } from "@/theme/tokens";

describe("text scale", () => {
  const variants = ["title", "heading", "subheading", "body", "label", "caption", "micro"] as const;
  it("defines every variant with numeric size + lineHeight and a valid weight", () => {
    for (const k of variants) {
      expect(typeof text[k].size).toBe("number");
      expect(typeof text[k].lineHeight).toBe("number");
      expect(["regular", "medium", "semibold", "bold"]).toContain(text[k].weight);
    }
  });
});
