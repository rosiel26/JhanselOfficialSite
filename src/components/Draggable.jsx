import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Draggable - A component that allows elements to be dragged within a bounded frame
 * Supports both mouse and touch interactions with real-time position updates
 * and boundary detection to keep the element fully visible at all times
 */
const Draggable = ({
  children,
  frameRef,
  initialPosition = { x: 0, y: 0 },
  boundary = 'contain', // 'contain' keeps element fully inside, 'clip' allows partial
  onDragStart,
  onDrag,
  onDragEnd,
  className = '',
  style = {},
  cursor = 'grab',
  activeCursor = 'grabbing',
  highlightOnDrag = true,
  snapOnRelease = true,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const elementRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Get element dimensions
  const getElementDimensions = useCallback(() => {
    if (!elementRef.current) return { width: 0, height: 0 };
    const { offsetWidth, offsetHeight } = elementRef.current;
    return { width: offsetWidth, height: offsetHeight };
  }, []);

  // Get frame dimensions and position
  const getFrameDimensions = useCallback(() => {
    if (!frameRef?.current) {
      // Default to viewport if no frame ref
      return {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    const frame = frameRef.current;
    const { left, top, width, height } = frame.getBoundingClientRect();
    return { left, top, width, height };
  }, [frameRef]);

  // Calculate constrained position within boundaries
  const constrainPosition = useCallback((x, y) => {
    const { width: elemWidth, height: elemHeight } = getElementDimensions();
    const { left: frameLeft, top: frameTop, width: frameWidth, height: frameHeight } = getFrameDimensions();

    let constrainedX = x;
    let constrainedY = y;

    if (boundary === 'contain') {
      // Ensure element stays fully within frame
      constrainedX = Math.max(frameLeft, Math.min(x, frameLeft + frameWidth - elemWidth));
      constrainedY = Math.max(frameTop, Math.min(y, frameTop + frameHeight - elemHeight));
    }

    return { x: constrainedX, y: constrainedY };
  }, [boundary, getElementDimensions, getFrameDimensions]);

  // Get pointer position from mouse or touch event
  const getPointerPosition = useCallback((event) => {
    if (event.touches && event.touches.length > 0) {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
    if (event.changedTouches && event.changedTouches.length > 0) {
      return { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
    }
    return { x: event.clientX, y: event.clientY };
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((event) => {
    event.preventDefault();
    
    const pointerPos = getPointerPosition(event);
    const { left: frameLeft, top: frameTop } = getFrameDimensions();
    const { width: elemWidth, height: elemHeight } = getElementDimensions();

    // Calculate offset from element's top-left corner to pointer
    const offsetX = pointerPos.x - (frameLeft + position.x);
    const offsetY = pointerPos.y - (frameTop + position.y);

    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);

    if (onDragStart) {
      onDragStart({ position, event });
    }
  }, [getPointerPosition, getFrameDimensions, getElementDimensions, position, onDragStart]);

  // Handle drag move
  const handleDragMove = useCallback((event) => {
    if (!isDragging) return;
    event.preventDefault();

    const pointerPos = getPointerPosition(event);
    const { left: frameLeft, top: frameTop } = getFrameDimensions();

    // Calculate new raw position
    let newX = pointerPos.x - frameLeft - dragOffset.x;
    let newY = pointerPos.y - frameTop - dragOffset.y;

    // Apply boundary constraints
    const constrained = constrainPosition(newX, newY);
    setPosition({ x: constrained.x, y: constrained.y });

    if (onDrag) {
      onDrag({ position: constrained, event });
    }
  }, [isDragging, getPointerPosition, getFrameDimensions, dragOffset, constrainPosition, onDrag]);

  // Handle drag end
  const handleDragEnd = useCallback((event) => {
    if (!isDragging) return;
    setIsDragging(false);

    if (onDragEnd) {
      onDragEnd({ position, event });
    }
  }, [isDragging, position, onDragEnd]);

  // Set up event listeners
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => handleDragMove(e);
    const handleMouseUp = (e) => handleDragEnd(e);
    const handleTouchMove = (e) => handleDragMove(e);
    const handleTouchEnd = (e) => handleDragEnd(e);

    // Use capture phase to ensure we catch events outside the element
    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Compute final styles
  const computedStyle = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    cursor: isDragging ? activeCursor : cursor,
    userSelect: 'none',
    touchAction: 'none',
    transform: 'translateZ(0)', // Force GPU acceleration
    backgroundColor: 'transparent',
    ...style,
  };

  return (
    <div
      ref={elementRef}
      className={`${className}`}
      style={computedStyle}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      {children}
    </div>
  );
};

/**
 * DraggableFrame - A container component that provides a bounded frame
 * for draggable elements to move within
 */
export const DraggableFrame = ({
  children,
  width = '100%',
  height = '100%',
  style = {},
  className = '',
  border = '2px solid #e0e0e0',
  backgroundColor = '#fafafa',
  showBoundary = true,
}) => {
  const frameRef = useRef(null);

  const frameStyle = {
    position: 'relative',
    width,
    height,
    overflow: 'hidden',
    border: showBoundary ? border : 'none',
    backgroundColor,
    borderRadius: '8px',
    ...style,
  };

  return (
    <div ref={frameRef} className={`draggable-frame ${className}`} style={frameStyle}>
      {typeof children === 'function' ? children(frameRef) : children}
    </div>
  );
};

export default Draggable;
