
function getRay() {
  let ray = new Ray();
  ray.origin = camera.children[1].position;
  ray.direction = aimVector;
  ray.tMin = 0.0;
  ray.tMax = 10000;
  return ray;
}

function checkIfWithinRange(center, range) {
  let ray = getRay();
  // center is pointZero
  pointOne = ray.origin;
  pointTwo = v3.add(ray.origin, ray.direction);
  pointTop = v3.cross(v3.add(center, v3.negate(pointOne)), v3.add(center, v3.negate(pointTwo)));
  // bottom is direction
  result = v3.length(pointTop)/v3.length(ray.direction);
  /*
  console.log("first entry");
  console.log(v3.add(center, v3.negate(pointOne)));
  console.log("Second entry");
  console.log(v3.add(center, v3.negate(pointTwo)));
  console.log("top");
  console.log(pointTop); */
  if (result < range)
    return true;
  return false;
}
