
////////////////////////////////////////////////////////////////////////////////

export class Vec2 {

	public x: number;
	public y: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

////////////////////////////////////////////////////////////////////////////////

	/**
	 * Adds two vectors.
	 * @param b The right hand vector.
	 * @returns The two vectors added.
	 */
	public add(b: Vec2): Vec2 {
		this.x + b.x;
		this.y + b.y;
		return (this);
	}

	/**
	 * Subtracts two vectors.
	 * @param b The right hand vector.
	 * @returns The two vectors subtracted.
	 */
	public sub(b: Vec2): Vec2 {
		this.x - b.x;
		this.y - b.y;
		return (this);
	}
 
	/**
	 * Multiplies two vectors.
	 * @param b The right hand vector.
	 * @returns The two vectors multiplied.
	 */
	public mul(b: Vec2): Vec2 {
		this.x * b.x;
		this.y * b.y;
		return (this);
	}

////////////////////////////////////////////////////////////////////////////////

	/**
	 * Adds two vectors.
	 * @param a The left hand vector.
	 * @param b The right hand vector.
	 * @returns The two vectors added.
	 */
	 public static add(a: Vec2, b: Vec2): Vec2 {
		return (new Vec2(a.x + b.x, a.y + b.y));
	}

	/**
	 * Subtracts two vectors.
	 * @param a The left hand vector.
	 * @param b The right hand vector.
	 * @returns The two vectors subtracted.
	 */
	public static sub(a: Vec2, b: Vec2): Vec2 {
		return (new Vec2(a.x - b.x, a.y - b.y));
	}
 
	/**
	 * Multiplies two vectors.
	 * @param a The left hand vector.
	 * @param b The right hand vector.
	 * @returns The two vectors multiplied.
	 */
	public static mul(a: Vec2, b: Vec2): Vec2 {
		return (new Vec2(a.x * b.x, a.y * b.y));
	}

////////////////////////////////////////////////////////////////////////////////

	/**
	 * Adds two vectors.
	 * @param a The left hand vector.
	 * @param b The right hand vector.
	 * @returns The two vectors added.
	 */
	 public static addN(a: Vec2, b: number): Vec2 {
		return (new Vec2(a.x + b, a.y + b));
	}

	/**
	 * Subtracts two vectors.
	 * @param a The left hand vector.
	 * @param b The right hand vector.
	 * @returns The two vectors subtracted.
	 */
	public static subN(a: Vec2, b: number): Vec2 {
		return (new Vec2(a.x - b, a.y - b));
	}
 
	/**
	 * Multiplies two vectors.
	 * @param a The left hand vector.
	 * @param b The right hand vector.
	 * @returns The two vectors multiplied.
	 */
	public static mulN(a: Vec2, b: number): Vec2 {
		return (new Vec2(a.x * b, a.y * b));
	}

////////////////////////////////////////////////////////////////////////////////

	public addN(b: number): Vec2 {
		this.x + b;
		this.y + b;
		return (this);
	}

	public subN(b: number): Vec2 {
		this.x - b;
		this.y - b;
		return (this);
	}

	public mulN(b: number): Vec2 {
		this.x * b;
		this.y * b;
		return (this);
	}
}

////////////////////////////////////////////////////////////////////////////////

export class Vec3 {

	public x: number;
	public y: number;
	public z: number;

	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

////////////////////////////////////////////////////////////////////////////////

	/**
	 * Adds two vectors.
	 * @param b The right hand vector.
	 * @returns The two vectors added.
	 */
	public add(b: Vec3): Vec3 {
		this.x + b.x;
		this.y + b.y;
		this.z + b.z;
		return (this);
	}

	/**
	 * Subtracts two vectors.
	 * @param b The right hand vector.
	 * @returns The two vectors subtracted.
	 */
	public sub(b: Vec3): Vec3 {
		this.x - b.x;
		this.y - b.y;
		this.z - b.z;
		return (this);
	}
 
	/**
	 * Multiplies two vectors.
	 * @param b The right hand vector.
	 * @returns The two vectors multiplied.
	 */
	public mul(b: Vec3): Vec3 {
		this.x * b.x, 
		this.y * b.y, 
		this.z * b.z;
		return (this);
	}

////////////////////////////////////////////////////////////////////////////////

	/**
	 * Adds two vectors.
	 * @param a The left hand vector.
	 * @param b The right hand vector.
	 * @returns The two vectors added.
	 */
	public static add(a: Vec3, b: Vec3): Vec3 {
		return (new Vec3(a.x + b.x, a.y + b.y, a.z + b.z));
	}

	/**
	 * Subtracts two vectors.
	 * @param a The left hand vector.
	 * @param b The right hand vector.
	 * @returns The two vectors subtracted.
	 */
	public static sub(a: Vec3, b: Vec3): Vec3 {
		return (new Vec3(a.x - b.x, a.y - b.y, a.z - b.z));
	}
 
	/**
	 * Multiplies two vectors.
	 * @param a The left hand vector.
	 * @param b The right hand vector.
	 * @returns The two vectors multiplied.
	 */
	public static mul(a: Vec3, b: Vec3): Vec3 {
		return (new Vec3(a.x * b.x, a.y * b.y, a.z * b.z));
	}

////////////////////////////////////////////////////////////////////////////////

	/**
	 * Adds two vectors.
	 * @param a The left hand vector.
	 * @param b The right hand vector.
	 * @returns The two vectors added.
	 */
	 public static addN(a: Vec3, b: number): Vec3 {
		return (new Vec3(a.x + b, a.y + b, a.z + b));
	}

	/**
	 * Subtracts two vectors.
	 * @param a The left hand vector.
	 * @param b The right hand vector.
	 * @returns The two vectors subtracted.
	 */
	public static subN(a: Vec3, b: number): Vec3 {
		return (new Vec3(a.x - b, a.y - b, a.z - b));
	}
 
	/**
	 * Multiplies two vectors.
	 * @param a The left hand vector.
	 * @param b The right hand vector.
	 * @returns The two vectors multiplied.
	 */
	public static mulN(a: Vec3, b: number): Vec3 {
		return (new Vec3(a.x * b, a.y * b, a.z * b));
	}


////////////////////////////////////////////////////////////////////////////////

	public addN(b: number): Vec3 {
		this.x + b;
		this.y + b;
		this.z + b;
		return (this);
	}

	public subN(b: number): Vec3 {
		this.x - b;
		this.y - b;
		this.z - b;
		return (this);
	}

	public mulN(b: number): Vec3 {
		this.x * b;
		this.y * b;
		this.z * b;
		return (this);
	}
}

////////////////////////////////////////////////////////////////////////////////
