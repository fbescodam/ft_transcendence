import { AppService } from './app.service';
import { Controller, Get } from '@nestjs/common';

/*==========================================================================*/

//NOTE: Useless file since im serving the static index page in socket-client for testing, keeping it here for example

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) { }

	@Get()
	public getHello(): string {
		return this.appService.getHello();
	}
}

/*==========================================================================*/
