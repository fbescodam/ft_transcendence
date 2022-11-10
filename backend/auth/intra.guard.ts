import { Injectable, CanActivate } from '@nestjs/common';
const jwt = require('jsonwebtoken');
import { PrismaService } from "prisma/prisma.service";
import { Observable } from 'rxjs';

@Injectable()
export class IntraGuard implements CanActivate {

  constructor(private prismaService: PrismaService) {
  }

  canActivate(context: any): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET) as any;
      return new Promise((resolve, reject) => {
        return this.prismaService.user.findFirst({
			where: {intraName: decoded.username}}).then(user => {
          if (user) {
            resolve(user);
          } else {
            reject(false);
          }
        });

      });
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }
}
