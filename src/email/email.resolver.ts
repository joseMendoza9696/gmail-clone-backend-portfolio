import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  Subscription,
} from '@nestjs/graphql';
// UTILS
import { AuthService } from 'src/utils/auth.service';
import { EmailService } from './email.service';
// GUARDS
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/utils/auth.guard';
// DTO
import { EmailCreate } from './dto/email.dto';
// CONSTANTS
import { pubSub } from 'src/constants';

@Resolver()
export class EmailResolver {
  constructor(
    private emailService: EmailService,
    private authService: AuthService,
  ) {}
  // MUTATIONS
  @Mutation('EMAIL_create')
  @UseGuards(AuthGuard)
  async createEmail(
    @Context() context: any,
    @Args('email') email: EmailCreate,
  ) {
    const decodedToken = this.authService.verifyToken(
      context.req.headers['authorization'].slice(7),
    );
    return this.emailService.createEmail(email, decodedToken);
  }

  @Mutation('EMAIL_moveTrashEmail')
  @UseGuards(AuthGuard)
  async moveTrashEmail(@Args('emailId') emailId: string) {
    return this.emailService.moveTrashEmail(emailId);
  }

  @Mutation('EMAIL_readEmail')
  @UseGuards(AuthGuard)
  async readEmail(@Args('emailId') emailId: string) {
    return this.emailService.readEmail(emailId);
  }

  // QUERIES
  @Query('EMAIL_listReceived')
  @UseGuards(AuthGuard)
  async emailsReceived(@Context() context: any) {
    const decodedToken = this.authService.verifyToken(
      context.req.headers['authorization'].slice(7),
    );
    return this.emailService.emailsReceived(decodedToken);
  }

  @Query('EMAIL_listSent')
  @UseGuards(AuthGuard)
  async emailsSent(@Context() context: any) {
    const decodedToken = this.authService.verifyToken(
      context.req.headers['authorization'].slice(7),
    );
    return this.emailService.emailsSent(decodedToken);
  }

  @Query('EMAIL_listTrash')
  @UseGuards(AuthGuard)
  async emailsTrash(@Context() context: any) {
    const decodedToken = this.authService.verifyToken(
      context.req.headers['authorization'].slice(7),
    );
    return this.emailService.emailsTrash(decodedToken);
  }

  // SUBSCRIPTIONS
  @Subscription('EMAIL_newReceivedEmail', {
    filter(payload, variables) {
      const e = this.authService.verifyToken(variables.token);
      const emailId = e.email;
      return payload.emailId === emailId;
    },
    resolve: (payload) => {
      return payload.email;
    },
  })
  newReceivedEmail() {
    return pubSub.asyncIterator('EMAIL_newReceivedEmail');
  }
}
