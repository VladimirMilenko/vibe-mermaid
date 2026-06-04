import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { appUiToCssVars, darkAppUi, lightAppUi } from "@/lib/app-theme";
import { adaptDefinitionForTheme, buildMermaidThemeVariables, flowchartPresetBody } from "@/lib/mermaid-themes";
import {
  Braces,
  Check,
  Copy,
  Download,
  FileCode2,
  ImageDown,
  Link2,
  Palette,
  Play,
  RefreshCw,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import mermaid, { type MermaidConfig } from "mermaid";
import { useDeferredValue, useEffect, useRef, useState, type CSSProperties } from "react";

type MermaidLook = NonNullable<MermaidConfig["look"]>;
type FlowchartCurve = NonNullable<NonNullable<MermaidConfig["flowchart"]>["curve"]>;
type MermaidTheme = NonNullable<MermaidConfig["theme"]>;
type ExportScale = 1 | 2 | 4;

const exportScaleOptions = [
  { value: 1 as ExportScale, label: "1×" },
  { value: 2 as ExportScale, label: "2×" },
  { value: 4 as ExportScale, label: "4×" },
] as const;

const diagramPresets = [
  {
    id: "flowchart",
    label: "Flowchart",
    description: "Service workflow",
    code: flowchartPresetBody,
  },
  {
    id: "sequence",
    label: "Sequence",
    description: "Render request path",
    code: `sequenceDiagram
  autonumber
  participant UI as React UI
  participant API as Bun API
  participant M as Mermaid renderer
  participant D as Download

  UI->>API: load themes and examples
  UI->>M: render chart definition
  M-->>UI: SVG markup
  UI->>D: export SVG artifact`,
  },
  {
    id: "state",
    label: "State",
    description: "Job lifecycle",
    code: `stateDiagram-v2
  [*] --> Draft
  Draft --> Rendering: syntax valid
  Draft --> Failed: syntax error
  Rendering --> Ready: SVG produced
  Rendering --> Failed: timeout
  Failed --> Draft: edit diagram
  Ready --> Downloaded
  Downloaded --> [*]`,
  },
  {
    id: "er",
    label: "ER",
    description: "Stored render metadata",
    code: `erDiagram
  RENDER_JOB ||--o{ ARTIFACT : creates
  RENDER_JOB {
    string id
    string diagram_type
    string theme
    datetime created_at
  }
  ARTIFACT {
    string id
    string format
    int byte_size
  }`,
  },
  {
    id: "gantt",
    label: "Gantt",
    description: "Launch plan",
    code: `gantt
  title Mermaid renderer launch
  dateFormat  YYYY-MM-DD
  section Foundation
  API contract           :done, api, 2026-06-01, 2d
  Theme system           :active, theme, after api, 3d
  section Delivery
  Export controls        :export, after theme, 2d
  Production hardening   :hardening, after export, 3d`,
  },
] as const;

const handDrawnFont = "Virgil, Segoe Print, Bradley Hand, Comic Sans MS, Chalkboard SE, cursive";
const cleanFont = "Avenir Next, ui-sans-serif, system-ui, sans-serif";

const themePresets = [
  {
    id: "aurora",
    label: "Sketchbook",
    mermaidTheme: "base" as MermaidTheme,
    surface: "from-[#f8f2e7] via-[#fffaf0] to-[#f1dfc2]",
    canvas: "bg-[#fffaf0]",
    exportBackground: "#fffaf0",
    panel: "bg-[#fffaf0]/88 border-[#2f2a24]/15 shadow-[#7b5d3a]/12",
    accent: "#8b5cf6",
    swatch: "bg-[#8b5cf6]",
    defaultLook: "handDrawn" as MermaidLook,
    ui: lightAppUi,
    variables: buildMermaidThemeVariables({
      background: "#fffaf0",
      primary: "#fff7db",
      secondary: "#e9f6ff",
      tertiary: "#ffe8cc",
      contrast: "#5f5549",
      line: "#2f2a24",
      noteBackground: "#fff2b8",
      done: "#d6d3d1",
      critical: "#dc2626",
      fontFamily: handDrawnFont,
      lightText: "#fffef8",
      darkText: "#2f2a24",
    }),
  },
  {
    id: "paper",
    label: "Clean Paper",
    mermaidTheme: "base" as MermaidTheme,
    surface: "from-[#f5efe5] via-[#fffaf3] to-[#eadac6]",
    canvas: "bg-[#fffdf8]",
    exportBackground: "#fffdf8",
    panel: "bg-[#fffdf8]/90 border-[#3b332b]/12 shadow-[#7b5d3a]/10",
    accent: "#d97706",
    swatch: "bg-[#d97706]",
    defaultLook: "handDrawn" as MermaidLook,
    ui: lightAppUi,
    variables: buildMermaidThemeVariables({
      background: "#fffdf8",
      primary: "#ffffff",
      secondary: "#f7ead7",
      tertiary: "#e9f3f8",
      contrast: "#3b332b",
      line: "#3b332b",
      noteBackground: "#fff2c4",
      done: "#e7e5e4",
      critical: "#b45309",
      fontFamily: cleanFont,
      lightText: "#ffffff",
      darkText: "#2d2620",
    }),
  },
  {
    id: "night",
    label: "Chalkboard",
    mermaidTheme: "dark" as MermaidTheme,
    surface: "from-[#111827] via-[#172033] to-[#263244]",
    canvas: "bg-[#151f2e]",
    exportBackground: "#151f2e",
    panel: "bg-[#101827]/88 border-white/12 shadow-black/25",
    accent: "#fbbf24",
    swatch: "bg-[#fbbf24]",
    defaultLook: "neo" as MermaidLook,
    ui: darkAppUi,
    variables: buildMermaidThemeVariables({
      background: "#151f2e",
      primary: "#2a4362",
      secondary: "#1e3348",
      tertiary: "#3d5a80",
      contrast: "#fbbf24",
      line: "#fff7d6",
      noteBackground: "#332a18",
      done: "#57534e",
      critical: "#f87171",
      darkMode: true,
      fontFamily: handDrawnFont,
      lightText: "#fff7d6",
      darkText: "#151f2e",
    }),
  },
  {
    id: "forest",
    label: "Blueprint",
    mermaidTheme: "base" as MermaidTheme,
    surface: "from-[#dbeafe] via-[#eff6ff] to-[#bfdbfe]",
    canvas: "bg-[#edf6ff]",
    exportBackground: "#edf6ff",
    panel: "bg-[#f8fbff]/88 border-[#1d4ed8]/15 shadow-[#1d4ed8]/10",
    accent: "#2563eb",
    swatch: "bg-[#2563eb]",
    defaultLook: "handDrawn" as MermaidLook,
    ui: lightAppUi,
    variables: buildMermaidThemeVariables({
      background: "#edf6ff",
      primary: "#ffffff",
      secondary: "#dbeafe",
      tertiary: "#eff6ff",
      contrast: "#1d4ed8",
      line: "#2563eb",
      noteBackground: "#fef3c7",
      done: "#93c5fd",
      critical: "#dc2626",
      fontFamily: cleanFont,
      lightText: "#ffffff",
      darkText: "#16315f",
    }),
  },
] as const;

const lookOptions = [
  { value: "classic", label: "Classic" },
  { value: "neo", label: "Neo" },
  { value: "handDrawn", label: "Hand drawn" },
] as const satisfies readonly { value: MermaidLook; label: string }[];

const curveOptions = [
  { value: "basis", label: "Basis" },
  { value: "linear", label: "Linear" },
  { value: "natural", label: "Natural" },
  { value: "step", label: "Step" },
  { value: "rounded", label: "Rounded" },
] as const satisfies readonly { value: FlowchartCurve; label: string }[];

type DiagramPresetId = (typeof diagramPresets)[number]["id"];
type ThemeId = (typeof themePresets)[number]["id"];

const defaultDiagram = diagramPresets[0]!;
const defaultTheme = themePresets[0]!;

function getTheme(id: ThemeId) {
  return themePresets.find(theme => theme.id === id) ?? defaultTheme;
}

function getDiagram(id: DiagramPresetId) {
  return diagramPresets.find(diagram => diagram.id === id) ?? defaultDiagram;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "str" in error) {
    return String((error as { str: unknown }).str);
  }

  return String(error);
}

function inferDiagramType(source: string) {
  const firstLine = source.trim().split("\n")[0]?.trim() ?? "";
  if (!firstLine) return "Unknown";
  return firstLine.replace(/[{].*$/, "").trim();
}

function downloadSvg(svg: string, name: string) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = `${name}.svg`;
  anchor.click();
  URL.revokeObjectURL(href);
}

function getSvgSize(svg: string) {
  const viewBox = svg.match(/viewBox="([^"]+)"/i)?.[1]?.split(/\s+/).map(Number);
  if (viewBox?.length === 4 && viewBox.every(value => Number.isFinite(value))) {
    return { width: Math.ceil(viewBox[2]!), height: Math.ceil(viewBox[3]!) };
  }

  const width = Number(svg.match(/width="([\d.]+)"/i)?.[1]);
  const height = Number(svg.match(/height="([\d.]+)"/i)?.[1]);

  return {
    width: Number.isFinite(width) && width > 0 ? Math.ceil(width) : 1600,
    height: Number.isFinite(height) && height > 0 ? Math.ceil(height) : 1000,
  };
}

function encodeShareValue(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach(byte => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function decodeShareValue(value: string | null) {
  if (!value) return null;

  try {
    const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));

    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

function getSharedState() {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const definition = decodeShareValue(params.get("code"));
  const diagram = params.get("diagram") as DiagramPresetId | null;
  const theme = params.get("theme") as ThemeId | null;
  const sharedLook = params.get("look") as MermaidLook | null;
  const sharedCurve = params.get("curve") as FlowchartCurve | null;
  const transparentExport = params.get("background") === "none";
  const sharedScale = Number(params.get("scale"));
  const exportScale = exportScaleOptions.some(option => option.value === sharedScale)
    ? (sharedScale as ExportScale)
    : null;

  return {
    definition,
    diagram: diagramPresets.some(item => item.id === diagram) ? diagram : null,
    theme: themePresets.some(item => item.id === theme) ? theme : null,
    look: lookOptions.some(item => item.value === sharedLook) ? sharedLook : null,
    curve: curveOptions.some(item => item.value === sharedCurve) ? sharedCurve : null,
    transparentExport,
    exportScale,
  };
}

function createShareUrl(options: {
  definition: string;
  diagramId: DiagramPresetId;
  themeId: ThemeId;
  look: MermaidLook;
  curve: FlowchartCurve;
  transparentExport: boolean;
  exportScale: ExportScale;
}) {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("diagram", options.diagramId);
  url.searchParams.set("theme", options.themeId);
  url.searchParams.set("look", options.look);
  url.searchParams.set("curve", options.curve);
  url.searchParams.set("scale", String(options.exportScale));
  if (options.transparentExport) {
    url.searchParams.set("background", "none");
  }
  url.searchParams.set("code", encodeShareValue(options.definition));

  return url.toString();
}

async function downloadPng(svg: string, name: string, background: string | null, scale: ExportScale) {
  const size = getSvgSize(svg);
  const padding = 96;
  const normalizedSvg = svg
    .replace(/<svg\b([^>]*)>/i, (_match, attributes: string) => {
      const cleanAttributes = attributes.replace(/\s(width|height)="[^"]*"/gi, "");
      const namespace = /\sxmlns=/.test(cleanAttributes) ? "" : ' xmlns="http://www.w3.org/2000/svg"';

      return `<svg${namespace}${cleanAttributes} width="${size.width}" height="${size.height}">`;
    })
    .replace(/font-family:[^;"]+/gi, "font-family: Segoe Print, Comic Sans MS, Chalkboard SE, cursive");
  const image = new Image();
  const svgUrl = URL.createObjectURL(new Blob([normalizedSvg], { type: "image/svg+xml;charset=utf-8" }));

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Unable to prepare SVG for PNG export."));
      image.src = svgUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil((size.width + padding * 2) * scale);
    canvas.height = Math.ceil((size.height + padding * 2) * scale);

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("PNG export is not available in this browser.");
    }

    if (background) {
      context.fillStyle = background;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.scale(scale, scale);
    context.drawImage(image, padding, padding, size.width, size.height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(result => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Unable to encode PNG."));
        }
      }, "image/png");
    });

    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = `${name}-${scale}x.png`;
    anchor.click();
    URL.revokeObjectURL(href);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

export function App() {
  const sharedState = useRef(getSharedState());
  const [definition, setDefinition] = useState(sharedState.current?.definition ?? defaultDiagram.code);
  const [diagramId, setDiagramId] = useState<DiagramPresetId>(sharedState.current?.diagram ?? defaultDiagram.id);
  const [themeId, setThemeId] = useState<ThemeId>(sharedState.current?.theme ?? defaultTheme.id);
  const [look, setLook] = useState<MermaidLook>(
    sharedState.current?.look ?? getTheme(sharedState.current?.theme ?? defaultTheme.id).defaultLook,
  );
  const [curve, setCurve] = useState<FlowchartCurve>(sharedState.current?.curve ?? "natural");
  const [renderedSvg, setRenderedSvg] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "rendering" | "ready" | "error">("idle");
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [transparentExport, setTransparentExport] = useState(sharedState.current?.transparentExport ?? false);
  const [exportScale, setExportScale] = useState<ExportScale>(sharedState.current?.exportScale ?? 2);
  const [exportError, setExportError] = useState("");
  const renderCountRef = useRef(0);
  const deferredDefinition = useDeferredValue(definition);
  const selectedTheme = getTheme(themeId);
  const ui = selectedTheme.ui;

  useEffect(() => {
    const pageBackground = ui.dark ? "#0f172a" : "#f8f2e7";
    document.documentElement.style.colorScheme = ui.dark ? "dark" : "light";
    document.documentElement.style.background = pageBackground;
    document.body.style.background = pageBackground;
    document.body.style.color = ui.text;

    if (ui.dark) {
      document.documentElement.dataset.uiDark = "";
    } else {
      delete document.documentElement.dataset.uiDark;
    }
  }, [ui]);

  useEffect(() => {
    const renderCount = ++renderCountRef.current;
    const timeout = window.setTimeout(async () => {
      if (!deferredDefinition.trim()) {
        setRenderedSvg("");
        setError("Add Mermaid syntax to render a chart.");
        setStatus("error");
        return;
      }

      setStatus("rendering");
      setError("");

      const config: MermaidConfig = {
        startOnLoad: false,
        suppressErrorRendering: true,
        securityLevel: "strict",
        htmlLabels: false,
        theme: selectedTheme.mermaidTheme,
        themeVariables: selectedTheme.variables,
        look,
        handDrawnSeed: 7,
        flowchart: {
          curve,
          diagramPadding: 28,
          nodeSpacing: 62,
          rankSpacing: 84,
          wrappingWidth: 210,
        },
        sequence: {
          mirrorActors: false,
          showSequenceNumbers: true,
        },
      };

      try {
        mermaid.initialize(config);
        const renderId = `mermaid-render-${Date.now()}-${renderCount}`;
        const result = await mermaid.render(renderId, adaptDefinitionForTheme(deferredDefinition, themeId));

        if (renderCount !== renderCountRef.current) return;

        setRenderedSvg(result.svg);
        setStatus("ready");
      } catch (caughtError) {
        if (renderCount !== renderCountRef.current) return;

        setRenderedSvg("");
        setError(getErrorMessage(caughtError));
        setStatus("error");
      }
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [curve, deferredDefinition, look, selectedTheme, themeId]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const nextUrl = createShareUrl({ definition, diagramId, themeId, look, curve, transparentExport, exportScale });

      window.history.replaceState(null, "", nextUrl);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [curve, definition, diagramId, exportScale, look, themeId, transparentExport]);

  const selectedDiagram = getDiagram(diagramId);
  const lineCount = definition.split("\n").length;
  const characterCount = definition.length;
  const diagramType = inferDiagramType(definition);

  async function copySvg() {
    if (!renderedSvg) return;

    await navigator.clipboard.writeText(renderedSvg);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  async function copyShareUrl() {
    const shareUrl = createShareUrl({ definition, diagramId, themeId, look, curve, transparentExport, exportScale });

    await navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    window.setTimeout(() => setCopiedLink(false), 1200);
  }

  async function exportPng() {
    if (!renderedSvg) return;

    try {
      setExportError("");
      await downloadPng(
        renderedSvg,
        `mermaid-${diagramType.toLowerCase().replaceAll(" ", "-")}`,
        transparentExport ? null : selectedTheme.exportBackground,
        exportScale,
      );
    } catch (caughtError) {
      setExportError(getErrorMessage(caughtError));
    }
  }

  function selectTheme(value: ThemeId) {
    const nextTheme = getTheme(value);
    setThemeId(value);
    setLook(nextTheme.defaultLook);
  }

  function selectDiagram(value: DiagramPresetId) {
    const nextDiagram = getDiagram(value);
    setDiagramId(value);
    setDefinition(nextDiagram.code);
  }

  function resetCurrentDiagram() {
    setDefinition(selectedDiagram.code);
  }

  return (
    <main
      className="app-shell relative flex min-h-screen flex-col overflow-hidden lg:h-screen"
      style={appUiToCssVars(ui)}
    >
      <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br transition-all duration-700", selectedTheme.surface)} />
      <div className="app-grid-bg pointer-events-none absolute inset-0 opacity-60" />

      <header className="glass-panel ui-panel relative z-20 flex shrink-0 items-center justify-between gap-4 border-b px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="ui-icon-surface flex size-10 shrink-0 items-center justify-center rounded-xl shadow-sm" style={{ color: selectedTheme.accent }}>
            <Sparkles className="size-5" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display ui-heading truncate text-xl tracking-tight sm:text-2xl">Sketch Mermaid</h1>
            <p className="ui-text-muted truncate text-xs sm:text-sm">Hand-drawn diagrams · live preview · SVG & PNG export</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="ui-badge hidden items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium sm:flex">
            <span style={{ color: selectedTheme.accent }}>{diagramPresets.length}</span> presets
            <span className="mx-1" style={{ color: "var(--ui-badge-divider)" }}>
              ·
            </span>
            <span style={{ color: selectedTheme.accent }}>{themePresets.length}</span> themes
          </div>
          <div
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
              status === "ready" && ui.statusReady,
              status === "rendering" && ui.statusRendering,
              status === "error" && ui.statusError,
              status === "idle" && ui.statusIdle,
            )}
          >
            <span
              className={cn(
                "size-2 rounded-full",
                status === "ready" && "bg-emerald-500",
                status === "rendering" && "animate-pulse bg-amber-400",
                status === "error" && "bg-rose-500",
                status === "idle" && (ui.dark ? "bg-amber-200/50" : "bg-[#9b765c]"),
              )}
            />
            {status === "ready" && "Ready"}
            {status === "rendering" && "Rendering"}
            {status === "error" && "Error"}
            {status === "idle" && "Idle"}
          </div>
        </div>
      </header>

      <div className="relative z-10 grid min-h-0 flex-1 lg:grid-cols-[minmax(340px,42%)_1fr] xl:grid-cols-[minmax(380px,44%)_1fr]">
        <aside className="glass-panel ui-panel flex min-h-[420px] flex-col border-b lg:min-h-0 lg:border-r lg:border-b-0">
          <div className="ui-border-b flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2">
              <FileCode2 className="size-4" style={{ color: selectedTheme.accent }} />
              <span className="text-sm font-semibold">Source</span>
            </div>
            <Button className="ui-button h-8 px-3 text-xs shadow-sm" variant="outline" onClick={resetCurrentDiagram}>
              <RefreshCw className="size-3.5" />
              Reset
            </Button>
          </div>

          <div className="ui-border-b shrink-0 space-y-3 px-4 py-3 sm:px-5">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {diagramPresets.map(diagram => (
                <button
                  key={diagram.id}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-left transition",
                    diagram.id === diagramId ? "ui-chip-active shadow-sm" : "ui-chip-idle",
                  )}
                  onClick={() => selectDiagram(diagram.id)}
                  title={diagram.description}
                  type="button"
                >
                  <span className="text-sm font-semibold">{diagram.label}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="ui-text-muted text-xs">Line curve</Label>
                <Select value={curve} onValueChange={value => setCurve(value as FlowchartCurve)}>
                  <SelectTrigger className="ui-select h-8 text-xs shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {curveOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="ui-text-muted text-xs">Visual style</Label>
                <Select value={look} onValueChange={value => setLook(value as MermaidLook)}>
                  <SelectTrigger className="ui-select h-8 text-xs shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {lookOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="ui-editor-header flex shrink-0 items-center justify-between px-4 py-2 text-[11px] uppercase tracking-[0.16em]">
              <span className="font-code normal-case tracking-normal" style={{ color: "var(--ui-editor-text)" }}>
                mermaid.md
              </span>
              <span>
                {lineCount} lines · {characterCount} chars
              </span>
            </div>
            <textarea
              className="code-editor ui-editor-textarea font-code min-h-0 w-full flex-1 resize-none p-4 text-[13px] leading-6 outline-none"
              onChange={event => setDefinition(event.target.value)}
              spellCheck={false}
              value={definition}
            />
          </div>
        </aside>

        <section className="glass-panel ui-panel flex min-h-[520px] flex-col lg:min-h-0">
          <div className="ui-border-b flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2">
              <WandSparkles className="size-4" style={{ color: selectedTheme.accent }} />
              <span className="text-sm font-semibold">Preview</span>
              <span className="ui-tag hidden items-center gap-1 rounded-md px-2 py-0.5 text-xs sm:inline-flex">
                <Braces className="size-3" />
                {diagramType}
              </span>
            </div>
          </div>

          <div className="ui-border-b flex shrink-0 flex-col gap-3 px-4 py-3 sm:px-5">
            <span className="text-xs font-semibold uppercase tracking-wide ui-text-muted">Export</span>

            <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
              <fieldset className="min-w-0 border-0 p-0" style={{ accentColor: selectedTheme.accent }}>
                <legend className="mb-2 text-xs font-medium ui-text-muted">PNG resolution</legend>
                <div className="flex flex-wrap gap-4">
                  {exportScaleOptions.map(option => (
                    <label key={option.value} className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        checked={exportScale === option.value}
                        className="ui-radio"
                        name="export-scale"
                        onChange={() => setExportScale(option.value)}
                        type="radio"
                        value={option.value}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="flex min-w-[220px] flex-col gap-2">
                <span className="text-xs font-medium ui-text-muted">PNG background</span>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    checked={transparentExport}
                    className="ui-checkbox"
                    onChange={event => setTransparentExport(event.target.checked)}
                    style={{ accentColor: selectedTheme.accent }}
                    type="checkbox"
                  />
                  Transparent background
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button className="ui-button h-8 px-3 text-xs shadow-sm" onClick={copyShareUrl} variant="outline">
                {copiedLink ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
                {copiedLink ? "Link copied" : "Copy share link"}
              </Button>
              <Button className="ui-button h-8 px-3 text-xs shadow-sm" disabled={!renderedSvg} onClick={copySvg} variant="outline">
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? "SVG copied" : "Copy SVG code"}
              </Button>
              <Button
                className="ui-button h-8 px-3 text-xs shadow-sm"
                disabled={!renderedSvg}
                onClick={() => downloadSvg(renderedSvg, `mermaid-${diagramType.toLowerCase().replaceAll(" ", "-")}`)}
                variant="outline"
              >
                <Download className="size-3.5" />
                Download SVG file
              </Button>
              <Button className="ui-button-accent h-8 px-3 text-xs shadow-sm" disabled={!renderedSvg} onClick={exportPng}>
                <ImageDown className="size-3.5" />
                Download PNG ({exportScale}×)
              </Button>
            </div>
          </div>

          <div className="ui-border-b flex shrink-0 flex-wrap items-center gap-2 px-4 py-2.5 sm:px-5">
            <Palette className="ui-text-muted size-3.5" />
            {themePresets.map(theme => (
              <button
                key={theme.id}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition",
                  theme.id === themeId ? "ui-chip-active shadow-sm" : "ui-chip-idle",
                )}
                onClick={() => selectTheme(theme.id)}
                type="button"
              >
                <span className={cn("size-2.5 rounded-full ring-1 ring-[color:var(--ui-border)]", theme.swatch)} />
                {theme.label}
              </button>
            ))}
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4">
            {exportError && <div className="ui-error mb-3 shrink-0 rounded-xl px-4 py-2.5 text-sm">{exportError}</div>}

            <div
              className={cn(
                "mermaid-preview sketch-canvas flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-2xl border p-4 sm:p-6",
                selectedTheme.canvas,
              )}
              style={{
                borderColor: "var(--ui-border)",
                "--diagram-text": selectedTheme.variables.textColor,
                "--diagram-edge-label-bg": selectedTheme.variables.edgeLabelBackground,
                "--diagram-line": selectedTheme.variables.lineColor,
              } as CSSProperties}
            >
              {status === "error" ? (
                <div className="ui-error max-w-lg rounded-xl p-5 text-left shadow-sm">
                  <div className="ui-error-title mb-2 text-xs font-semibold uppercase tracking-wider">Render error</div>
                  <pre className="font-code whitespace-pre-wrap text-sm leading-6">{error}</pre>
                </div>
              ) : renderedSvg ? (
                <div
                  className={cn(
                    "mermaid-svg-shell w-full max-w-4xl rounded-xl border p-6 shadow-md sm:p-8",
                    selectedTheme.canvas,
                  )}
                  style={{ borderColor: "var(--ui-border)" }}
                  dangerouslySetInnerHTML={{ __html: renderedSvg }}
                />
              ) : (
                <div className="ui-empty flex items-center gap-3 rounded-xl px-5 py-4 text-sm">
                  <Play className="size-4" style={{ color: selectedTheme.accent }} />
                  Start typing or pick a preset to render.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
