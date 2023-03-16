import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import config from '../config';
// MONGODB SCHEMAS
import { User, UserSchema } from './schemas/users.schema';
import { Email, EmailSchema } from './schemas/emails.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Email.name,
        schema: EmailSchema,
      },
    ]),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigType<typeof config>) => ({
        uri: configService.database.mongo_uri,
      }),
      inject: [config.KEY],
    }),
  ],
  exports: [MongooseModule],
})
export class MongodbModule {}
