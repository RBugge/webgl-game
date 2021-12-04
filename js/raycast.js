class Ray
{
  origin = v3.create();
  direction = v3.create();
  tMin = 0.0;
  tMax = 0.0;
  constructor(point, dir, min, max) {
    this.origin = point;
    this.direction = dir;
    this.tMin = min;
    this.tMax = max;
  }
  pointOnRay(t) {
    return (this.origin + t*this.direction);
  }
};
