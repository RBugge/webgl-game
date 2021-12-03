class playerScript {
  speed = 10; // current speed
  speed_const = 10; // initial speed
  sprint_multiplier = 2;

  crouch_speed = 5; // crouch down/up speed
  JUMP_VELOCITY = 10; // initial velocity for jump
  g = 2 * -9.81; // gravity

  jumping = false; // is currently jumping
  velocity_y = 0; // current velocity

  constructor(oThis) {
    this.oThis = oThis;
  }

  start = () => { };

  update = () => {
    // Check ahead one frame. Am I falling and about to go under 1?
    if (this.oThis.position[1] >= 1 && this.jumping && this.velocity_y < 0) {
      // expected delta x
      let dx = this.velocity_y * dt + 0.5 * this.g * dt * dt;
      // if that will put me under 1, put me at 1.
      if (this.oThis.position[1] + dx <= 1) {
        let x = this.oThis.position[0];
        let z = this.oThis.position[2];
        this.oThis.setPosition([x, 1, z]);
        this.velocity_y = 0;
        this.jumping = false;
      }
    }

    // console.log(this.jumping, this.velocity_y < 0);
    // console.log(this.oThis.position[1]);
    // console.log(this.oThis.children[0].position[1]);

    // Player movement
    if (Input.isKeyPressed("w"))
      this.oThis.translate(
        v3.multiply(forward, [this.speed * dt, 0, this.speed * dt]),
        true
      );
    if (Input.isKeyPressed("s"))
      this.oThis.translate(
        v3.multiply(forward, [-this.speed * dt, 0, -this.speed * dt]),
        true
      );
    if (Input.isKeyPressed("a"))
      this.oThis.translate(
        v3.multiply(right, [-this.speed * dt, 0, -this.speed * dt]),
        true
      );
    if (Input.isKeyPressed("d"))
      this.oThis.translate(
        v3.multiply(right, [this.speed * dt, 0, this.speed * dt]),
        true
      );

    if (Input.isKeyPressed("space") && !this.jumping) {
      this.jumping = true;
      this.velocity_y = this.JUMP_VELOCITY;
    }

    if (this.jumping) {
      let dx = this.velocity_y * dt + 0.5 * this.g * dt * dt;
      this.velocity_y = this.velocity_y + this.g * dt;
      this.oThis.translate([0, dx, 0], true);
    }

    if (Input.isKeyPressed("shift") && !this.jumping) {
      this.speed = this.speed_const * this.sprint_multiplier;
      //   console.log("sprint");

    }
    else if (Input.isKeyPressed("shift") && this.jumping) {
      if (this.speed == (this.speed_const * this.sprint_multiplier))
        this.speed = this.speed_const * this.sprint_multiplier;
      else
        this.speed = this.speed_const;
      //   console.log("sprint");

    }
    else if (!Input.shift && this.speed != this.speed_const) {
      this.speed = this.speed_const;
    }

    if (!this.jumping) {
      if (Input.isKeyPressed("c") && this.oThis.position[1] >= 0.2 && !Input.isKeyPressed("shift")) {
        let dx = this.crouch_speed * dt;
        this.oThis.translate([0, -dx, 0], true);
        if (this.oThis.position[1] < 0.2) {
          let x = this.oThis.position[0];
          let z = this.oThis.position[2];
          this.oThis.setPosition([x, 0.2, z]);
        }
      }
      if (!Input.isKeyPressed("c") && this.oThis.position[1] < 1.0 && !Input.isKeyPressed("shift")) {
        // console.log("up");
        let dx = this.crouch_speed * dt;
        this.oThis.translate([0, dx, 0], true);
        if (this.oThis.position[1] > 1.0) {
          let x = this.oThis.position[0];
          let z = this.oThis.position[2];
          this.oThis.setPosition([x, 1.0, z]);
        }
      }
    }

    //detect left click for shooting
    if (Input.isMouseDown("left")) { //change to Input.isKeyDown("left") when implemented
      //TODO: detect if target hit

      //if(<target hit>){
      //score.updateScore(<hit>);
      //}else{
      //score.updateScore(<miss>);
      //}

      //play gunshot sound
      let gunshot = new Audio("assets/audio/gunshot.mp3");
      gunshot.volume = 0.001; //avoid tinnitus
      gunshot.play();
    }
  };
}
