/**
 * FlickeringGrid — ported from Magic UI (https://magicui.design/docs/components/flickering-grid)
 * MIT License, Copyright (c) 2024 Dillion Verma. Canvas-only, zero deps.
 * Adapted: honours prefers-reduced-motion (draws one static frame), only
 * animates while on screen, and pauses when the tab is hidden.
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
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

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

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) squares[i] = Math.random() * maxOpacity;
      }
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
      setCanvasSize({ width: w, height: h });
      grid = setupCanvas(canvas, w, h);
      // Always paint one frame so the static (reduced-motion / off-screen) state is not blank.
      drawGrid(ctx, canvas.width, canvas.height, grid.cols, grid.rows, grid.squares, grid.dpr);
    };
    updateCanvasSize();

    let last = 0;
    const animate = (time: number) => {
      if (!isInView || !grid || document.hidden) return;
      const dt = last ? (time - last) / 1000 : 0;
      last = time;
      updateSquares(grid.squares, dt);
      drawGrid(ctx, canvas.width, canvas.height, grid.cols, grid.rows, grid.squares, grid.dpr);
      raf = requestAnimationFrame(animate);
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
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

  return (
    <div ref={containerRef} aria-hidden="true" className={cn('h-full w-full', className)} {...props}>
      <canvas ref={canvasRef} className="pointer-events-none" style={{ width: canvasSize.width, height: canvasSize.height }} />
    </div>
  );
};

export default FlickeringGrid;
