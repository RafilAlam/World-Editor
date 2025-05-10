function lerp(a, b, t) {
    return a + (b - a) * t;
}

function lerp2D(A, B, t) {
    return new Point(lerp(A.x, B.x, t), lerp(A.y, B.y, t));
}

function invLerp(a, b, v) {
    return (v - a) / (b - a);
}

function getNearestObject(location, points, segments, threshold = Number.MAX_SAFE_INTEGER) {
    let nearest = null;

    let minDistPoint = Number.MAX_SAFE_INTEGER;
    let nearestPoint = null;
    for (const point of points) {
        const distPoint = distance(point, location);
        if ( distPoint < minDistPoint && distPoint < threshold) {
            minDistPoint = distPoint;
            nearestPoint = point;
        }
    }

    let minDistSegment = Number.MAX_SAFE_INTEGER;
    let nearestSegment = null;
    for (const seg of segments) {
        const distSegment = seg.distanceToPoint(location);
        if ( distSegment < minDistSegment && distSegment < threshold) {
            minDistSegment = distSegment;
            nearestSegment = seg;
        }
    }

    minDistPoint > minDistSegment
    ? nearest = nearestPoint
    : nearest = nearestSegment;

    return nearest;
}

function getNearestPoint(location, points, threshold = Number.MAX_SAFE_INTEGER) {
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null;
    for (const point of points) {
        const dist = distance(point, location);
        if ( dist < minDist && dist < threshold) {
            minDist = dist;
            nearest = point;
        }
    }
    return nearest;
}

function getNearestSegment(location, segments, threshold = Number.MAX_SAFE_INTEGER) {
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null;
    for (const seg of segments) {
        const dist = seg.distanceToPoint(location);
        if ( dist < minDist && dist < threshold) {
            minDist = dist;
            nearest = seg;
        }
    }
    return nearest;
}

function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function average(p1, p2) {
    return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

function dot(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
}

function add(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
}

function subtract(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
}

function scale(p, scaler) {
    return new Point(p.x * scaler, p.y * scaler);
}

function normalise(p) {
    return scale(p, 1 / magnitude(p));
}

function magnitude(p) {
    return Math.hypot(p.x, p.y);
}

function perpendicular(p) {
    return new Point(-p.y, p.x)
}

function translate(location, angle, offset) {
    return new Point(
        location.x + Math.cos(angle) * offset,
        location.y + Math.sin(angle) * offset
    );
}

function angle(p) {
    return Math.atan2(p.y, p.x);
}

function degToRad(degree) {
    return degree * Math.PI / 180;
}

function getIntersection(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
 
    if (Math.round(bottom) != 0) {
       const t = tTop / bottom;
       const u = uTop / bottom;
       if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
          return {
             x: lerp(A.x, B.x, t),
             y: lerp(A.y, B.y, t),
             offset: t,
          };
       }
    }
 
    return null;
 }
 
function lerp(a, b, t) {
   return a + (b - a) * t;
}

function lerp2D(A, B, t) {
    return new Point(lerp(A.x, B.x, t), lerp(A.y, B.y, t));
 }
 
function getRandomColor({ hue, saturation, luminosity } = {}) {
   const Hue = hue 
    ? hue 
    : Math.random() * 360;

   const Saturation = saturation
    ? saturation
    : Math.random() * 100;
   const Luminosity = luminosity
    ? luminosity
    : Math.random() * 100;
    
   return "hsl(" + Hue + "," + Saturation + "%," + Luminosity + "%)";
}

function getFake3dPoint(point, viewPoint, height) {
    const dir = normalise(subtract(point, viewPoint));
    const dist = distance(point, viewPoint);
    const scaler = Math.atan(dist / 300) / (Math.PI / 2);
    return add(point, scale(dir, height * scaler));
}