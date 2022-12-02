import { Injectable, Inject } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service';

/*==========================================================================*/

@Injectable()
export class FriendsService {

	@Inject(PrismaService)
	private readonly prismaService: PrismaService;

	//for some fucking reason this doesnt cascade so i have to update for both sides
	async addFriend(userName:string, friendName:string) {
		await this.prismaService.user.update({
			where: {intraName: userName},
			data: {
				friends: {
					connect: {
						intraName: friendName
					}
				}
			}
		});

		await this.prismaService.user.update({
			where: {intraName: friendName},
			data: {
				friends: {
					connect: {
						intraName: userName
					}
				}
			}
		});
	}


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

		await this.prismaService.user.update({
			where: {intraName: friendName},
			data: {
				friends: {
					disconnect: {
						intraName: userName
					}
				}
			}
		});
	}

	async blockUser(userName:string, blockUser:string) {
		await this.prismaService.user.update({
			where: { intraName: userName },
			data: {
				blocked: {
					connect: {
						intraName: blockUser
					}
				}
			}
		});

		await this.prismaService.user.update({
			where: { intraName: blockUser },
			data: {
				blocked: {
					connect: {
						intraName: userName
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

		await this.prismaService.user.update({
			where: { intraName: unBlockUser },
			data: {
				blocked: {
					disconnect: {
						intraName: userName
					}
				}
			}
		});
	}

}
