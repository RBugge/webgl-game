let isPointerLocked = false;
let Input = {};
Input.w = false;
Input.a = false;
Input.s = false;
Input.d = false;
Input.left = false;
Input.right = false;
Input.movementX = 0;
Input.movementY = 0;
Input.space = false;
Input.c = false;
Input.shift = false;
Input.p = false;
Input.updatePosition = () => { };

let keymap = {
    16: "shift",
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
    90: "z"
};

Input.keys = {
    left: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    right: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    shift: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    space: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    a: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    b: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    c: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    d: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    e: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    f: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    g: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    h: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    i: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    j: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    k: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    l: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    m: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    n: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    o: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    p: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    q: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    r: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    s: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    t: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    u: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    v: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    w: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    x: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    y: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    z: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false }
}

// Input to test the destruction of objects
Input.t = false;
Input.y = false;
Input.u = false;
Input.i = false;
Input.o = false;
Input.l = false;
// Input to test the destruction of objects

initInput = () => {
    canvas.requestPointerLock =
        canvas.requestPointerLock || canvas.mozRequestPointerLock;
    document.exitPointerLock =
        document.exitPointerLock || document.mozExitPointerLock;
    canvas.onclick = function () {
        if (!isPointerLocked) canvas.requestPointerLock();
    };

    window.addEventListener("keydown", onKeyDown, false);
    window.addEventListener("keyup", onKeyUp, false);
    window.addEventListener("mousedown", onMouseDown, false);
    window.addEventListener("mouseup", onMouseUp, false);

    document.addEventListener("pointerlockchange", lockChangeAlert, false);
    document.addEventListener("mozpointerlockchange", lockChangeAlert, false);
};

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

updatePosition = (e) => {
    Input.movementX = e.movementX;
    Input.movementY = e.movementY;
    camera.script.updateLookAt();
};

onKeyDown = (e) => {
    if (!Input.keys[keymap[e.keyCode]].pressed) {
        if (Input.keys[keymap[e.keyCode]].downflag)
            Input.keys[keymap[e.keyCode]].wait = true;
        else
            Input.keys[keymap[e.keyCode]].down = true;
    }

    Input.keys[keymap[e.keyCode]].pressed = true;


    // if (keymap[keyCode] == "w") Input.w = true;
    // if (keyCode == 65) Input.a = true;
    // if (keyCode == 83) Input.s = true;
    // if (keyCode == 68) Input.d = true;
    // if (keyCode == 32) Input.space = true;
    // if (keyCode == 67) Input.c = true;
    // if (keyCode == 16) Input.shift = true;
    // if (keyCode == 80) Input.p = true;

    // // Input to test the destruction of objects
    // if (keyCode == 84) Input.t = true;
    // if (keyCode == 89) Input.y = true;
    // if (keyCode == 85) Input.u = true;
    // if (keyCode == 73) Input.i = true;
    // if (keyCode == 79) Input.o = true;
    // if (keyCode == 76) Input.l = true;
    // // Input to test the destruction of objects
};

onKeyUp = (e) => {

    if (Input.keys[keymap[e.keyCode]].pressed) {
        if (!Input.keys[keymap[e.keyCode]].upflag)
            Input.keys[keymap[e.keyCode]].wait = true;
        else
            Input.keys[keymap[e.keyCode]].up = true;
    }
    Input.keys[keymap[e.keyCode]].pressed = false;


    // let keyCode = e.keyCode;
    // if (keyCode == 87) Input.w = false;
    // if (keyCode == 65) Input.a = false;
    // if (keyCode == 83) Input.s = false;
    // if (keyCode == 68) Input.d = false;
    // if (keyCode == 32) Input.space = false;
    // if (keyCode == 67) Input.c = false;
    // if (keyCode == 16) Input.shift = false;
    // if (keyCode == 80) Input.p = false;

    // // Input to test the destruction of objects
    // if (keyCode == 84) Input.t = false;
    // if (keyCode == 89) Input.y = false;
    // if (keyCode == 85) Input.u = false;
    // if (keyCode == 73) Input.i = false;
    // if (keyCode == 79) Input.o = false;
    // if (keyCode == 76) Input.l = false;
    // // Input to test the destruction of objects
};

onMouseDown = (e) => {
    if (e.which === 1) Input.left = true;
    if (e.which === 3) Input.right = true;
};

onMouseUp = (e) => {
    if (e.which === 1) Input.left = false;
    if (e.which === 3) Input.right = false;
};

Input.resetClicks = () => {
    Object.keys(Input.keys).map(key => {
        if (Input.keys[key].wait) {
            if (Input.keys[key].downflag) Input.keys[key].down = true;
            if (Input.keys[key].downflag) Input.keys[key].up = true;
        } else {
            Input.keys[key].down = false;
            Input.keys[key].up = false;
        }
        Input.keys[key].wait = false;
    })
}

Input.isKeyPressed = (key) => {
    return Input.keys[key].pressed;
}

Input.isKeyDown = (key) => {
    if (!Input.keys[key].down)
        Input.keys[key].downflag = true;
    return Input.keys[key].down;
}

Input.isKeyUp = (key) => {
    if (!Input.keys[key].up)
        Input.keys[key].upflag = true;
    return Input.keys[key].up;
}