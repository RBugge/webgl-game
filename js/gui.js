class gui {
  constructor(params) {
    this.prevP = false;
    this.framesLeft = Math.floor(1 / dt) * 2;
    this.showSensitivity = false;
    this.lastSensitivity = LOOK_SENSITIVITY;
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
    

    // look sensitivity overlay
    try {
      if (this.lastSensitivity != LOOK_SENSITIVITY && this.framesLeft >= 0)
      {
        document.getElementById('sens').style.visibility = 'visible';
        document.getElementById('sens').innerHTML = LOOK_SENSITIVITY;
        
        this.showSensitivity = true;
        this.framesLeft = Math.floor(1 / dt) * 2;
        console.log("changed!", LOOK_SENSITIVITY, this.framesLeft);
      }
      else if (this.showSensitivity && this.framesLeft < 0)
      {
        console.log('hide!');
        document.getElementById('sens').style.visibility = 'hidden';
        this.showSensitivity = false;
        this.framesLeft = Math.floor(1 / dt) * 2;
      }

      if (this.showSensitivity && this.framesLeft >= 0)
      {
        this.framesLeft--;
      }
      
    } catch (error) {
      
    }

    this.lastSensitivity = LOOK_SENSITIVITY;
  };
}
