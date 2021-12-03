class gui {
  constructor(params) {
    this.prevP = false;
    const list = document.querySelectorAll(".result");
    for (let i of list) {
      i.style.visibility = "hidden";
    }
    showGui = false;
  }

  run = () => {
    if (Input.isKeyPressed("p") && showGui && Input.isKeyPressed("p") == true && this.prevP == false) {
      canvas.requestPointerLock();
      console.log("closing result screen");
      const list = document.querySelectorAll(".result");
      for (let i of list) {
        i.style.visibility = "hidden";
      }
      showGui = false;
    } else if (Input.isKeyPressed("p") && !showGui && Input.isKeyPressed("p") == true && this.prevP == false) {
      document.exitPointerLock();
      console.log("showing result screen");
      const list = document.querySelectorAll(".result");
      for (let i of list) {
        i.style.visibility = "visible";
      }
      showGui = true;
    }
    this.prevP = Input.isKeyPressed("p");
  };
}
