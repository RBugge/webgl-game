class cameraScript {
    lookSensitivity = 10;

    constructor(oThis) {
        this.oThis = oThis;
    }

    start = () => { }

    update = () => {

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