export class GameTicker {
	private _tps: number;
	private _tickers: (() => void)[] = [];

	constructor(ticksPerSecond: number = 60) {
		this._tps = ticksPerSecond;

		// Run tick function at the defined tickRate
		setInterval(() => this._tick(), 1000 / this._tps);
	}

	/**
	 * Call all functions defined in the list of tickers.
	 */
	private _tick = () => {
		for (let ticker of this._tickers)
			ticker();
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
	 * @param ticker The function to call. It does not take any parameters, and does not return anything.
	 */
	public add = (ticker: () => void) => {
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
