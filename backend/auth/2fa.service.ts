import { Inject, Injectable, Logger } from '@nestjs/common';
import { toDataURL } from 'qrcode';
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
    
    const newUser = await this.prismaService.user.update({
      where: {
        intraName: user.intraName
      },
      data: {
        tfaSecret: secret 
      }
    })

    return {
      newUser,
      secret,
      otpauthUrl
    }
  }

  public async pipeQrCodeStream(otpauthUrl: string) {
    var opts = {
      errorCorrectionLevel: 'H',
      type: 'image/jpeg',
      quality: 0.3,
      margin: 1,
      color: {
        dark:"#010599FF",
        light:"#FFBF60FF"
      } //Change these values to change the look of the qrcode
    }
    
    return toDataURL(otpauthUrl, opts);
  }

  public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
    
    this.logger.log(`\ntfaCode: ${twoFactorAuthenticationCode}\nsecret: ${user.tfaSecret}`)
    return authenticator.verify({token: twoFactorAuthenticationCode, secret: user.tfaSecret})
  }
}
