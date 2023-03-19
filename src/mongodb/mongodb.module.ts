import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
// import config from '../config';
// MONGODB SCHEMAS
import { User, UserSchema } from './schemas/users.schema';
import { Email, EmailSchema } from './schemas/emails.schema';
import { MongodbService } from './mongodb.service';

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
      // useFactory: async (configService: ConfigType<typeof config>) => ({
      useFactory: (configService: ConfigService) => ({
        // uri: configService.database.mongo_uri,
        uri:
          configService.get<string>('NODE_ENV') === 'test'
            ? configService.get<string>('MONGODB_URI_TEST')
            : configService.get<string>('MONGODB_URI'),
      }),
      // inject: [config.KEY],
      inject: [ConfigService],
    }),
  ],
  providers: [MongodbService],
  exports: [MongooseModule, MongodbService],
})
export class MongodbModule {}
