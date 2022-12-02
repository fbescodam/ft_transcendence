import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';


/*==========================================================================*/

@Injectable()
export class AppService {

	public async hashPassword(password: string) {

		const saltRounds = 10;
		const salt = await bcrypt.genSalt(saltRounds)
		const hash = await bcrypt.hash(password, salt)

		return hash;
	}

	public async comparePassword(passwordHash: string, userInput:string) {
		
		let res;
		await bcrypt.compare(userInput, passwordHash, function(err, result) {
			res = result
		});
		return res
	}

}
