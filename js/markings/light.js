class Light extends Marking {
   constructor(center, directionVector, width, height) {
      super(center, directionVector, width, 18);

      this.state = "off";
      this.border = this.poly.segments[0];
      this.type = "light";
   }

   draw(ctx) {
      const perp = perpendicular(this.directionVector);
      const line = new Segment(
         add(this.center, scale(perp, this.width / 2)),
         add(this.center, scale(perp, -this.width / 2))
      );

      const green = lerp2D(line.p1, line.p2, 0.2);
      const yellow = lerp2D(line.p1, line.p2, 0.5);
      const red = lerp2D(line.p1, line.p2, 0.8);

      new Segment(red, green).draw(ctx, {
         width: this.height,
         cap: "round"
      });

      green.draw(ctx, { size: this.height * 0.6, colour: "#060" });
      yellow.draw(ctx, { size: this.height * 0.6, colour: "#660" });
      red.draw(ctx, { size: this.height * 0.6, colour: "#600" });

      switch (this.state) {
         case "green":
            green.draw(ctx, { size: this.height * 0.6, colour: "#0F0" });
            break;
         case "yellow":
            yellow.draw(ctx, { size: this.height * 0.6, colour: "#FF0" });
            break;
         case "red":
            red.draw(ctx, { size: this.height * 0.6, colour: "#F00" });
            break;
      }
   }
}