
import { Global, Module } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './2fa.service';

@Global()
@Module({
  providers: [TwoFactorAuthenticationService],
  exports: [TwoFactorAuthenticationService],
})
export class TwoFactorAuthenticationModule {}