class playerScript {
    speed = 10;

    constructor(oThis) {
        this.oThis = oThis;
    }

    start = () => {

    }

    update = () => {
        if(Input.w) this.oThis.translate([0, 0, -this.speed*dt]);
        if(Input.s) this.oThis.translate([0, 0, this.speed*dt]);
        if(Input.a) this.oThis.translate([-this.speed*dt, 0, 0]);
        if(Input.d) this.oThis.translate([this.speed*dt, 0, 0]);

        camera.position = this.oThis.position;
        // TODO: Change with mouse movements, and rotate model with mousex movements
        camera.lookAt = v3.add(camera.position, [0, 0, -15]);
    }
}