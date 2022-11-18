import { AppService } from './app.service';
import { Controller } from '@nestjs/common';

/*==========================================================================*/

//NOTE: Useless file since im serving the static index page in socket-client for testing, keeping it here for example

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) { }
}

/*==========================================================================*/
