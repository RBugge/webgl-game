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
Input.updatePosition = () => {};

initInput = () => {
    console.log('asdasd')
    canvas.requestPointerLock = canvas.requestPointerLock ||
        canvas.mozRequestPointerLock;
    document.exitPointerLock = document.exitPointerLock ||
        document.mozExitPointerLock;
    canvas.onclick = function () {
        if (!isPointerLocked)
            canvas.requestPointerLock();
    };

    window.addEventListener("keydown", onKeyDown, false);
    window.addEventListener("keyup", onKeyUp, false);
    window.addEventListener("mousedown", onMouseDown, false);
    window.addEventListener("mouseup", onMouseUp, false);

    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
}

lockChangeAlert = () => {
    if (document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas) {
        isPointerLocked = true;
        document.addEventListener("mousemove", updatePosition, false);
    } else {
        isPointerLocked = false;
        document.removeEventListener("mousemove", updatePosition, false);
    }
}

updatePosition = (e) => {
    Input.movementX = e.movementX;
    Input.movementY = e.movementY;
    camera.script.updateLookAt();
}

onKeyDown = (e) => {
    let keyCode = e.keyCode;
    if(keyCode == 87) Input.w = true;
    if(keyCode == 65) Input.a = true;
    if(keyCode == 83) Input.s = true;
    if(keyCode == 68) Input.d = true;
    if (keyCode == 32) Input.space = true;
    if (keyCode == 67) Input.c = true;
    if (keyCode == 16) Input.shift = true;
}

onKeyUp = (e) => {
    let keyCode = e.keyCode;
    if(keyCode == 87) Input.w = false;
    if(keyCode == 65) Input.a = false;
    if(keyCode == 83) Input.s = false;
    if(keyCode == 68) Input.d = false;
    if (keyCode == 32) Input.space = false;
    if (keyCode == 67) Input.c = false;
    if (keyCode == 16) Input.shift = false;
}

onMouseDown = (e) => {
    if(e.which === 1) Input.left = true;
    if(e.which === 3) Input.right = true;
}

onMouseUp = (e) => {
    if(e.which === 1) Input.left = false;
    if(e.which === 3) Input.right = false;
}
