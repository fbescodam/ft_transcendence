import type { User } from "../Types";

export const createPlaceholderUser = (intraName: string, name: string, avatar: string | null = null, currentURL: URL | null = null): User => {
	if (avatar != null && currentURL == null) {
		throw new Error("If avatar is not null, currentURL must be set");
	}
	return {
		id: 999999999999,
		wins: 0,
		loss: 0,
		name: name,
		intraName: intraName,
		avatar: (avatar ? `${currentURL!.protocol}//${currentURL!.hostname}:3000/${avatar}` : "https://picsum.photos/200"),
		games: [],
		friends: [],
	};
}
