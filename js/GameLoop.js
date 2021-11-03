let fps = 0;
let time = 0;
let dt = 0;

class GameLoop {
	constructor(callback) {
		this.last = 0;
		this.callback = callback;
		this.isActive = false;
	}

	run = () => {
		let now = performance.now();
		dt = (now - this.last) / 1000;
		dt = dt < 1 ? dt : 1;
		time += dt;
		fps = Math.floor(1 / dt);
		console.log(fps);

		this.callback();
		this.last = now;
		if(this.isActive) requestAnimationFrame(this.run);
	}

	start = () => {
		this.isActive = true;
		this.msLastFrame = performance.now();
		window.requestAnimationFrame(this.run);
		return this;
	}

	stop = () => { this.isActive = false; }
}