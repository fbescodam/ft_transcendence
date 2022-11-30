import { Injectable, Inject } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service';

/*==========================================================================*/

@Injectable()
export class FriendsService {

	@Inject(PrismaService)
	private readonly prismaService: PrismaService;

	async removeFriend(userName:string, friendName:string) {
		await this.prismaService.user.update({
			where: {intraName: userName},
			data: {
				friends: {
					disconnect: {
						intraName: friendName
					}
				}
			}
		});
	}

	async unBlockUser(userName:string, unBlockUser:string) {
		await this.prismaService.user.update({
			where: { intraName: userName },
			data: {
				blocked: {
					disconnect: {
						intraName: unBlockUser
					}
				}
			}
		});
	}

}
