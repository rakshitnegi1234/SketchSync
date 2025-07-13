import { useEffect, useState, useLayoutEffect } from "react";
import rough from "roughjs";

const roughGenerator = rough.generator();

const WhiteBoard = ({
  canvasRef,
  ctxRef,
  element,
  setElement,
  tool,
  color,
  socket,
  user,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [img, setImg] = useState(null);

  useEffect(() => {
    socket.on("whiteBoardDataResponse", (data) => {
      setImg(data.imgURL);
    });
  }, [socket]);

  if (user?.presenter === false) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100 w-100 bg-light border border-3 border-dark rounded shadow-sm">
        {img ? (
          <img
            src={img}
            alt="Live Whiteboard"
            className="img-fluid rounded"
            style={{ maxHeight: "100%", maxWidth: "100%" }}
          />
        ) : (
          <div className="text-center text-muted">
            <div className="spinner-border mb-2" role="status" />
            <p className="m-0 small">Waiting for presenter...</p>
          </div>
        )}
      </div>
    );
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;

    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;

    // Normalize coordinate system
    ctx.scale(scale, scale);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctxRef.current = ctx;
  }, []);

  // Update stroke color dynamically
  useEffect(() => {
    if (ctxRef.current) ctxRef.current.strokeStyle = color;
  }, [color]);

  // Draw all elements and emit image
  useLayoutEffect(() => {
    if (!canvasRef.current) return;

    const ctx = ctxRef.current;
    const roughCanvas = rough.canvas(canvasRef.current);

    if (element.length > 0) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    element.forEach((el) => {
      if (el.type === "pencil") {
        roughCanvas.linearPath(el.path, {
          stroke: el.stroke,
          strokeWidth: 5,
          roughness: 0,
        });
      } else if (el.type === "line") {
        const shape = roughGenerator.line(
          el.offsetX,
          el.offsetY,
          el.endX,
          el.endY,
          { stroke: el.stroke, strokeWidth: 5, roughness: 0 }
        );
        roughCanvas.draw(shape);
      } else if (el.type === "rect") {
        const shape = roughGenerator.rectangle(
          el.offsetX,
          el.offsetY,
          el.endX,
          el.endY,
          { stroke: el.stroke, strokeWidth: 5, roughness: 0 }
        );
        roughCanvas.draw(shape);
      }
    });

    const canvasImage = canvasRef.current.toDataURL();
    socket.emit("whiteBoardData", canvasImage);
  }, [element]);

  // Mouse event handlers
  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    const newElement = {
      type: tool,
      offsetX,
      offsetY,
      endX: offsetX,
      endY: offsetY,
      path: [[offsetX, offsetY]],
      stroke: color,
    };
    setElement((prev) => [...prev, newElement]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;

    const lastElement = element[element.length - 1];
    setElement((prev) =>
      prev.map((ele, idx) => {
        if (idx !== prev.length - 1) return ele;

        if (tool === "pencil") {
          return {
            ...ele,
            path: [...lastElement.path, [offsetX, offsetY]],
          };
        }

        return {
          ...ele,
          endX: tool === "rect" ? offsetX - ele.offsetX : offsetX,
          endY: tool === "rect" ? offsetY - ele.offsetY : offsetY,
        };
      })
    );
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div
      className="position-relative w-100 h-100 bg-white border border-3 border-dark rounded overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <canvas
        ref={canvasRef}
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ cursor: "crosshair" }}
      />
    </div>
  );
};

export default WhiteBoard;
