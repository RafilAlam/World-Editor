class Building {
    constructor(poly, height = 200) {
       this.base = poly;
       this.height = height;

       this.roofColour = getRandomColor({ luminosity:20, saturation:25});
    };

    static load(info) {
      return new Building(Polygon.load(info.base), info.height);
    }

 
    draw(ctx, viewPoint) {
       const topPoints = this.base.points.map((p) =>
          getFake3dPoint(p, viewPoint, this.height * 0.6)
       );
       const ceiling = new Polygon(topPoints);
 
       const sides = [];
       for (let i = 0; i < this.base.points.length; i++) {
          const nextI = (i + 1) % this.base.points.length;
          const poly = new Polygon([
             this.base.points[i], this.base.points[nextI],
             topPoints[nextI], topPoints[i]
          ]);
          sides.push(poly);
       }
       sides.sort(
          (a, b) =>
             b.distanceToPoint(viewPoint) -
             a.distanceToPoint(viewPoint)
       );
 
       const baseMidpoints = [
          average(this.base.points[0], this.base.points[1]),
          average(this.base.points[2], this.base.points[3])
       ];
 
       const topMidpoints = baseMidpoints.map((p) =>
          getFake3dPoint(p, viewPoint, this.height)
       );
 
       const roofPolys = [
          new Polygon([
             ceiling.points[0], ceiling.points[3],
             topMidpoints[1], topMidpoints[0]
          ]),
          new Polygon([
             ceiling.points[2], ceiling.points[1],
             topMidpoints[0], topMidpoints[1]
          ])
       ];
       roofPolys.sort(
          (a, b) =>
             b.distanceToPoint(viewPoint) -
             a.distanceToPoint(viewPoint)
       );
 
       this.base.draw(ctx, { fill: "hsla(48, 33%, 64%, 1)", stroke: "rgba(0,0,0,0.2)", lineWidth: 20 });
       for (const side of sides) {
          side.draw(ctx, { fill: "hsla(48, 33%, 64%, 1)", stroke: "#AAA" });
       }
       ceiling.draw(ctx, { fill: "hsla(48, 33%, 64%, 1)", stroke: "hsla(48, 33%, 64%, 1)", lineWidth: 6 });
       for (const poly of roofPolys) {
          poly.draw(ctx, { fill: this.roofColour, stroke: this.roofColour, lineWidth: 8, join: "round" });
       }
    }
 }