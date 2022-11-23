import { Inject, Injectable, Logger } from '@nestjs/common';
import { toFileStream, toString } from 'qrcode';
import { authenticator } from 'otplib';
import { PrismaService } from 'prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class TwoFactorAuthenticationService {
  
  @Inject(PrismaService)
	private readonly prismaService: PrismaService;

	private readonly logger = new Logger("tfaAuth");

  public async generateTwoFactorAuthenticationSecret(user: User) {
    
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.intraName, "ft_transcendance", secret);
    
    const penis = await this.prismaService.user.update({
      where: {
        intraName: user.intraName
      },
      data: {
        tfaSecret: secret 
      }
    })

    return {
      user,
      secret,
      otpauthUrl
    }
  }

  public async pipeQrCodeStream(otpauthUrl: string) { //TODO: this is kinda cringe
    return toString(otpauthUrl);
  }

  public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
    
    this.logger.log(`\ntfaCode: ${twoFactorAuthenticationCode}\nsecret: ${user.tfaSecret}`)
    return authenticator.verify({token: twoFactorAuthenticationCode, secret: user.tfaSecret})
  }
}
