let hit;
let shotsFired;
let accuracy;
let miss;

class score {
  hit = 0;
  shotsFired = 0;
  accuracy = 0.0;
  miss = 0;

  //update player score, called when gun is fired
  updateScore = (e) => {
    if (e == "t") {
      //TODO: detect when object is destroyed (currently testing using character)
      this.hit++; //increment hits
      document.getElementById("hit").innerHTML = `Targets Hit: ${hit}`;
      this.shotsFired++;
    } else if (e == "y") {
      ////TODO: detect when object is not destroyed (currently testing using character)
      this.shotsFired++;
      document.getElementById("missed").innerHTML = `Targets Missed: ${
        this.shotsFired - this.hit
      }`;
    }
  };

  //calculates final score
  finalScore = () => {
    accuracy = Math.round((this.hit / this.shotsFired) * 100); //percentage of shots hit
    miss = this.shotsFired - this.hit; //calculate missed targets
    document.getElementById("hit").innerHTML = `Targets Hit: ${this.hit}`;
    document.getElementById("missed").innerHTML = `Targets Missed: ${miss}`;
    document.getElementById(
      "accuracy"
    ).innerHTML = `Accuracy: ${accuracy} percent`;
  };
}
