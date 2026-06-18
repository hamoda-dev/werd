import { THEME_LIST } from "@/theme/registry";
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

describe.each(THEME_LIST.map((t) => [t.id, t] as const))("theme: %s", (_id, theme) => {
  it("paints every gradient as a css gradient string", () => {
    for (const k of ["darkScreen", "brandCard", "gold", "sage", "terracotta", "onboardingGlow", "logoGlow"] as const) {
      expect(typeof theme.gradients[k]).toBe("string");
      expect(theme.gradients[k]).toMatch(/gradient\(/);
    }
  });

  it("defines every shadow as a css box-shadow string", () => {
    for (const k of ["cardOnCream", "darkElevated", "terracotta", "floatingButton", "goldCard", "sheet"] as const) {
      expect(typeof theme.shadows[k]).toBe("string");
      expect(theme.shadows[k]).toMatch(/px/);
    }
  });

  it("uses numeric radii", () => {
    for (const k of ["tile", "card", "cardLg", "pill"] as const) {
      expect(typeof theme.radii[k]).toBe("number");
    }
  });

  it("aliases semantic roles to the palette", () => {
    const { colors, semantic } = theme;
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

  it("shares the white-on-color literals", () => {
    expect(theme.semantic.textOnColor).toBe("#fff");
    expect(theme.semantic.surfaceWhite).toBe("#fff");
    expect(typeof theme.semantic.tabBar).toBe("string");
    expect(typeof theme.semantic.inkChip).toBe("string");
    expect(typeof theme.semantic.inkTrack).toBe("string");
  });

  it("defines the decorative tokens the cute components read", () => {
    for (const k of ["mascotBody", "mascotFace", "mascotCheek", "blobPink", "blobPeach", "blobLilac", "heartEmpty"] as const) {
      expect(typeof theme.semantic[k]).toBe("string");
    }
  });
});

describe("registry", () => {
  it("has the default werd theme with the cute features off", () => {
    const werd = THEME_LIST.find((t) => t.id === "werd")!;
    expect(werd).toBeDefined();
    expect(Object.values(werd.features).every((v) => v === false)).toBe(true);
    expect(werd.statusBarStyle).toBe("light");
  });
  it("has the pink theme with the cute features on", () => {
    const pink = THEME_LIST.find((t) => t.id === "pink")!;
    expect(pink).toBeDefined();
    expect(Object.values(pink.features).every((v) => v === true)).toBe(true);
    expect(pink.statusBarStyle).toBe("dark");
  });
});
