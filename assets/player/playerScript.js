class playerScript {
    speed = 10;

    constructor(oThis) {
        this.oThis = oThis;
    }

    start = () => {}

    update = () => {
        // Player movement
        if (Input.w) this.oThis.translate(v3.multiply(forward, [this.speed * dt, 0, this.speed * dt]), true);
        if (Input.s) this.oThis.translate(v3.multiply(forward, [-this.speed * dt, 0, -this.speed * dt]), true);
        if (Input.a) this.oThis.translate(v3.multiply(right, [-this.speed * dt, 0, -this.speed * dt]), true);
        if (Input.d) this.oThis.translate(v3.multiply(right, [this.speed * dt, 0, this.speed * dt]), true);
    }
}