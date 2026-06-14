import { colors, gradients, semantic, text } from "@/theme/tokens";

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

describe("gradients", () => {
  const keys = ["darkScreen", "brandCard", "gold", "sage", "terracotta", "onboardingGlow"] as const;
  it("are ready-to-use css gradient strings", () => {
    for (const k of keys) {
      expect(typeof gradients[k]).toBe("string");
      expect(gradients[k]).toMatch(/gradient\(/);
    }
  });
});

describe("semantic colors alias the palette", () => {
  it("maps representative roles to the right palette values", () => {
    expect(semantic.screen).toBe(colors.green800);
    expect(semantic.surface).toBe(colors.whiteAlpha06);
    expect(semantic.brandSurface).toBe(colors.green700);
    expect(semantic.textPrimary).toBe(colors.creamText);
    expect(semantic.textSecondary).toBe(colors.muted3);
    expect(semantic.accent).toBe(colors.gold500);
    expect(semantic.accentLight).toBe(colors.gold300);
    expect(semantic.success).toBe(colors.sage);
    expect(semantic.border).toBe(colors.whiteAlpha14);
  });
  it("tokenizes the former literals", () => {
    expect(semantic.textOnColor).toBe("#fff");
    expect(semantic.textOnColorMuted).toBe("rgba(255,255,255,0.85)");
    expect(semantic.textGhost).toBe("#cfe0d6");
    expect(semantic.tabBar).toBe("rgba(14,45,34,0.96)");
  });
});
