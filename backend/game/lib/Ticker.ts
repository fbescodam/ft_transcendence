export class GameTicker {
	private _tps: number;
	private _lastTick: number = 0;
	private _tickers: {
		[key: string]: (tps: number, deltaTick: number) => void;
	} = {};

	constructor(ticksPerSecond: number = 60) {
		this._tps = ticksPerSecond;

		this._lastTick = Date.now();

		// Run tick function at the defined tickRate
		setInterval(() => this._tick(), 1000 / this._tps);
	}

	/**
	 * Call all functions defined in the list of tickers.
	 */
	private _tick = () => {
		const now = Date.now();
		const deltaTick = now - this._lastTick;
		for (let ticker in this._tickers) {
			(async () => {
				this._tickers[ticker](this._tps, deltaTick);
			})();
		}
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
	 * @param tickerId The id of the ticker. This is used to be able to remove the ticker later.
	 * @param ticker The function to call every tick.
	 *               It will be called with the current tick rate and the time since the last tick in milliseconds.
	 */
	public add = (tickerId: string, ticker: (tps: number, deltaTick: number) => void) => {
		this._tickers[tickerId] = ticker;
	}

	/**
	 * Remove a function from the ticker. This function was never properly tested but could in essence work.
	 * @param tickerId The id of the function to remove. It will not be called again.
	 */
	public remove = (tickerId: string) => {
		delete this._tickers[tickerId];
	}

	/**
	 * Remove all tickers.
	 */
	public clear = () => {
		this._tickers = {};
	}
}

export default GameTicker;
