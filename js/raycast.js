
let vec3null = [0,0,0];

class Ray
{
  origin = vec3null;
  direction = vec3null;
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
  getRay() {
    let ray;
    ray.origin = camera.children[1].position;
    ray.direction = aimVector;
    ray.tMin = 0.0;
    ray.tMax = 10000;
    return ray;
  }

  checkIfWithinRange(center, range) {
    let ray = getRay();
    // center is pointZero
    pointOne = ray.origin;
    pointTwo = ray.origin + ray.direction;
    top = vec3.cross((center - pointOne), (center - pointTwo)).;
    // bottom is direction
    result = vec3.length(top)/vec3.length(ray.direction);
    if (result < range)
      return true;
    return false;
  }
};
