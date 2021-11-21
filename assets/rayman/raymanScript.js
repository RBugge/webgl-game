class raymanScript {
    constructor(oThis) {
        this.oThis = oThis;
    }
    start = () => {

    }

    update = () => {
        this.oThis.rotate({y: 1});
        // this.oThis.setPosition([Math.sin(time), 0, 0], true);
    }
}