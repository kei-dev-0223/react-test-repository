"use client";

//ライブラリ
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation"; //現在のURLを取得する。ページ遷移時も都度更新される。
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

const CELL_SIZE        = 50;
const EXIT_MS          = 400;
const ENTER_MS         = 500;
const RESIDUE_COUNT    = 22;
const RESIDUE_ALPHA    = 0.8;
const RESIDUE_INTERVAL = 40;
const RESIDUE_DURATION = 1250;

// canvas は CSS変数を解釈できないため、描画のたびにJSで読み取る。
function themeColors() {
  const root = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) =>
    root.getPropertyValue(name).trim() || fallback;

  return {
    cell: read("--transition-cell", "#ffffff"),     // マス目の塗り
    fade: read("--transition-fade", "238, 236, 234"), // フェード
    grid: read("--transition-grid", "200, 196, 190"), // 罫線
  };
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "exit" | "enter" | "idle";

// ページ遷移後の残像ノイズ
function ResidueNoise({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const activeRef = useRef(active);

  useEffect(() => { activeRef.current = active; }, [active]);

  useEffect(() => {
    if (reduced) return; //動きを減らす設定なら残像ノイズを描かない
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols = Math.ceil(canvas.width  / CELL_SIZE);
    const rows = Math.ceil(canvas.height / CELL_SIZE);

    const cells = Array.from({ length: RESIDUE_COUNT }, () => ({
      x:       Math.floor(Math.random() * cols) * CELL_SIZE,
      y:       Math.floor(Math.random() * rows) * CELL_SIZE,
      phase:   Math.random() * Math.PI * 2,
      isWhite: Math.random() > 0.5,
    }));

    const startTs = performance.now();
    let lastTick = -1;

    const animate = (now: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (activeRef.current) {
        const elapsed = (now - startTs) / 1000;
        const { cell: cellColor, fade } = themeColors();

        cells.forEach((cell, idx) => {
          const freq  = 0.25 + idx * 0.05;
          const sine  = (Math.sin(elapsed * freq * Math.PI * 2 + cell.phase) + 1) / 2;
          const alpha = (0.2 + sine * 0.8) * RESIDUE_ALPHA;

          ctx.fillStyle = cell.isWhite
            ? `rgba(${hexToRgb(cellColor)},${alpha})`
            : `rgba(${fade},${alpha})`;
          ctx.fillRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE);
        });

        const tick = Math.floor((now - startTs) / RESIDUE_INTERVAL);
        if (tick !== lastTick) {
          lastTick = tick;
          const idx = Math.floor(Math.random() * RESIDUE_COUNT);
          cells[idx] = {
            x:       Math.floor(Math.random() * cols) * CELL_SIZE,
            y:       Math.floor(Math.random() * rows) * CELL_SIZE,
            phase:   Math.random() * Math.PI * 2,
            isWhite: Math.random() > 0.5,
          };
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "fixed",
        inset:         0,
        zIndex:        "var(--z-page-transition-residue)",
        pointerEvents: "none",
        opacity:       active ? 1 : 0,
        transition:    active ? "opacity 0.3s ease" : "opacity 4s ease",
      }}
    />
  );
}

// ページ遷移時のノイズマスク
function DissolveOverlay({ phase }: { phase: Phase }) {
  const reduced = useReducedMotion();
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const rafRef        = useRef<number>(0);
  const dissolveOrder = useRef<number[]>([]);

  useEffect(() => {
    if (reduced) return; //動きを減らす設定ならディゾルブを描かない
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols  = Math.ceil(canvas.width  / CELL_SIZE) + 1;
    const rows  = Math.ceil(canvas.height / CELL_SIZE) + 1;
    const total = cols * rows;
    dissolveOrder.current = shuffle(Array.from({ length: total }, (_, i) => i));

    if (phase === "idle") {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const draw = (progress: number, isExit: boolean) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W     = canvas.width;
      const H     = canvas.height;
      const order = dissolveOrder.current;

      ctx.clearRect(0, 0, W, H);
      const { cell, fade, grid } = themeColors();

      order.forEach((cellIdx, rank) => {
        const threshold = rank / total;
        const filled = isExit ? progress < threshold : progress > threshold;
        if (!filled) return;

        const col = cellIdx % cols;
        const row = Math.floor(cellIdx / cols);
        const x   = col * CELL_SIZE;
        const y   = row * CELL_SIZE;

        ctx.fillStyle   = cell;
        ctx.fillRect(x, y, CELL_SIZE + 0.5, CELL_SIZE + 0.5);
        ctx.strokeStyle = `rgba(${hexToRgb(cell)},0.35)`;
        ctx.lineWidth   = 0.2;
        ctx.strokeRect(x + 0.25, y + 0.25, CELL_SIZE, CELL_SIZE);
      });

      const FADE_SPAN = 0.08;
      order.forEach((cellIdx, rank) => {
        const threshold = rank / total;
        const dist = isExit ? threshold - progress : progress - threshold;
        if (dist < 0 || dist > FADE_SPAN) return;
        const alpha = isExit ? 1 - dist / FADE_SPAN : dist / FADE_SPAN;

        const col = cellIdx % cols;
        const row = Math.floor(cellIdx / cols);
        const x   = col * CELL_SIZE;
        const y   = row * CELL_SIZE;

        ctx.fillStyle   = `rgba(${fade},${alpha * 0.65})`;
        ctx.fillRect(x, y, CELL_SIZE + 0.5, CELL_SIZE + 0.5);
        ctx.strokeStyle = `rgba(${grid},${0.35 * alpha})`;
        ctx.lineWidth   = 0.5;
        ctx.strokeRect(x + 0.25, y + 0.25, CELL_SIZE, CELL_SIZE);
      });
    };

    const isExit  = phase === "exit";
    const totalMs = isExit ? EXIT_MS : ENTER_MS;
    const startTs = performance.now();

    cancelAnimationFrame(rafRef.current);

    const animate = (now: number) => {
      const linear   = Math.min((now - startTs) / totalMs, 1);
      const progress = linear < 0.5
        ? 2 * linear * linear
        : 1 - Math.pow(-2 * linear + 2, 2) / 2;
      draw(progress, isExit);
      if (linear < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, reduced]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "fixed",
        inset:         0,
        zIndex:        "var(--z-page-transition)",
        pointerEvents: "none",
        opacity:       phase === "idle" ? 0 : 1,
        transition:    phase === "idle" ? "opacity 0.15s" : "none",
      }}
    />
  );
}

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname                          = usePathname();
  const [phase, setPhase]                 = useState<Phase>("idle");
  const [displayKey, setDisplayKey]       = useState(pathname);
  const [contentReady, setContentReady]   = useState<boolean>(false);
  const [residueActive, setResidueActive] = useState<boolean>(false);
  const prevPathRef                       = useRef(pathname);

  // 初回マウント時のみ、コンテンツを表示
  useEffect(() => {
    setContentReady(true);
  },[]);

  // ページ遷移時の処理 --- pathnameの値(URL)が変わるたびに実行
  useEffect(() => {
    if (pathname === prevPathRef.current) return;
    prevPathRef.current = pathname;

    flushSync(() => {
      setResidueActive(false);
      setContentReady(false);
      setPhase("exit");
    });

    const t1 = setTimeout(() => {
      setDisplayKey(pathname);
      setContentReady(true);
      setPhase("enter");
    }, EXIT_MS);

    const t2 = setTimeout(() => {
      setPhase("idle");
      setResidueActive(true);
    }, EXIT_MS + ENTER_MS + 100);

    const t3 = setTimeout(() => {
      setResidueActive(false);
    }, EXIT_MS + ENTER_MS + 100 + RESIDUE_DURATION);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <DissolveOverlay phase={phase} />
      <ResidueNoise active={residueActive} />

        <motion.div
          className={contentReady ? "" : "u-opacity-0"} //遷移後ページが、「contentHidden」より早く描画されてしまうのを防ぐ(importantの0が必要)
          key={displayKey} //keyの値の変化を検知するたび、再アニメーション
          variants={{
            contentHidden: { //アニメーション前
              opacity: 0,
            },
            contentVisible: { //アニメーション後
              opacity: 1,
              transition: { duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] as const }
            },
          }}
          initial="contentHidden" //初期状態の設定
          animate={contentReady ? "contentVisible" : "contentHidden"} //アニメーション発火の条件
        >
          {children}
        </motion.div>
    </MotionConfig>
  );
}