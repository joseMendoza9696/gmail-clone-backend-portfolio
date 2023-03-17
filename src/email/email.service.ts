import { Injectable } from '@nestjs/common';
// DTO
import { EmailCreate, DecodedToken } from './dto/email.dto';
// GRAPHQL
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GraphQLError } from 'graphql';
// SCHEMAS
import { Email } from 'src/mongodb/schemas/emails.schema';
import { User } from 'src/mongodb/schemas/users.schema';
// UTILS
import { pubSub } from 'src/constants';

@Injectable()
export class EmailService {
  constructor(
    @InjectModel(Email.name) private emailModel: Model<Email>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createEmail(
    email: EmailCreate,
    decodedToken: DecodedToken,
  ): Promise<string | GraphQLError> {
    try {
      // we verify if receiver's email exists
      const receiverExists = await this.userModel.exists({
        email: email.to,
      });

      if (!receiverExists) {
        throw new Error('Email not found');
      }

      // save the new email
      const newEmail = await new this.emailModel({
        to: email.to,
        body: email.body,
        subject: email.subject,
        from: decodedToken.id,
        createdAt: new Date(),
      }).save();
      const response = await newEmail.populate('from');

      // notify the receiver
      await pubSub.publish('EMAIL_newReceivedEmail', {
        emailId: email.to,
        email: response,
      });

      return 'email sent!';
    } catch (error) {
      return new GraphQLError(error, error.extensions);
    }
  }

  async emailsReceived(
    decodedToken: DecodedToken,
  ): Promise<Email[] | GraphQLError> {
    try {
      const emails = await this.emailModel
        .find({
          to: decodedToken.email,
          trash: false,
        })
        .sort({ createdAt: 'desc' })
        .populate('from');

      return emails;
    } catch (error) {
      return new GraphQLError(error, error.extensions);
    }
  }

  async emailsSent(
    decodedToken: DecodedToken,
  ): Promise<Email[] | GraphQLError> {
    try {
      const emails = await this.emailModel
        .find({
          from: decodedToken.id,
          trash: false,
        })
        .sort({ createdAt: 'desc' })
        .populate('from');
      return emails;
    } catch (error) {
      return new GraphQLError(error, error.extensions);
    }
  }

  async moveTrashEmail(emailId: string): Promise<string | GraphQLError> {
    try {
      await this.emailModel.findByIdAndUpdate(emailId, { trash: true });
      return 'email moved to trash';
    } catch (error) {
      return new GraphQLError(error, error.extensions);
    }
  }

  async emailsTrash(
    decodedToken: DecodedToken,
  ): Promise<Email[] | GraphQLError> {
    try {
      const emailsInTrash = await this.emailModel
        .find({
          to: decodedToken.email,
          trash: true,
        })
        .sort({ createdAt: 'desc' })
        .populate('from');

      return emailsInTrash;
    } catch (error) {
      return new GraphQLError(error, error.extensions);
    }
  }

  async readEmail(emailId: string) {
    try {
      await this.emailModel.findByIdAndUpdate(emailId, { read: true });
      return 'email read';
    } catch (error) {
      return new GraphQLError(error, error.extensions);
    }
  }
}
