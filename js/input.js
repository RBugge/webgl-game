let isPointerLocked = false;
let Input = {};
Input.updatePosition = () => { };

let keymap = {
    16: "shift",
    27: "escape",
    32: "space",
    65: "a",
    66: "b",
    67: "c",
    68: "d",
    69: "e",
    70: "f",
    71: "g",
    72: "h",
    73: "i",
    74: "j",
    75: "k",
    76: "l",
    77: "m",
    78: "n",
    79: "o",
    80: "p",
    81: "q",
    82: "r",
    83: "s",
    84: "t",
    85: "u",
    86: "v",
    87: "w",
    88: "x",
    89: "y",
    90: "z",
};

mouseMap = {
    1: "left",
    3: "right",
};

Input.keys = {};
Input.mouse = {};

// Initialize the pointerlock/input event listeners and Input key/mouse objects
initInput = () => {
    canvas.requestPointerLock =
        canvas.requestPointerLock || canvas.mozRequestPointerLock;
    document.exitPointerLock =
        document.exitPointerLock || document.mozExitPointerLock;
    canvas.onclick = function () {
        if (!isPointerLocked && !showMenu) canvas.requestPointerLock();
    };

    window.addEventListener("keydown", onKeyDown, false);
    window.addEventListener("keyup", onKeyUp, false);
    window.addEventListener("mousedown", onMouseDown, false);
    window.addEventListener("mouseup", onMouseUp, false);
    window.addEventListener("wheel", onWheelScroll, false);

    document.addEventListener("pointerlockchange", lockChangeAlert, false);
    document.addEventListener("mozpointerlockchange", lockChangeAlert, false);

    // Assign new properties to keys and mouse for each mapped key/button
    Object.values(keymap).forEach(value => {
        Input.keys[value] = {
            pressed: false,
            down: false,
            up: false,
            downflag: false,
            upflag: false,
            wait: false,
        };
    });

    Object.values(mouseMap).forEach(value => {
        Input.mouse[value] = {
            pressed: false,
            down: false,
            up: false,
            downflag: false,
            upflag: false,
            wait: false,
        };
    });
};

// Add/remove the updatePosition function eventlistener when pointerlock is toggled
lockChangeAlert = () => {
    if (
        document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas
    ) {
        isPointerLocked = true;
        document.addEventListener("mousemove", updatePosition, false);
    } else {
        isPointerLocked = false;
        document.removeEventListener("mousemove", updatePosition, false);
    }
};

// Calls the camera updateLookAt function whenever the mouse is moved
updatePosition = (e) => {
    Input.movementX = e.movementX;
    Input.movementY = e.movementY;
    camera.script.updateLookAt();
};

// Functions to set pressed/down/up and wait if a flag is set
onKeyDown = (e) => {
    if (keymap[e.keyCode] === undefined) return;

    if (!Input.keys[keymap[e.keyCode]].pressed) {
        if (Input.keys[keymap[e.keyCode]].downflag)
            Input.keys[keymap[e.keyCode]].wait = true;
        else Input.keys[keymap[e.keyCode]].down = true;
    }

    Input.keys[keymap[e.keyCode]].pressed = true;
};

onKeyUp = (e) => {
    if (keymap[e.keyCode] === undefined) return;

    if (Input.keys[keymap[e.keyCode]].pressed) {
        if (Input.keys[keymap[e.keyCode]].upflag)
            Input.keys[keymap[e.keyCode]].wait = true;
        else Input.keys[keymap[e.keyCode]].up = true;
    }
    Input.keys[keymap[e.keyCode]].pressed = false;
};

onMouseDown = (e) => {
    if (mouseMap[e.which] === undefined) return;

    if (!Input.mouse[mouseMap[e.which]].pressed) {
        if (Input.mouse[mouseMap[e.which]].downflag)
            Input.mouse[mouseMap[e.which]].wait = true;
        else Input.mouse[mouseMap[e.which]].down = true;
    }
    Input.mouse[mouseMap[e.which]].pressed = true;
};

onMouseUp = (e) => {
    if (mouseMap[e.which] === undefined) return;

    if (Input.mouse[mouseMap[e.which]].pressed) {
        if (Input.mouse[mouseMap[e.which]].upflag)
            Input.mouse[mouseMap[e.which]].wait = true;
        else Input.mouse[mouseMap[e.which]].up = true;
    }
    Input.mouse[mouseMap[e.which]].pressed = false;
};

onWheelScroll = (e) => {
    const LOOK_INCREMENT = 0.5;
    // console.log(e.deltaY);
    if (e.deltaY < 0) {
        // mouse up
        var look_sens = LOOK_SENSITIVITY + LOOK_INCREMENT;
        LOOK_SENSITIVITY = look_sens; // no max.
        // console.log(look_sens);
    } else if (e.deltaY > 0) {
        // mouse down
        var look_sens = LOOK_SENSITIVITY - LOOK_INCREMENT;
        if (look_sens <= 1)
            // clamp at 1.
            LOOK_SENSITIVITY = 1;
        else LOOK_SENSITIVITY = look_sens;
        // console.log(look_sens);
    }
};

// Resets the Inputs each frame to sync whether a key/button was pressed that frame
// If an input event was registered after it was checked that frame, the value is
//  set true for the beginning of the next frame.
Input.resetInput = () => {
    Object.keys(Input.keys).map((key) => {
        if (Input.keys[key].wait) {
            if (Input.keys[key].downflag) Input.keys[key].down = true;
            if (Input.keys[key].downflag) Input.keys[key].up = true;
        } else {
            Input.keys[key].down = false;
            Input.keys[key].up = false;
        }
        Input.keys[key].wait = false;
    });

    Object.keys(Input.mouse).map((btn) => {
        if (Input.mouse[btn].wait) {
            if (Input.mouse[btn].downflag) Input.mouse[btn].down = true;
            if (Input.mouse[btn].downflag) Input.mouse[btn].up = true;
        } else {
            Input.mouse[btn].down = false;
            Input.mouse[btn].up = false;
        }
        Input.mouse[btn].wait = false;
    });
};

// Functions to check whether a key/button is pressed or released
Input.isKeyPressed = (key) => {
    return Input.keys[key].pressed;
};

Input.isKeyDown = (key) => {
    if (!Input.keys[key].down) Input.keys[key].downflag = true;
    return Input.keys[key].down;
};

Input.isKeyUp = (key) => {
    if (!Input.keys[key].up) Input.keys[key].upflag = true;
    return Input.keys[key].up;
};

Input.isMousePressed = (btn) => {
    return Input.mouse[btn].pressed;
};

Input.isMouseDown = (btn) => {
    if (!Input.mouse[btn].down) Input.mouse[btn].downflag = true;
    return Input.mouse[btn].down;
};

Input.isMouseUp = (btn) => {
    if (!Input.mouse[btn].up) Input.mouse[btn].upflag = true;
    return Input.mouse[btn].up;
};
