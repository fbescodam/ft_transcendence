export class GameTicker {
	private _tps: number;
	private _tickers: (() => void)[] = [];

	constructor(ticksPerSecond: number = 60) {
		this._tps = ticksPerSecond;

		// Run tick function at the defined tickRate
		setInterval(() => this._tick(), 1000 / this._tps);
	}

	private _tick = () => {
		for (let ticker of this._tickers)
			ticker();
	}

	//= Public =//

	public getTickRate = () => {
		return this._tps;
	}

	public add = (ticker: () => void) => {
		this._tickers.push(ticker);
	}

	public remove = (ticker: () => void) => {
		this._tickers = this._tickers.filter(t => t != ticker);
	}
}

export default GameTicker;
