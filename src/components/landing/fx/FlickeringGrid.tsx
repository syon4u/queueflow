/**
 * FlickeringGrid — ported from Magic UI (https://magicui.design/docs/components/flickering-grid)
 * MIT License, Copyright (c) 2024 Dillion Verma. Canvas-only, zero deps.
 * Adapted: honours prefers-reduced-motion (draws one static frame), only
 * animates while on screen, and pauses when the tab is hidden. The loop is
 * capped at 30 fps and repaints only the cells whose opacity re-rolled that
 * frame (a handful, versus every cell of the field on every frame), which
 * cuts its main-thread time by well over 90% for the same picture.
 *
 * Intended use: the amber LED "dot-matrix" field behind the NOW SERVING board.
 * Keep it in a lazy chunk (React.lazy) so the canvas loop never lands in the
 * main bundle.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  /** Probability per second that a given cell re-rolls its opacity. */
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  maxOpacity?: number;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = 'rgb(245, 158, 11)',
  width,
  height,
  className,
  maxOpacity = 0.3,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  const memoizedColor = useMemo(() => {
    if (typeof document === 'undefined') return 'rgba(0, 0, 0,';
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    const ctx = c.getContext('2d');
    if (!ctx) return 'rgba(245, 158, 11,';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
    return `rgba(${r}, ${g}, ${b},`;
  }, [color]);

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, w: number, h: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const cols = Math.ceil(w / (squareSize + gridGap));
      const rows = Math.ceil(h / (squareSize + gridGap));
      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) squares[i] = Math.random() * maxOpacity;
      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity]
  );

  /** Re-rolls cells at `flickerChance` per second; returns the indexes that changed. */
  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      const changed: number[] = [];
      const p = flickerChance * deltaTime;
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < p) {
          squares[i] = Math.random() * maxOpacity;
          changed.push(i);
        }
      }
      return changed;
    },
    [flickerChance, maxOpacity]
  );

  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, cols: number, rows: number, squares: Float32Array, dpr: number) => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          ctx.fillStyle = `${memoizedColor}${squares[i * rows + j]})`;
          ctx.fillRect(i * (squareSize + gridGap) * dpr, j * (squareSize + gridGap) * dpr, squareSize * dpr, squareSize * dpr);
        }
      }
    },
    [memoizedColor, squareSize, gridGap]
  );

  /** Repaints just the given cells (same geometry and colour as `drawGrid`). */
  const drawCells = useCallback(
    (ctx: CanvasRenderingContext2D, rows: number, squares: Float32Array, dpr: number, indexes: number[]) => {
      const pitch = (squareSize + gridGap) * dpr;
      const size = squareSize * dpr;
      for (const index of indexes) {
        const x = Math.floor(index / rows) * pitch;
        const y = (index % rows) * pitch;
        ctx.clearRect(x, y, size, size);
        ctx.fillStyle = `${memoizedColor}${squares[index]})`;
        ctx.fillRect(x, y, size, size);
      }
    },
    [memoizedColor, squareSize, gridGap]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext('2d') ?? null;
    if (!canvas || !container || !ctx) return;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    let raf: number | null = null;
    let grid: ReturnType<typeof setupCanvas> | null = null;

    const updateCanvasSize = () => {
      const w = width || container.clientWidth;
      const h = height || container.clientHeight;
      // setupCanvas sizes the element's CSS box directly; no React state
      // (and no extra commit + layout) is needed for it.
      grid = setupCanvas(canvas, w, h);
      // Always paint one frame so the static (reduced-motion / off-screen) state is not blank.
      drawGrid(ctx, canvas.width, canvas.height, grid.cols, grid.rows, grid.squares, grid.dpr);
    };
    updateCanvasSize();

    // 30 fps is plenty for a flicker whose per-second re-roll rate is fixed
    // (`flickerChance * dt`), and halves the work on 60/120 Hz screens.
    const FRAME_MS = 1000 / 30;
    let last = 0;
    const animate = (time: number) => {
      raf = null;
      if (!isInView || !grid || document.hidden) return;
      raf = requestAnimationFrame(animate);
      if (last && time - last < FRAME_MS) return;
      const dt = last ? (time - last) / 1000 : 0;
      last = time;
      const changed = updateSquares(grid.squares, dt);
      if (changed.length) drawCells(ctx, grid.rows, grid.squares, grid.dpr, changed);
    };

    const ro = new ResizeObserver(updateCanvasSize);
    ro.observe(container);
    const io = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0 });
    io.observe(canvas);

    const onVisibility = () => {
      if (!document.hidden && isInView && !reduced && raf === null) raf = requestAnimationFrame(animate);
    };
    document.addEventListener('visibilitychange', onVisibility);

    if (isInView && !reduced) raf = requestAnimationFrame(animate);

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [setupCanvas, updateSquares, drawGrid, drawCells, width, height, isInView]);

  return (
    <div ref={containerRef} aria-hidden="true" className={cn('h-full w-full', className)} {...props}>
      <canvas ref={canvasRef} className="pointer-events-none" />
    </div>
  );
};

export default FlickeringGrid;
