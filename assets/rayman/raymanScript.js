class raymanScript {
    constructor(oThis) {
        this.oThis = oThis;
    }
    start = () => {

    }

    update = () => {
        this.oThis.rotate({y: 1});
        this.oThis.children[0].rotate({y: 1});
        this.oThis.children[0].children[0].rotate({y: 1});
    }
}