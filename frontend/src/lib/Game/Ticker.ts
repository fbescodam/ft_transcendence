export class GameTicker {
	private _tps: number;
	private _lastTick: number = 0;
	private _tickers: ((tps: number, deltaTick: number) => void)[] = [];

	constructor(ticksPerSecond: number = 60) {
		this._tps = ticksPerSecond;

		this._lastTick = new Date().getTime();

		// Run tick function at the defined tickRate
		setInterval(() => this._tick(), 1000 / this._tps);
	}

	/**
	 * Call all functions defined in the list of tickers.
	 */
	private _tick = () => {
		const now = new Date().getTime();
		const deltaTick = now - this._lastTick;
		for (let ticker of this._tickers)
			ticker(this._tps, deltaTick);
		this._lastTick = now;
	}

	//= Public =//

	/**
	 * Get the current tick rate of the game engine.
	 * @returns The current tick rate.
	 */
	public getTickRate = () => {
		return this._tps;
	}

	/**
	 * Add a function to the ticker. This function will then be run every game tick.
	 * @param ticker The function to call every tick.
	 *               It will be called with the current tick rate and the time since the last tick in milliseconds.
	 */
	public add = (ticker: (tps: number, deltaTick: number) => void) => {
		this._tickers.push(ticker);
	}

	/**
	 * Remove a function from the ticker. This function was never properly tested but could in essence work.
	 * @param ticker The function to remove from the ticker.
	 */
	public remove = (ticker: () => void) => {
		this._tickers = this._tickers.filter(t => t != ticker);
	}
}

export default GameTicker;
