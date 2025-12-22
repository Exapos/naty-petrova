'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ResizableImageProps {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  objectFit?: string;
  filter?: string;
  rotate?: string;
  opacity?: number;
  onResize?: (width: string, height: string) => void;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ResizableImage({ 
  src, 
  alt, 
  width = '100%', 
  height = 'auto', 
  objectFit = 'cover',
  filter = 'none',
  rotate = '0deg',
  opacity = 1,
  onResize,
  isSelected = false,
  onClick
}: ResizableImageProps) {
  const [resizeData, setResizeData] = useState({ width, height });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent, corner: string) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = parseInt(resizeData.width) || 300;
    const startHeight = parseInt(resizeData.height) || 200;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      switch (corner) {
        case 'se': // Southeast
          newWidth = startWidth + deltaX;
          newHeight = startHeight + deltaY;
          break;
        case 'sw': // Southwest
          newWidth = startWidth - deltaX;
          newHeight = startHeight + deltaY;
          break;
        case 'ne': // Northeast
          newWidth = startWidth + deltaX;
          newHeight = startHeight - deltaY;
          break;
        case 'nw': // Northwest
          newWidth = startWidth - deltaX;
          newHeight = startHeight - deltaY;
          break;
      }

      // Minimum size constraints
      newWidth = Math.max(50, newWidth);
      newHeight = Math.max(50, newHeight);

      const newResizeData = {
        width: `${newWidth}px`,
        height: `${newHeight}px`
      };

      setResizeData(newResizeData);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      if (onResize) {
        onResize(resizeData.width, resizeData.height);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [resizeData, onResize]);

  const resizeHandles = [
    { corner: 'nw', position: 'top-0 left-0', cursor: 'nw-resize' },
    { corner: 'ne', position: 'top-0 right-0', cursor: 'ne-resize' },
    { corner: 'sw', position: 'bottom-0 left-0', cursor: 'sw-resize' },
    { corner: 'se', position: 'bottom-0 right-0', cursor: 'se-resize' },
  ];

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onClick}
    >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className="block"
          style={{
            width: resizeData.width,
            height: resizeData.height,
            objectFit: objectFit as any,
            filter: filter,
            transform: `rotate(${rotate})`,
            opacity: opacity,
          }}
          draggable={false}
        />

      {isSelected && (
        <>
      {/* Resize handles */}
      {resizeHandles.map(({ corner, position, cursor }) => (
        <div
          key={corner}
          className={`absolute w-3 h-3 bg-blue-500 border border-white rounded-full ${position} cursor-${cursor} hover:bg-blue-600 transition-colors`}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleMouseDown(e, corner);
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          style={{ zIndex: 10 }}
        />
      ))}

          {/* Aspect ratio lock button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
            title="Zamknout poměr stran"
          >
            🔒
          </motion.button>

          {/* Size indicator */}
          <div className="absolute -bottom-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded">
            {resizeData.width} × {resizeData.height}
          </div>
        </>
      )}
    </div>
  );
}
