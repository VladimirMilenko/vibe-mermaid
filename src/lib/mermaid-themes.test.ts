import { expect, test } from "bun:test";
import { adaptDefinitionForTheme, buildMermaidThemeVariables, contrastRatio, pickContrastText } from "./mermaid-themes";

test("pickContrastText prefers readable pair on light background", () => {
  expect(pickContrastText("#fffaf0", { light: "#fffef8", dark: "#2f2a24" })).toBe("#2f2a24");
});

test("pickContrastText prefers readable pair on dark background", () => {
  expect(pickContrastText("#151f2e", { light: "#fff7d6", dark: "#151f2e" })).toBe("#fff7d6");
});

test("buildMermaidThemeVariables sets gantt contrast pairs", () => {
  const theme = buildMermaidThemeVariables({
    background: "#fffaf0",
    primary: "#fff7db",
    secondary: "#e9f6ff",
    tertiary: "#ffe8cc",
    contrast: "#5f5549",
    line: "#2f2a24",
    noteBackground: "#fff2b8",
    fontFamily: "sans-serif",
    lightText: "#fffef8",
    darkText: "#2f2a24",
  });

  expect(contrastRatio(theme.taskTextLightColor, theme.contrast)).toBeGreaterThan(4.5);
  expect(contrastRatio(theme.taskTextDarkColor, theme.background)).toBeGreaterThan(4.5);
  expect(theme.taskTextOutsideColor).toBe(theme.taskTextDarkColor);
});

test("edge labels use opaque diagram background", () => {
  const theme = buildMermaidThemeVariables({
    background: "#151f2e",
    primary: "#2a4362",
    secondary: "#1e3348",
    tertiary: "#3d5a80",
    contrast: "#fbbf24",
    line: "#fff7d6",
    noteBackground: "#332a18",
    darkMode: true,
    fontFamily: "sans-serif",
    lightText: "#fff7d6",
    darkText: "#151f2e",
  });

  expect(theme.edgeLabelBackground).toBe("#151f2e");
  expect(contrastRatio(theme.labelTextColor, theme.edgeLabelBackground)).toBeGreaterThan(4.5);
});

test("chalkboard theme uses dark ink on bright task bars", () => {
  const theme = buildMermaidThemeVariables({
    background: "#151f2e",
    primary: "#2a4362",
    secondary: "#1e3348",
    tertiary: "#3d5a80",
    contrast: "#fbbf24",
    line: "#fff7d6",
    noteBackground: "#332a18",
    darkMode: true,
    fontFamily: "sans-serif",
    lightText: "#fff7d6",
    darkText: "#151f2e",
  });

  expect(contrastRatio(theme.taskTextLightColor, theme.contrast)).toBeGreaterThan(4.5);
  expect(contrastRatio(theme.taskTextDarkColor, theme.background)).toBeGreaterThan(4.5);
});

const legacyFlowchart = `flowchart LR
  gateway -- No --> rejected
  gateway -- Yes --> queue
  classDef primary fill:#101828,color:#fff,stroke:#101828
  classDef success fill:#dcfce7,color:#166534,stroke:#86efac
  class render primary`;

test("rewrites legacy primary classDef for light theme", () => {
  const adapted = adaptDefinitionForTheme(legacyFlowchart, "aurora");

  expect(adapted).toContain("classDef primary fill:#2f2a24,color:#fff7db,stroke:#2f2a24");
  expect(adapted).not.toContain("#101828");
});

test("rewrites legacy success classDef to white-on-green for hand drawn", () => {
  const adapted = adaptDefinitionForTheme(legacyFlowchart, "aurora");

  expect(adapted).toContain("classDef success fill:#15803d,color:#ffffff,stroke:#22c55e");
  expect(adapted).not.toContain("#166534");
});

test("uses chalk-friendly primary on dark theme", () => {
  const adapted = adaptDefinitionForTheme(legacyFlowchart, "night");

  expect(adapted).toContain("classDef primary fill:#fbbf24,color:#151f2e,stroke:#151f2e");
  expect(adapted).toContain("classDef success fill:#166534,color:#ecfdf5,stroke:#4ade80");
});
