import { Injectable } from '@nestjs/common';
import { PrivyClient } from '@privy-io/server-auth';
import { PrivyModuleOptions } from './types/privy.types';

@Injectable()
export class PrivyService {
  public readonly client: PrivyClient;
  public readonly jwksEndpoint?: string;
  private readonly applicationId: string;
  private readonly secret: string;

  constructor(options: PrivyModuleOptions) {
    this.applicationId = 'cmhbrlmzo011iju0ch3rf1a2s';
    this.secret = 'QyQB4FKpcWCZbBCnSyrc11Fv9bFmoGKNjFcvtuiTkBSFyrL8U2EqNpRC7mPuDyJ1BKjWPkorwM783TC8sHQK2B4';
    this.jwksEndpoint = options.jwksEndpoint;

    this.client = new PrivyClient(this.applicationId, this.secret);
  }
}
