import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';

const INK_COLORS = [
  { id: 'black', label: 'Ink black', value: '#1A1207' },
  { id: 'coffee', label: 'Coffee brown', value: '#6B4226' },
  { id: 'blue', label: 'Soft blue', value: '#7BA3B8' },
  { id: 'gold', label: 'Gold', value: '#C9920A' },
];

const PEN_SIZES = { thin: 2, medium: 4, thick: 7 };

const HandwritingCanvas = forwardRef(function HandwritingCanvas(_, ref) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [penSize, setPenSize] = useState('medium');
  const [color, setColor] = useState(INK_COLORS[0].value);
  const [eraser, setEraser] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lastPoint = useRef(null);

  const getCtx = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const w = parent?.clientWidth || 400;
    const h = isFullscreen ? parent?.clientHeight : Math.max(200, Math.floor(w * 0.55));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = getCtx();
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [getCtx, isFullscreen]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas, isFullscreen]);

  useImperativeHandle(ref, () => ({
    toDataURL: () => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      // Create a temp canvas with white background so Gemini doesn't see transparency as blank
      const tmp = document.createElement('canvas');
      tmp.width = canvas.width;
      tmp.height = canvas.height;
      const ctx = tmp.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, tmp.width, tmp.height);
      ctx.drawImage(canvas, 0, 0);
      return tmp.toDataURL('image/png');
    },
    clear: () => {
      const canvas = canvasRef.current;
      const ctx = getCtx();
      if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
  }));

  const getPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches?.length) {
      const t = e.touches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const isPalmTouch = (touch) => {
    const rx = touch.radiusX ?? 0;
    const ry = touch.radiusY ?? 0;
    return rx > 30 || ry > 30;
  };

  const drawLine = (from, to) => {
    const ctx = getCtx();
    if (!ctx || !from || !to) return;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = eraser ? '#FAF8F0' : color;
    ctx.lineWidth = eraser ? PEN_SIZES.thick * 3 : PEN_SIZES[penSize];
    ctx.globalCompositeOperation = eraser ? 'destination-out' : 'source-over';
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  };

  const startDraw = (e) => {
    if (e.type === 'touchstart') {
      for (let i = 0; i < e.touches.length; i++) {
        if (isPalmTouch(e.touches[i])) return;
      }
      e.preventDefault();
    }
    setDrawing(true);
    lastPoint.current = getPoint(e);
  };

  const moveDraw = (e) => {
    if (!drawing) return;
    if (e.type === 'touchmove') {
      if (e.touches.length && isPalmTouch(e.touches[0])) return;
      e.preventDefault();
    }
    const pt = getPoint(e);
    drawLine(lastPoint.current, pt);
    lastPoint.current = pt;
  };

  const endDraw = () => {
    setDrawing(false);
    lastPoint.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
    // Give DOM a moment to update layout before resizing canvas
    setTimeout(resizeCanvas, 0);
  };

  return (
    <motion.div 
      className="handwriting-wrap" 
      style={isFullscreen ? { position: 'fixed', inset: 0, zIndex: 9999, background: 'var(--cream)', display: 'flex', flexDirection: 'column' } : { width: '100%' }}
    >
      <div className="canvas-toolbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {(['thin', 'medium', 'thick']).map((s) => (
            <button
              key={s}
              type="button"
              className={`toolbar-btn${penSize === s && !eraser ? ' active' : ''}`}
              onClick={() => { setPenSize(s); setEraser(false); }}
            >
              {s === 'thin' ? '·' : s === 'medium' ? '•' : '●'}
            </button>
          ))}
          <motion.div style={{ display: 'flex', gap: '6px', marginLeft: '8px' }}>
            {INK_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                title={c.label}
                onClick={() => { setColor(c.value); setEraser(false); }}
                style={{
                  width: 28, height: 28, borderRadius: '50%', background: c.value,
                  border: color === c.value && !eraser ? '3px solid var(--gold)' : '2px solid var(--border)',
                  cursor: 'pointer',
                }}
              />
            ))}
          </motion.div>
          <button type="button" className={`toolbar-btn${eraser ? ' active' : ''}`} style={{ marginLeft: '8px' }} onClick={() => setEraser(true)}>Eraser</button>
          <button type="button" className="toolbar-btn" onClick={clearCanvas}>Clear</button>
        </div>
        <button type="button" className="toolbar-btn" onClick={toggleFullscreen} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isFullscreen ? '↙️ Collapse' : '⛶ Full Screen'}
        </button>
      </div>
      <div style={isFullscreen ? { flex: 1, position: 'relative', width: '100%' } : { width: '100%' }}>
        <canvas
          ref={canvasRef}
          className="handwriting-canvas"
          onMouseDown={startDraw}
          onMouseMove={moveDraw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={moveDraw}
          onTouchEnd={endDraw}
          style={{ touchAction: 'none', cursor: 'crosshair', display: 'block' }}
        />
      </div>
    </motion.div>
  );
});

export default HandwritingCanvas;
