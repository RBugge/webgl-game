class gui {
  constructor(params) {
    this.prevP = false;
    this.crosshair = -1;
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
    setEasy();
    setCrosshair(0, true, this);
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

    if (Input.isKeyPressed("m") && showMenu && this.prevM == false) {
      canvas.requestPointerLock();
      console.log("closing main menu screen");
      const list2 = document.querySelectorAll(".main_menu");
      for (let i of list2) {
        i.style.visibility = "hidden";
      }
      showCrosshair();
      showMenu = false;
    } else if (Input.isKeyPressed("m") && !showMenu && this.prevM == false) {
      document.exitPointerLock();
      console.log("showing main menu screen");
      const list2 = document.querySelectorAll(".main_menu");
      for (let i of list2) {
        i.style.visibility = "visible";
      }
      showMenu = true;
      hideCrosshair();
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

function closeMainMenu() {
  console.log("closing main menu screen");
  const list2 = document.querySelectorAll(".main_menu");
  for (let i of list2) {
    i.style.visibility = "hidden";
  }
  showMenu = false;
  showGui = false;
  document.getElementById("crosshair").src =
    repo + "assets/Textures/crosshairs/" + GUI.crosshair + ".png";
  showCrosshair();
  canvas.requestPointerLock();
}

function closeResultMenu() {
  console.log("closing result screen");
  const list2 = document.querySelectorAll(".result");
  for (let i of list2) {
    i.style.visibility = "hidden";
  }
  showMenu = false;
  document.getElementById("crosshair").src =
    repo + "assets/Textures/crosshairs/" + GUI.crosshair + ".png";
  showCrosshair();
  document.exitPointerLock();
}

function openMenu() {
  hideCrosshair();
  document.exitPointerLock();
  const list2 = document.querySelectorAll(".main_menu");
  for (let i of list2) {
    i.style.visibility = "visible";
  }
  showMenu = true;
  showGui = false;
  document.getElementById("crosshair").src = "";
}

function setEasy() {
  document.getElementById("easyDifficulty").style.color = "#f99e1a";
  document.getElementById("mediumDifficulty").style.color = "white";
  document.getElementById("hardDifficulty").style.color = "white";
  difficulty = "easy";
}
function setMedium() {
  document.getElementById("easyDifficulty").style.color = "white";
  document.getElementById("mediumDifficulty").style.color = "#f99e1a";
  document.getElementById("hardDifficulty").style.color = "white";
  difficulty = "medium";
}
function setHard() {
  document.getElementById("easyDifficulty").style.color = "white";
  document.getElementById("mediumDifficulty").style.color = "white";
  document.getElementById("hardDifficulty").style.color = "#f99e1a";
  difficulty = "hard";
}

function setCrosshair(val, useSelf, self) {
  if (useSelf) {
    self.crosshair = parseInt(val);
    console.log(self.crosshair);
  } else {
    GUI.crosshair = parseInt(val);
    console.log(GUI.crosshair);
  }

  // console.log(document.getElementById("crosshair1").childNodes[1]);
  for (let i = 0; i < 12; i++) {
    document.getElementById(
      "crosshair" + i
    ).childNodes[1].style.backgroundColor = "transparent";
  }
  document.getElementById(
    "crosshair" + val
  ).childNodes[1].style.backgroundColor = "#fff";
}

function hideCrosshair() {
  document.getElementById("crosshair").style.visibility = "hidden";
}

function showCrosshair() {
  document.getElementById("crosshair").style.visibility = "visible";
}
