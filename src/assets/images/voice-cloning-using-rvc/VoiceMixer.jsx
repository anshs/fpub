import React, { useEffect, useRef, useState } from 'react';
import '@assets/images/voice-cloning-using-rvc/VoiceMixed.css';

const VoiceMixer = () => {
  const svgRef = useRef(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const gainNodesRef = useRef([]);
  const sourcesRef = useRef([]);
  

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // --- Setup: Triangle Dimensions & Vertices ---
    const svgWidth = 300; // internal coordinate width
    const s = svgWidth;
    const svgHeight = s * Math.sqrt(3) / 2; // height for an equilateral triangle
    // Define vertices: A (top), B (bottom-left), C (bottom-right)
    const A = { x: svgWidth / 2, y: 0 };
    const B = { x: 0, y: svgHeight };
    const C = { x: svgWidth, y: svgHeight };

    // Helper: Compute triangle area
    const triangleArea = (p1, p2, p3) =>
      Math.abs(
        p1.x * (p2.y - p3.y) +
          p2.x * (p3.y - p1.y) +
          p3.x * (p1.y - p2.y)
      ) / 2;
    const totalArea = triangleArea(A, B, C);

    // --- Initial Joystick Position (Centroid) ---
    let P = {
      x: (A.x + B.x + C.x) / 3,
      y: (A.y + B.y + C.y) / 3,
    };

    // --- Update Functions ---
    const updateClips = () => {
      svg.querySelector('#poly1').setAttribute(
        'points',
        `${P.x},${P.y} ${B.x},${B.y} ${C.x},${C.y}`
      );
      svg.querySelector('#poly2').setAttribute(
        'points',
        `${P.x},${P.y} ${C.x},${C.y} ${A.x},${A.y}`
      );
      svg.querySelector('#poly3').setAttribute(
        'points',
        `${P.x},${P.y} ${A.x},${A.y} ${B.x},${B.y}`
      );
    };

    const updateLines = () => {
      // Line from A to P
      const lineA = svg.querySelector('#lineA');
      lineA.setAttribute('x1', A.x);
      lineA.setAttribute('y1', A.y);
      lineA.setAttribute('x2', P.x);
      lineA.setAttribute('y2', P.y);
      // Line from B to P
      const lineB = svg.querySelector('#lineB');
      lineB.setAttribute('x1', B.x);
      lineB.setAttribute('y1', B.y);
      lineB.setAttribute('x2', P.x);
      lineB.setAttribute('y2', P.y);
      // Line from C to P
      const lineC = svg.querySelector('#lineC');
      lineC.setAttribute('x1', C.x);
      lineC.setAttribute('y1', C.y);
      lineC.setAttribute('x2', P.x);
      lineC.setAttribute('y2', P.y);
    };

    const updateJoystick = () => {
      const joystick = svg.querySelector('#joystick');
      joystick.setAttribute('cx', P.x);
      joystick.setAttribute('cy', P.y);
    };

    const updateVolumes = () => {
      const v1 = triangleArea(P, B, C) / totalArea;
      const v2 = triangleArea(P, C, A) / totalArea;
      const v3 = triangleArea(P, A, B) / totalArea;
      if (gainNodesRef.current.length === 3) {
        gainNodesRef.current[0].gain.value = v1;
        gainNodesRef.current[1].gain.value = v2;
        gainNodesRef.current[2].gain.value = v3;
      }
    };

    // Set the full triangle border with dark grey stroke:
    const triangleBorder = svg.querySelector('#triangleBorder');
    const pointsStr = `${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`;
    triangleBorder.setAttribute('points', pointsStr);

    // Initial update calls:
    updateClips();
    updateLines();
    updateJoystick();
    updateVolumes();

    // --- Dragging Setup ---
    let dragging = false;
    const joystick = svg.querySelector('#joystick');

    // Check if point is inside triangle ABC:
    const isPointInTriangle = (pt, A, B, C) => {
      const areaABC = triangleArea(A, B, C);
      const areaPBC = triangleArea(pt, B, C);
      const areaPCA = triangleArea(pt, C, A);
      const areaPAB = triangleArea(pt, A, B);
      return Math.abs(areaPBC + areaPCA + areaPAB - areaABC) < 0.5;
    };

    // Constrain candidate point to lie within triangle:
    const constrainPoint = (candidate, A, B, C, start) => {
      if (isPointInTriangle(candidate, A, B, C)) return candidate;
      const edges = [
        { p1: A, p2: B },
        { p1: B, p2: C },
        { p1: C, p2: A },
      ];
      let intersections = [];
      edges.forEach((edge) => {
        const intersect = getLineIntersection(start, candidate, edge.p1, edge.p2);
        if (intersect && intersect.t >= 0 && intersect.t <= 1) {
          intersections.push(intersect.point);
        }
      });
      if (intersections.length > 0) {
        intersections.sort((p1, p2) => {
          const d1 = Math.hypot(p1.x - start.x, p1.y - start.y);
          const d2 = Math.hypot(p2.x - start.x, p2.y - start.y);
          return d1 - d2;
        });
        return intersections[0];
      }
      return start;
    };

    // Helper: Get line intersection between two segments.
    const getLineIntersection = (p, r, p2, q) => {
      const dx1 = r.x - p.x;
      const dy1 = r.y - p.y;
      const dx2 = q.x - p2.x;
      const dy2 = q.y - p2.y;
      const denominator = dx1 * dy2 - dy1 * dx2;
      if (denominator === 0) return null; // parallel
      const t = ((p2.x - p.x) * dy2 - (p2.y - p.y) * dx2) / denominator;
      const u = ((p2.x - p.x) * dy1 - (p2.y - p.y) * dx1) / denominator;
      if (u < 0 || u > 1) return null;
      return { point: { x: p.x + t * dx1, y: p.y + t * dy1 }, t };
    };

    // Convert pointer event to SVG coordinate space:
    const getSVGPoint = (evt) => {
      const pt = svg.createSVGPoint();
      pt.x = evt.clientX;
      pt.y = evt.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    };

    // --- Event Listeners for Dragging ---
    joystick.addEventListener('pointerdown', (e) => {
      dragging = true;
      // Stop the pulse animation while dragging
      joystick.classList.remove('pulse');
      joystick.setPointerCapture(e.pointerId);
    });

    svg.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const svgPt = getSVGPoint(e);
      const candidate = { x: svgPt.x, y: svgPt.y };
      P = constrainPoint(candidate, A, B, C, P);
      updateJoystick();
      updateClips();
      updateLines();
      updateVolumes();
    });

    svg.addEventListener('pointerup', () => {
      dragging = false;
      // Restart pulse animation when not dragging
      joystick.classList.add('pulse');
    });
    svg.addEventListener('pointerleave', () => {
      dragging = false;
      joystick.classList.add('pulse');
    });

    // Add the pulse animation initially:
    joystick.classList.add('pulse');

    // --- Cleanup on Unmount ---
    return () => {
      joystick.removeEventListener('pointerdown', () => {});
      svg.removeEventListener('pointermove', () => {});
      svg.removeEventListener('pointerup', () => {});
      svg.removeEventListener('pointerleave', () => {});
    };
  }, []);

  // Extra effect: Update sound-wave polygons' points when rendered.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const triangleBorder = svg.querySelector('#triangleBorder');
    if (triangleBorder) {
      const points = triangleBorder.getAttribute('points');
      const sw1 = svg.querySelector('#soundWave1');
      const sw2 = svg.querySelector('#soundWave2');
      const sw3 = svg.querySelector('#soundWave3');
      if (sw1) sw1.setAttribute('points', points);
      if (sw2) sw2.setAttribute('points', points);
      if (sw3) sw3.setAttribute('points', points);
    }
  }, [audioPlaying]);

  // Audio toggle function using suspend/resume:
  const toggleAudio = async () => {
    if (!audioCtxRef.current) {
      // Initialize AudioContext and start audio:
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      try {
        const buffers = await Promise.all([
          loadAudioBuffer(
            '/assets/post-assets/voice-cloning-using-rvc/besharam_original.mp3'
          ),
          loadAudioBuffer(
            '/assets/post-assets/voice-cloning-using-rvc/besharam_kishore.mp3'
          ),
          loadAudioBuffer(
            '/assets/post-assets/voice-cloning-using-rvc/besharam_arijit.mp3'
          ),
        ]);
        buffers.forEach((buffer) => {
          const source = audioCtxRef.current.createBufferSource();
          source.buffer = buffer;
          source.loop = true;
          const gainNode = audioCtxRef.current.createGain();
          gainNode.gain.value = 1 / 3; // initial gain at centroid
          source.connect(gainNode).connect(audioCtxRef.current.destination);
          gainNodesRef.current.push(gainNode);
          sourcesRef.current.push(source);
        });
        const now = audioCtxRef.current.currentTime;
        sourcesRef.current.forEach((source) => source.start(now));
        setAudioPlaying(true);
      } catch (err) {
        console.error('Error loading audio buffers:', err);
      }
    } else {
      // Toggle between suspend and resume:
      if (audioCtxRef.current.state === 'running') {
        await audioCtxRef.current.suspend();
        setAudioPlaying(false);
      } else {
        await audioCtxRef.current.resume();
        setAudioPlaying(true);
      }
    }
  };

  // Helper function to load an audio buffer.
  const loadAudioBuffer = async (url) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioCtxRef.current.decodeAudioData(arrayBuffer);
  };

  return (
    <div className="mixer-container">
      <button id="startButton" onClick={toggleAudio}>
        {audioPlaying ? 'Stop' : 'Play'}
      </button>
      <svg
        id="triangleSVG"
        ref={svgRef}
        viewBox="0 0 300 300"
        className="responsive-svg"
        style={{ touchAction: 'none' }}
      >
        <defs>
          <clipPath id="clip1">
            <polygon id="poly1" points="" />
          </clipPath>
          <clipPath id="clip2">
            <polygon id="poly2" points="" />
          </clipPath>
          <clipPath id="clip3">
            <polygon id="poly3" points="" />
          </clipPath>
        </defs>

        {/* Artist Backgrounds */}
        <image
          href="/assets/post-assets/voice-cloning-using-rvc/shilpa.jpg"
          clipPath="url(#clip1)"
          x="0"
          y="0"
          width="300"
          height="300"
          preserveAspectRatio="none"
        />
        <image
          href="/assets/post-assets/voice-cloning-using-rvc/kishore.jpg"
          clipPath="url(#clip2)"
          x="0"
          y="0"
          width="300"
          height="300"
          preserveAspectRatio="none"
        />
        <image
          href="/assets/post-assets/voice-cloning-using-rvc/arijit.jpg"
          clipPath="url(#clip3)"
          x="0"
          y="0"
          width="300"
          height="300"
          preserveAspectRatio="none"
        />

        {/* Triangle Border with dark grey stroke */}
        <polygon
          id="triangleBorder"
          points=""
          fill="none"
          stroke="#444"
          strokeWidth="2"
        />

        {/* If audio is playing, render sound wave polygons */}
        {audioPlaying && (
          <>
            <polygon id="soundWave1" className="sound-wave" />
            <polygon id="soundWave2" className="sound-wave" style={{ animationDelay: '0.5s' }} />
            <polygon id="soundWave3" className="sound-wave" style={{ animationDelay: '1s' }} />
          </>
        )}

        {/* Solid light-grey Lines from Vertices to Joystick */}
        <line id="lineA" stroke="#ccc" strokeWidth="1" />
        <line id="lineB" stroke="#ccc" strokeWidth="1" />
        <line id="lineC" stroke="#ccc" strokeWidth="1" />

        {/* Draggable Joystick */}
        <circle
          id="joystick"
          r="10"
          fill="#fff"
          stroke="#000"
          strokeWidth="2"
          style={{ cursor: 'pointer' }}
        />
      </svg>
    </div>
  );
};

export default VoiceMixer;
