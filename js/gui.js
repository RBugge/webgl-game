class gui {
  constructor(params) {
    this.prevP = false;
    this.framesLeft = Math.floor(1 / dt) * 2;
    this.showSensitivity = false;
    this.lastSensitivity = LOOK_SENSITIVITY;
    const list = document.querySelectorAll(".result");
    const list2 = document.querySelectorAll(".main_menu");
    for (let i of list) {
      i.style.visibility = "hidden";
    }
    for (let i of list2) {
      i.style.visibility = "visible";
    }
    showGui = false;
    showMenu = true;
  }

  run = () => {
    if (
      Input.isKeyPressed("p") &&
      showGui &&
      Input.isKeyPressed("p") == true &&
      this.prevP == false
    ) {
      canvas.requestPointerLock();
      console.log("closing result screen");
      const list = document.querySelectorAll(".result");
      for (let i of list) {
        i.style.visibility = "hidden";
      }
      showGui = false;
    } else if (
      Input.isKeyPressed("p") &&
      !showGui &&
      Input.isKeyPressed("p") == true &&
      this.prevP == false
    ) {
      document.exitPointerLock();
      console.log("showing result screen");
      const list = document.querySelectorAll(".result");
      for (let i of list) {
        i.style.visibility = "visible";
      }
      showGui = true;
    }
    this.prevP = Input.isKeyPressed("p");

    if (
      Input.isKeyPressed("m") &&
      showMenu &&
      Input.isKeyPressed("m") == true &&
      this.prevM == false
    ) {
      canvas.requestPointerLock();
      console.log("closing main menu screen");
      const list2 = document.querySelectorAll(".main_menu");
      for (let i of list2) {
        i.style.visibility = "hidden";
      }
      showMenu = false;
    } else if (
      Input.isKeyPressed("m") &&
      !showMenu &&
      Input.isKeyPressed("m") == true &&
      this.prevM == false
    ) {
      document.exitPointerLock();
      console.log("showing main menu screen");
      const list2 = document.querySelectorAll(".main_menu");
      for (let i of list2) {
        i.style.visibility = "visible";
      }
      showMenu = true;
    }

    this.prevM = Input.isKeyPressed("m");

    // look sensitivity overlay
    try {
      if (this.lastSensitivity != LOOK_SENSITIVITY && this.framesLeft >= 0) {
        document.getElementById("sens").style.visibility = "visible";
        document.getElementById("sens").innerHTML = LOOK_SENSITIVITY;

        this.showSensitivity = true;
        this.framesLeft = Math.floor(1 / dt) * 2;
        console.log("changed!", LOOK_SENSITIVITY, this.framesLeft);
      } else if (this.showSensitivity && this.framesLeft < 0) {
        console.log("hide!");
        document.getElementById("sens").style.visibility = "hidden";
        this.showSensitivity = false;
        this.framesLeft = Math.floor(1 / dt) * 2;
      }

      if (this.showSensitivity && this.framesLeft >= 0) {
        this.framesLeft--;
      }
    } catch (error) {}

    this.lastSensitivity = LOOK_SENSITIVITY;
  };
}
