//bounds of target:
//x = [-15, 15]
//y = [-1, 15] 
//z = [-15, -30] 


class targetScript {

    //whether the target is traveling in the positive x,y,z direction
    positiveX = (Math.random() <= 0.5 ? false : true); // random true/false values
    positiveY = (Math.random() <= 0.5 ? false : true);
    //positiveZ = (Math.random() < 0.5 ? false : true);
    medium_multiplier = 1.5;
    hard_multiplier = 2;

    constructor(oThis) {
        this.oThis = oThis;
    }

    start = () => {}

    update = () => {
        
        //check if the targets will go out of bounds and reverse direction if they will
        if(this.oThis.positiveX && (this.oThis.position[0]*1.05 >= 35)){ //check next iteration of translate
            this.oThis.positiveX = false; //reverse direction
        } else if(!this.oThis.positiveX && (this.oThis.position[0]*1.05 <= -35)){ //check next iteration of translate
            this.oThis.positiveX = true; //reverse direction
        } else if(this.oThis.positiveY && (this.oThis.position[1]*1.05 >= 15)){ //check next iteration of translate
            this.oThis.positiveY = false; //reverse direction
        } else if(!this.oThis.positiveY && (this.oThis.position[1]*1.05 <= -1)){ //check next iteration of translate
            this.oThis.positiveY = true; //reverse direction
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
