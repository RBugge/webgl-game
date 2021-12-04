//bounds of target:
//x = [-15, 15]
//y = [-1, 15] 
//z = [-15, -30] 

//detects if a target is intersecting another
targetIntersect = (target1, target2) => {

    //calculate distance between target1 and target2
    let distance = (target1.position[0]-target2.position[0])*(target1.position[0]-target2.position[0]) + (target1.position[1]-target2.position[1])*(target1.position[1]-target2.position[1]);

    //if the distance between the targets is less than the diameter (2*r) of a target then they are intersecting
    if(target1.transform.Scale.x > 1){ //account for scale of target
        if(distance < (target1.modelDim.dia + target1.transform.Scale.x + 1)){ //target with scale
            return true;
        }else{
            return false;
        }
    }else{
        if(distance < (target1.modelDim.dia)){ //target with default scale (smaller)
            return true;
        }else{
            return false;
        }
    }
}

//checks every target for collisions
checkCollision = () => {
    let target1, target2;

    //reset collision flags for every target
    for(let i = 0; i < targets.length; i++){
        targets[i].isColliding = false;
    }

    //check for collisions
    for(let i = 0; i < targets.length; i++){ //iterate through all of targets
        target1 = targets[i];
        for(let j = i+1; j < targets.length; j++){ //iterate through the rest of the targets
            target2 = targets[j];
            if(targetIntersect(target1, target2)){ //if they intersect set isColliding to true
                target1.isColliding = true;
                target2.isColliding = true;
            }
        }
    }

}

class targetScript {

    //whether the target is traveling in the positive x,y,z direction
    positiveX = (Math.random() <= 0.5 ? false : true); // random true/false values
    positiveY = (Math.random() <= 0.5 ? false : true);
    //positiveZ = (Math.random() < 0.5 ? false : true);
    medium_multiplier = 1.5;
    hard_multiplier = 2;

    isColliding = false;

    constructor(oThis) {
        this.oThis = oThis;
        this.modelDim = computeModelExtent(this.oThis.model);
    }

    start = () => {}

    //movement logic for targets
    update = () => {
        
        checkCollision(); //check for collisions

        if(this.oThis.isColliding){ //if collision is detected
            this.oThis.positiveX = !this.oThis.positiveX; //reverse x direction
            this.oThis.positiveY = !this.oThis.positiveY; //reverse y direction
        }
        
        //check if the targets will go out of bounds and reverse direction if they will (collision detection with borders)
        if(this.oThis.positiveX && (this.oThis.position[0]*1.05 >= 35)){ //check next iteration of translate
            this.oThis.positiveX = false; //reverse x direction
        } else if(!this.oThis.positiveX && (this.oThis.position[0]*1.05 <= -35)){ //check next iteration of translate
            this.oThis.positiveX = true; //reverse x direction
        } else if(this.oThis.positiveY && (this.oThis.position[1]*1.05 >= 15)){ //check next iteration of translate
            this.oThis.positiveY = false; //reverse y direction
        } else if(!this.oThis.positiveY && (this.oThis.position[1]*1.05 <= -1)){ //check next iteration of translate
            this.oThis.positiveY = true; //reverse y direction
        }

        //translate targets
        if(this.oThis.positiveX && this.oThis.positiveY){
            this.oThis.translate([0.05, 0.05, 0], true);
        }else if(!this.oThis.positiveX && this.oThis.positiveY){
            this.oThis.translate([-0.05, 0.05, 0], true);
        }else if(this.oThis.positiveX && !this.oThis.positiveY){
            this.oThis.translate([0.05, -0.05, 0], true);
        }else{
            this.oThis.translate([-0.05, -0.05, 0], true);
        }
        
    }

}
