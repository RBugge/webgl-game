let isPointerLocked = false;
let Input = {};
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

mouseMap = {
    1: "left",
    3: "right"
}

Input.mouse = {
    left: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false },
    right: { pressed: false, released: true, down: false, up: false, downflag: false, upflag: false, wait: false }
}

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
    if (keymap[e.keyCode] === undefined) return;

    if (!Input.keys[keymap[e.keyCode]].pressed) {
        if (Input.keys[keymap[e.keyCode]].downflag)
            Input.keys[keymap[e.keyCode]].wait = true;
        else
            Input.keys[keymap[e.keyCode]].down = true;
    }

    Input.keys[keymap[e.keyCode]].pressed = true;
};

onKeyUp = (e) => {
    if (keymap[e.keyCode] === undefined) return;

    if (Input.keys[keymap[e.keyCode]].pressed) {
        if (Input.keys[keymap[e.keyCode]].upflag)
            Input.keys[keymap[e.keyCode]].wait = true;
        else
            Input.keys[keymap[e.keyCode]].up = true;
    }
    Input.keys[keymap[e.keyCode]].pressed = false;
};

onMouseDown = (e) => {
    if (mouseMap[e.which] === undefined) return;

    if (!Input.mouse[mouseMap[e.which]].pressed){
        if(Input.mouse[mouseMap[e.which]].downflag)
            Input.mouse[mouseMap[e.which]].wait = true;
        else
            Input.mouse[mouseMap[e.which]].down = true;
    }
    Input.mouse[mouseMap[e.which]].pressed = true;
};

onMouseUp = (e) => {
    if (mouseMap[e.which] === undefined) return;

    if (Input.mouse[mouseMap[e.which]].pressed){
        if(Input.mouse[mouseMap[e.which]].upflag)
            Input.mouse[mouseMap[e.which]].wait = true;
        else
            Input.mouse[mouseMap[e.which]].up = true;
    }
    Input.mouse[mouseMap[e.which]].pressed = false;
};

Input.resetInput = () => {
    Object.keys(Input.keys).map(key => {
        if (Input.keys[key].wait) {
            if (Input.keys[key].downflag) Input.keys[key].down = true;
            if (Input.keys[key].downflag) Input.keys[key].up = true;
        } else {
            Input.keys[key].down = false;
            Input.keys[key].up = false;
        }
        Input.keys[key].wait = false;
    });

    Object.keys(Input.mouse).map(btn => {
        if (Input.mouse[btn].wait) {
            if (Input.mouse[btn].downflag) Input.mouse[btn].down = true;
            if (Input.mouse[btn].downflag) Input.mouse[btn].up = true;
        } else {
            Input.mouse[btn].down = false;
            Input.mouse[btn].up = false;
        }
        Input.mouse[btn].wait = false;
    });
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

Input.isMousePressed = (btn) => {
    return Input.mouse[btn].pressed;
}

Input.isMouseDown = (btn) => {
    if (!Input.mouse[btn].down)
        Input.mouse[btn].downflag = true;
    return Input.mouse[btn].down;
}

Input.isMouseUp = (btn) => {
    if (!Input.mouse[btn].up)
        Input.mouse[btn].upflag = true;
    return Input.mouse[btn].up;
}