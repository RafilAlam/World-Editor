class Graph {
    constructor(points = [], segments = []) {
        this.points = points;
        this.segments = segments;
    }

    static load(info) {
        const points = info.points.map((i) => new Point(i.x, i.y));
        const segments = info.segments.map((i) => new Segment(
            points.find((p) => p.equals(i.p1)),
            points.find((p) => p.equals(i.p2)),
            i.oneWay
        ));
        return new Graph(points, segments);
    }

    hash() {
        return JSON.stringify(this);
    }

    addPoint(point) {
        this.points.push(point);
    }

    containsPoint(point) {
        return this.points.find((p) => p.equals(point));
    }
    
    tryAddPoint(point) {
        if (!this.containsPoint(point)) {
            this.addPoint(point);
            return true;
        }
        return false;

    }

    removePoint(point, removeSegments = true) {
        if (removeSegments) {
            const segs = this.getSegmentsWithPoint(point);
            for (const seg of segs) {
                this.removeSegment(seg);
            }
        }
        
        this.points.splice(this.points.indexOf(point), 1);
    }

    removeSegment(segment, removePoints = false) {
        if (removePoints) {
            if(this.points.indexOf(segment.p1) != -1 && this.getSegmentsWithPoint(segment.p1).length <= 1) {this.removePoint(segment.p1, false);};
            if(this.points.indexOf(segment.p2) != -1 && this.getSegmentsWithPoint(segment.p2).length <= 1) {this.removePoint(segment.p2, false);};
        };
        this.segments.splice(this.segments.indexOf(segment), 1);
    }

    addSegment(seg) {
        this.segments.push(seg);
    }

    containsSegment(seg) {
        return this.segments.find((s) => s.equals(seg));
    }

    tryAddSegment(seg) {
        if (!this.containsSegment(seg) && !seg.p1.equals(seg.p2)) {
            this.addSegment(seg);
            return true;
        }
        return false;
    }

    getSegmentsWithPoint(point) {
        const segs = [];
        for (const seg of this.segments) {
            if (seg.includes(point)) {
                segs.push(seg);
            }
        }
        return segs;
    }

    getSegmentsLeavingFromPoint(point) {
        const segs = [];
        for (const seg of this.segments) {
            if (seg.oneWay) {
                if (seg.p1.equals(point)) {
                    segs.push(seg);
                }
            } else {
                if (seg.includes(point)) {
                    segs.push(seg);
                }
            }
            if (seg.includes(point)) {
                segs.push(seg);
            }
        }
        return segs;
    }

    getShortestPath(start, end) {

        for (const point of this.points) {
            point.dist = Number.MAX_SAFE_INTEGER;
            point.visited = false;
        }

        let currentPoint = start;
        currentPoint.dist = 0;

        while (!end.visited) {
            const segs = this.getSegmentsWithPoint(currentPoint);
            for (const seg of segs) {
                const otherPoint = seg.p1.equals(currentPoint) ? seg.p2 : seg.p1;
                if (currentPoint.dist + seg.length() < otherPoint.dist) {
                    otherPoint.dist = currentPoint.dist + seg.length();
                    otherPoint.prev = currentPoint;
                };
            }
            currentPoint.visited = true;

            const unvisited = this.points.filter((p) => p.visited == false);
            const dists = unvisited.map((p) => p.dist);
            currentPoint = unvisited.find((p) => p.dist == Math.min(...dists));
        };

        const path = [];
        currentPoint = end;
        while (currentPoint) {
            path.unshift(currentPoint);
            currentPoint = currentPoint.prev;
        }

        for (const point of this.points) {
            delete point.dist;
            delete point.visited;
            delete point.prev;
        }

        return path;
    }

    dispose() {
        this.points.length = 0;
        this.segments.length = 0;
    }

    draw(ctx) {
        for (const seg of this.segments) {
            seg.draw(ctx, { width: 4 * viewport.zoom });
        }

        for (const point of this.points) {
            point.draw(ctx, { size: 18 * viewport.zoom });
        }
    }
}