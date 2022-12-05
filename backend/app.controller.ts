import { AppService } from './app.service';
import { Controller, Logger, Req, All, Res, Body, UseInterceptors, UploadedFile,  } from '@nestjs/common';
import { Response, Request } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import * as fs from 'fs';
import * as JWT from "jsonwebtoken";
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';



/*==========================================================================*/

@Controller()
export class AppController {
	constructor(private readonly appService: AppService,
				private readonly prismaService: PrismaService) { }

	private readonly logger = new Logger("httpStuff")

	public async validateUser(payload: any | JWT.JwtPayload) {

		try {
			const user = await this.prismaService.user.findFirst({
				where: {
					intraName: payload["intraName"]
				}
			})
			return user
		}
		catch(err){
			throw new Error("failed to acces the database")
		}

	}

	@All('/avatar')
	@UseInterceptors(FileInterceptor('file'))
	async createOrUpdateUser(@Req() req: Request, @Res() res: Response, @UploadedFile() file: Express.Multer.File) {
		if (req.method == 'POST')
		{
			const jwt = req.headers.authorization.replace('Bearer ', '');
			const jwtPayload = JWT.verify(jwt, process.env.JWT_SECRET);
			const user: User = await this.validateUser(jwtPayload);
			if (user == null)
				return { error: "Unauthorized" };

			this.logger.log(`User: ${user.intraId} is trying to change avatar.`);

			if (!await this.prismaService.user.count({ where: { intraId: user.intraId }}))
				return { error: "User does not exist" };

			if (!file.mimetype.startsWith('image/'))
				return { error: "File is not an image" };

			const avatarFile = `avatars/${user.intraId}`;
			const fileStream = fs.createWriteStream(`static/${avatarFile}`);
			fileStream.on("error", (err) => {
				this.logger.error(err);
				return { error: "Failed to write file: " + err.toString() };
			});
			fileStream.write(Buffer.from(file.buffer), () => {
				this.logger.log(`User: ${user.intraId} changed avatar.`);
				res.status(200).send({ status: "avatar changed" });
			});
		}
		return { error: "method not supported" };
	}
}

/*==========================================================================*/
