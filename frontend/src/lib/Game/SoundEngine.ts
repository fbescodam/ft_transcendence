class GameSoundEngine {
	private _context: AudioContext;
	private _gainNode: GainNode;

	constructor() {
		this._context = new AudioContext();
		this._gainNode = this._context.createGain();
		this._gainNode.gain.value = 0.25; // 25% volume
		this._gainNode.connect(this._context.destination);
	}

	/**
	 * Play a beeping 8-bit sound
	 */
	public playBeep = () => {
		const osc = this._context.createOscillator();
		osc.type = "square";
		osc.frequency.value = 800;
		osc.connect(this._gainNode);
		osc.start();
		osc.stop(this._context.currentTime + 0.09);
	}

	/**
	 * Play a booping 8-bit sound
	 */
	public playBoop = () => {
		const osc = this._context.createOscillator();
		osc.type = "square";
		osc.frequency.value = 400;
		osc.connect(this._gainNode);
		osc.start();
		osc.stop(this._context.currentTime + 0.1);
	}
}

export default GameSoundEngine;
