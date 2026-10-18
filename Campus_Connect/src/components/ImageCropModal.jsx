import React, { useState, useRef, useEffect } from 'react';
import * as Icons from './Icons';

/**
 * ImageCropModal
 * Universal interactive image cropper for Feed posts and Profile pictures.
 * Allows aspect ratio selection (1:1 Square, 4:5 Portrait, 16:9 Landscape, Original)
 * and zoom/pan positioning without unnecessary filters.
 */
export default function ImageCropModal({
  isOpen,
  imageSrc,
  mode = 'post', // 'post' or 'profile'
  onCropComplete,
  onClose
}) {
  const [aspectRatio, setAspectRatio] = useState(mode === 'profile' ? '1:1' : '1:1');
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const imageRef = useRef(null);
  const previewBoxRef = useRef(null);

  // Reset transforms whenever a new image is loaded
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPanX(0);
      setPanY(0);
      setAspectRatio(mode === 'profile' ? '1:1' : '1:1');
    }
  }, [isOpen, imageSrc, mode]);

  if (!isOpen || !imageSrc) return null;

  // Aspect ratio dimensions in preview
  const getCropBoxStyle = () => {
    if (mode === 'profile') {
      return { width: '280px', height: '280px', borderRadius: '50%' };
    }
    switch (aspectRatio) {
      case '1:1':
        return { width: '300px', height: '300px', borderRadius: '8px' };
      case '4:5':
        return { width: '260px', height: '325px', borderRadius: '8px' };
      case '16:9':
        return { width: '360px', height: '202px', borderRadius: '8px' };
      case 'original':
      default:
        return { width: '340px', height: '280px', borderRadius: '8px' };
    }
  };

  // Mouse / Touch Drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - panX, y: e.touches[0].clientY - panY });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPanX(e.touches[0].clientX - dragStart.x);
    setPanY(e.touches[0].clientY - dragStart.y);
  };

  // Apply crop using HTML5 Canvas
  const handleApply = () => {
    const img = imageRef.current;
    if (!img) return;

    if (aspectRatio === 'original' && mode !== 'profile') {
      // For original, downscale maintaining natural aspect ratio
      const canvas = document.createElement('canvas');
      const maxDim = 1200;
      let width = img.naturalWidth;
      let height = img.naturalHeight;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      onCropComplete(canvas.toDataURL('image/jpeg', 0.88));
      onClose();
      return;
    }

    // Determine target dimensions
    let targetW = 800;
    let targetH = 800;
    if (aspectRatio === '4:5') {
      targetW = 800;
      targetH = 1000;
    } else if (aspectRatio === '16:9') {
      targetW = 1000;
      targetH = 562;
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');

    // Fill background with black for smooth borders
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, targetW, targetH);

    // Compute bounding preview measurements
    const boxStyle = getCropBoxStyle();
    const boxW = parseFloat(boxStyle.width);
    const boxH = parseFloat(boxStyle.height);

    // Scale factor from preview box to high-res canvas
    const scaleFactor = targetW / boxW;

    // Render scaled and panned image to canvas
    ctx.save();
    // Move to center of canvas
    ctx.translate(targetW / 2 + panX * scaleFactor, targetH / 2 + panY * scaleFactor);
    ctx.scale(zoom, zoom);

    // Calculate dimensions to cover/contain within preview box
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const boxAspect = boxW / boxH;
    let drawW, drawH;

    if (imgAspect > boxAspect) {
      drawH = targetH;
      drawW = targetH * imgAspect;
    } else {
      drawW = targetW;
      drawH = targetW / imgAspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    const croppedResult = canvas.toDataURL('image/jpeg', 0.88);
    onCropComplete(croppedResult);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '480px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-heading)', margin: 0 }}>
              {mode === 'profile' ? 'Adjust Profile Picture' : 'Crop & Frame Photo'}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Drag to position • Zoom to fit
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <Icons.Close size={20} />
          </button>
        </div>

        {/* Viewport / Crop area */}
        <div
          style={{
            padding: '24px 16px',
            backgroundColor: '#0a0f1d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '340px',
            userSelect: 'none',
            overflow: 'hidden',
            position: 'relative'
          }}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* Crop Container Box */}
          <div
            ref={previewBoxRef}
            style={{
              ...getCropBoxStyle(),
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
              border: '2px solid rgba(255, 255, 255, 0.85)',
              cursor: isDragging ? 'grabbing' : 'grab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop target"
              draggable={false}
              style={{
                width: aspectRatio === 'original' && mode !== 'profile' ? '100%' : '100%',
                height: aspectRatio === 'original' && mode !== 'profile' ? '100%' : '100%',
                objectFit: aspectRatio === 'original' && mode !== 'profile' ? 'contain' : 'cover',
                transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.05s ease-out',
                pointerEvents: 'none'
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Aspect Ratio Buttons (for Posts) */}
          {mode === 'post' && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', minWidth: '45px' }}>
                Ratio:
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
                {[
                  { id: '1:1', label: 'Square (1:1)' },
                  { id: '4:5', label: 'Portrait (4:5)' },
                  { id: '16:9', label: 'Landscape' },
                  { id: 'original', label: 'Original' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setAspectRatio(item.id);
                      setPanX(0);
                      setPanY(0);
                      setZoom(1);
                    }}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      border: '1px solid',
                      borderColor: aspectRatio === item.id ? 'var(--primary)' : 'var(--border)',
                      backgroundColor: aspectRatio === item.id ? 'var(--primary)' : 'var(--bg-app)',
                      color: aspectRatio === item.id ? '#fff' : 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Zoom Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', minWidth: '45px' }}>
              Zoom:
            </span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-heading)', fontWeight: '600', width: '34px', textAlign: 'right' }}>
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Reset position button */}
          {(panX !== 0 || panY !== 0 || zoom !== 1) && (
            <div style={{ textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setPanX(0);
                  setPanY(0);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '11.5px',
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Reset Position & Zoom
              </button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--bg-app)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-main)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            style={{
              padding: '8px 22px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--primary)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            Apply & Use Photo
          </button>
        </div>
      </div>
    </div>
  );
}
