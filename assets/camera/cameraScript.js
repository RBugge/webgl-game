class cameraScript {
    lookSensitivity = 10;

    constructor(oThis) {
        this.oThis = oThis;
    }

    start = () => { }

    update = () => {
        // NOTICE: update vectors moved to main and player movement moved to playerScript
        // let forward = v3.subtract(lookAt.position, this.oThis.position);
        // forward[1] = 0;
        // forward = v3.normalize(forward);
        // let right = v3.cross(forward, [0,1,0]);

        // if (Input.w) this.oThis.translate(v3.multiply(forward, [this.speed * dt, 0, this.speed * dt]), true);
        // if (Input.s) this.oThis.translate(v3.multiply(forward, [-this.speed * dt, 0, -this.speed * dt]), true);
        // if (Input.a) this.oThis.translate(v3.multiply(right, [-this.speed * dt, 0, -this.speed * dt]), true);
        // if (Input.d) this.oThis.translate(v3.multiply(right, [this.speed * dt, 0, this.speed * dt]), true);
    }

    // Update the roation of camera with mouse movement
    updateLookAt = () => {
        // Lock camera to -80 to 80 degrees vertically
        let xRot = -deg2rad(this.lookSensitivity * Input.movementY);
        let temp = camera.transform.Rotation.x + deg2rad(xRot);
        if (temp < deg2rad(-80) || temp > deg2rad(80))
            xRot = 0;

        camera.rotate({
            x: xRot,
        })


        camera.parent ?
            camera.parent.rotate({ y: -deg2rad(this.lookSensitivity * Input.movementX) }) :
            camera.rotate({ y: -deg2rad(this.lookSensitivity * Input.movementX) });
    }
}