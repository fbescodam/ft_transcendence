export type Vec2 = { x: number, y: number };
export type Direction = number;
export type Dimensions = { w: number, h: number };

export interface User {
	id: number;
	intraId: number;
	intraName: string;
	name: string;
	avatar: string;
}
