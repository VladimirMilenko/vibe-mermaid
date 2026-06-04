type Rgb = readonly [number, number, number];

function parseHex(color: string): Rgb | null {
  const normalized = color.trim().replace("#", "");
  if (normalized.length === 3) {
    return [
      Number.parseInt(normalized[0]! + normalized[0], 16),
      Number.parseInt(normalized[1]! + normalized[1], 16),
      Number.parseInt(normalized[2]! + normalized[2], 16),
    ];
  }

  if (normalized.length === 6) {
    return [
      Number.parseInt(normalized.slice(0, 2), 16),
      Number.parseInt(normalized.slice(2, 4), 16),
      Number.parseInt(normalized.slice(4, 6), 16),
    ];
  }

  return null;
}

function channelLuminance(value: number) {
  const channel = value / 255;
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(color: string) {
  const rgb = parseHex(color);
  if (!rgb) return 0.5;

  const [r, g, b] = rgb.map(channelLuminance);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

export function pickContrastText(
  background: string,
  options: {
    light?: string;
    dark?: string;
    minRatio?: number;
  } = {},
) {
  const light = options.light ?? "#fffef8";
  const dark = options.dark ?? "#1f1a14";
  const minRatio = options.minRatio ?? 4.5;

  const lightRatio = contrastRatio(light, background);
  const darkRatio = contrastRatio(dark, background);

  if (lightRatio >= minRatio && darkRatio >= minRatio) {
    return darkRatio >= lightRatio ? dark : light;
  }

  if (lightRatio >= minRatio) return light;
  if (darkRatio >= minRatio) return dark;

  return darkRatio >= lightRatio ? dark : light;
}

export type ThemePalette = {
  background: string;
  primary: string;
  secondary: string;
  tertiary: string;
  contrast: string;
  line: string;
  noteBackground: string;
  noteText?: string;
  actorBackground?: string;
  actorBorder?: string;
  actorText?: string;
  done?: string;
  critical?: string;
  darkMode?: boolean;
  fontFamily: string;
  lightText?: string;
  darkText?: string;
};

export function buildMermaidThemeVariables(palette: ThemePalette) {
  const darkMode = palette.darkMode ?? relativeLuminance(palette.background) < 0.35;
  const lightText = palette.lightText ?? (darkMode ? "#fff7d6" : "#fffef8");
  const darkText = palette.darkText ?? (darkMode ? "#fff7d6" : "#2f2a24");

  const pick = (background: string) => pickContrastText(background, { light: lightText, dark: darkText });
  const primaryTextColor = pick(palette.primary);
  const secondaryTextColor = pick(palette.secondary);
  const tertiaryTextColor = pick(palette.tertiary);
  const textColor = pick(palette.background);
  const noteTextColor = palette.noteText ?? pick(palette.noteBackground);
  const actorBackground = palette.actorBackground ?? palette.primary;
  const actorBorder = palette.actorBorder ?? palette.line;
  const actorTextColor = palette.actorText ?? pick(actorBackground);
  const doneTaskBkgColor = palette.done ?? palette.secondary;
  const critBkgColor = palette.critical ?? "#dc2626";

  const taskTextLightColor = pick(palette.contrast);
  const taskTextDarkColor = pick(palette.background);
  const edgeLabelBackground = palette.background;

  return {
    darkMode,
    background: palette.background,
    primaryColor: palette.primary,
    secondaryColor: palette.secondary,
    tertiaryColor: palette.tertiary,
    contrast: palette.contrast,
    primaryTextColor,
    secondaryTextColor,
    tertiaryTextColor,
    textColor,
    darkTextColor: darkMode ? lightText : darkText,
    mainContrastColor: darkMode ? lightText : darkText,
    lineColor: palette.line,
    arrowheadColor: palette.line,
    primaryBorderColor: palette.line,
    secondaryBorderColor: palette.line,
    tertiaryBorderColor: palette.line,
    noteBkgColor: palette.noteBackground,
    noteTextColor,
    noteBorderColor: palette.line,
    nodeTextColor: primaryTextColor,
    mainBkg: palette.primary,
    nodeBkg: palette.primary,
    nodeBorder: palette.line,
    clusterBkg: palette.secondary,
    clusterBorder: palette.line,
    titleColor: textColor,
    classText: textColor,
    edgeLabelBackground,
    labelBackgroundColor: edgeLabelBackground,
    actorBkg: actorBackground,
    actorBorder,
    actorTextColor,
    actorLineColor: palette.line,
    labelTextColor: textColor,
    labelBoxBkgColor: edgeLabelBackground,
    labelBoxBorderColor: actorBorder,
    loopTextColor: actorTextColor,
    signalColor: palette.line,
    signalTextColor: textColor,
    activationBkgColor: palette.secondary,
    activationBorderColor: palette.line,
    sequenceNumberColor: pick(palette.line),
    stateLabelColor: primaryTextColor,
    stateBkg: palette.primary,
    transitionLabelColor: textColor,
    transitionColor: palette.line,
    taskBkgColor: palette.contrast,
    taskBorderColor: palette.line,
    taskTextColor: taskTextLightColor,
    taskTextLightColor,
    taskTextDarkColor,
    taskTextOutsideColor: taskTextDarkColor,
    activeTaskBkgColor: palette.primary,
    activeTaskBorderColor: palette.line,
    doneTaskBkgColor,
    doneTaskBorderColor: palette.line,
    critBkgColor,
    critBorderColor: critBkgColor,
    todayLineColor: critBkgColor,
    vertLineColor: palette.line,
    gridColor: palette.line,
    sectionBkgColor: palette.secondary,
    sectionBkgColor2: palette.tertiary,
    altSectionBkgColor: palette.background,
    excludeBkgColor: palette.background,
    errorBkgColor: palette.tertiary,
    errorTextColor: tertiaryTextColor,
    pieTitleTextColor: taskTextDarkColor,
    pieSectionTextColor: textColor,
    pieLegendTextColor: taskTextDarkColor,
    fontFamily: palette.fontFamily,
  } as const;
}

export type DiagramThemeId = "aurora" | "paper" | "night" | "forest";

type ClassDefPair = {
  primary: string;
  success: string;
};

const themeClassDefs: Record<DiagramThemeId, ClassDefPair> = {
  aurora: {
    primary: "classDef primary fill:#2f2a24,color:#fff7db,stroke:#2f2a24",
    success: "classDef success fill:#15803d,color:#ffffff,stroke:#22c55e",
  },
  paper: {
    primary: "classDef primary fill:#3b332b,color:#fffdf8,stroke:#3b332b",
    success: "classDef success fill:#15803d,color:#ffffff,stroke:#22c55e",
  },
  forest: {
    primary: "classDef primary fill:#16315f,color:#ffffff,stroke:#2563eb",
    success: "classDef success fill:#15803d,color:#ffffff,stroke:#22c55e",
  },
  night: {
    primary: "classDef primary fill:#fbbf24,color:#151f2e,stroke:#151f2e",
    success: "classDef success fill:#166534,color:#ecfdf5,stroke:#4ade80",
  },
};

const primaryClassDefPattern = /^[ \t]*classDef primary fill:[^\n]*/gm;
const successClassDefPattern = /^[ \t]*classDef success fill:[^\n]*/gm;

export function getThemeClassDefs(themeId: DiagramThemeId): ClassDefPair {
  return themeClassDefs[themeId];
}

export function adaptDefinitionForTheme(definition: string, themeId: DiagramThemeId) {
  const defs = getThemeClassDefs(themeId);

  return definition
    .replace(primaryClassDefPattern, defs.primary)
    .replace(successClassDefPattern, defs.success);
}

export const flowchartPresetBody = `flowchart LR
  client[Client request] --> gateway{Valid payload?}
  gateway -- No --> rejected[Return validation error]
  gateway -- Yes --> queue[Queue render job]
  queue --> render[Render Mermaid SVG]
  render --> store[(Artifact store)]
  store --> response[Return SVG + metadata]

  classDef primary fill:#2f2a24,color:#fff7db,stroke:#2f2a24
  classDef success fill:#15803d,color:#ffffff,stroke:#22c55e
  class render primary
  class response,store success`;
