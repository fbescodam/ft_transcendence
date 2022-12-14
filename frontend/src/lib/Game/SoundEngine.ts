interface GameOverSound {
	djingle: AudioBuffer | null;
	theme: HTMLAudioElement | null;
	themeNode: AudioNode | null;
}

class GameSoundEngine {
	private _audioLocation: string;

	private _context: AudioContext;
	private _gainNode: GainNode;
	private _masterGainNode: GainNode;
	private _soundMuted: Boolean;

	private _lobbyTheme: HTMLAudioElement | null;
	private _lobbyThemeNode: AudioNode | null;

	private _gameTheme: HTMLAudioElement | null;
	private _gameThemeNode: AudioNode | null;
	private _win: GameOverSound;
	private _lose: GameOverSound;
	private _currentTheme: HTMLAudioElement | null = null;

	constructor(hostname: string) {
		this._audioLocation = `http://${hostname}:3000/audio`;
		this._context = new AudioContext();

		this._masterGainNode = this._context.createGain();
		this._masterGainNode.gain.value = 1;
		this._masterGainNode.connect(this._context.destination);
		this._soundMuted = false;

		this._gainNode = this._context.createGain();
		this._gainNode.gain.value = 0.2; // 20% volume
		this._gainNode.connect(this._masterGainNode);

		this._lobbyTheme = new Audio(`${this._audioLocation}/lobby-theme.mp3`);
		this._lobbyTheme.crossOrigin = "anonymous";
		this._lobbyTheme.loop = true;
		this._lobbyThemeNode = this._context.createMediaElementSource(this._lobbyTheme);
		this._lobbyThemeNode.connect(this._masterGainNode);

		this._gameTheme = new Audio(`${this._audioLocation}/game-theme.mp3`);
		this._gameTheme.crossOrigin = "anonymous";
		this._gameThemeNode = this._context.createMediaElementSource(this._gameTheme);
		this._gameThemeNode.connect(this._masterGainNode);

		this._win = { djingle: null, theme: null, themeNode: null };
		this._lose = { djingle: null, theme: null, themeNode: null };
		this._loadGameSounds();
	}

	private _loadGameSounds = async () => {
		// set up win djingle
		const winAudio = new Audio(`${this._audioLocation}/win-theme.mp3`);
		winAudio.crossOrigin = "anonymous";
		winAudio.loop = true;
		this._win = {
			djingle: await this._loadSound(`${this._audioLocation}/win-djingle.mp3`),
			theme: winAudio,
			themeNode: this._context.createMediaElementSource(winAudio)
		};
		this._win.themeNode?.connect(this._masterGainNode);

		const loseAudio = new Audio(`${this._audioLocation}/lose-theme.mp3`);
		loseAudio.crossOrigin = "anonymous";
		loseAudio.loop = true;
		this._lose = {
			djingle: await this._loadSound(`${this._audioLocation}/lose-djingle.mp3`),
			theme: loseAudio,
			themeNode: this._context.createMediaElementSource(loseAudio)
		};
		this._lose.themeNode?.connect(this._masterGainNode);
	}

	private _loadSound = async (url: string) => {
		const response = await fetch(url);
		const arrayBuffer = await response.arrayBuffer();
		return await this._context.decodeAudioData(arrayBuffer);
	}

	//= Public =//

	/**
	 * Play a beeping 8-bit sound
	 */
	public playBeep = () => {
		const osc = this._context.createOscillator();
		osc.type = "sine";
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
		osc.type = "sine";
		osc.frequency.value = 400;
		osc.connect(this._gainNode);
		osc.start();
		osc.stop(this._context.currentTime + 0.1);
	}

	/**
	 * Play the winning jingle.
	 * It will start playing the winning theme after the jingle is done.
	 */
	public playWin = () => {
		const source = this._context.createBufferSource();
		source.buffer = this._win.djingle;
		source.connect(this._gainNode);
		source.addEventListener("ended", () => {
			this.playTheme("win");
		});
		source.start();
	}

	/**
	 * Play the losing jingle.
	 * It will start playing the losing theme after the jingle is done.
	 */
	public playLose = () => {
		const source = this._context.createBufferSource();
		source.buffer = this._lose.djingle;
		source.connect(this._gainNode);
		source.addEventListener("ended", () => {
			this.playTheme("lose");
		});
		source.start();
	}

	/**
	 * Play a theme song for the game.
	 * @param theme The theme to play. Either "lobby", "game", "win" or "lose".
	 */
	public playTheme = (theme: "lobby" | "game" | "win" | "lose") => {
		if (this._currentTheme) {
			this._currentTheme.pause();
		}

		switch (theme) {
			case "lobby":
				this._currentTheme = this._lobbyTheme;
				break;
			case "game":
				this._currentTheme = this._gameTheme;
				break;
			case "win":
				this._currentTheme = this._win.theme;
				break;
			case "lose":
				this._currentTheme = this._lose.theme;
				break;
		}

		try {
			this._currentTheme!.currentTime = 0; // Start playing from the beginning
			this._currentTheme!.play();
		}
		catch (e) {
			// We do not care if the theme fails to play
			// Usually it's just a "The play() request was interrupted by a call to pause() which is utter bullshit"
		}
	}

	/**
	 * Resume the currently playing theme.
	 * @returns True if the theme was resumed, false if there was no theme playing.
	 */
	public resumeTheme = (): boolean => {
		try {
			if (this._currentTheme) {
				this._currentTheme.play();
				return true;
			}
			return false;
		}
		catch (e) {
			// We do not care if the theme fails to play
			// Usually it's just a "The play() request was interrupted by a call to pause() which is utter bullshit"
			return false;
		}
	}

	/**
	 * Pause playing the current theme.
	 * @returns True if a theme was stopped, false if otherwise.
	 */
	public pauseTheme = (): boolean => {
		if (this._currentTheme) {
			this._currentTheme.pause();
			return true;
		}
		return false;
	}

	/**
	 * Stop playing the current theme.
	 */
	public stopTheme = () => {
		if (this._currentTheme) {
			this._currentTheme.pause();
			this._currentTheme.currentTime = 0;
			this._currentTheme = null;
		}
	}

	/**
	 * Get the current theme.
	 */
	public getTheme = () => {
		return (this._currentTheme ? this._currentTheme.src : null);
	}

	/**
	 * Check if the current theme is paused.
	 * @returns True if the current theme is paused or no theme is playing.
	 */
	public themeIsPaused = (): boolean => {
		return (this._currentTheme ? this._currentTheme.paused: true);
	}

	/**
	 * Get the current time of the theme.
	 */
	public getThemeTime = (): number => {
		return this._currentTheme ? this._currentTheme.currentTime : 0;
	}

	/**
	 * Set the current time of the theme.
	 * @param time The time to set the theme to.
	 * @returns True if the theme was set, false if no theme is playing.
	 */
	public setThemeTime = (time: number) => {
		if (this._currentTheme) {
			this._currentTheme.currentTime = time;
			return true;
		}
		return false;
	}

	public muteSound = () => {
		this._soundMuted = !this._soundMuted;
		this._masterGainNode.gain.value = this._soundMuted ? 0.0 : 1.0;
		return this._soundMuted;
	}

}

export default GameSoundEngine;
