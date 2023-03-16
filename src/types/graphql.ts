
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class EmailCreate {
    to: string;
    body: string;
    subject: string;
}

export class AuthUser {
    email: string;
    password: string;
}

export class User {
    email: string;
}

export class Email {
    _id: string;
    to: string;
    body: string;
    subject: string;
    from: User;
}

export abstract class IMutation {
    abstract EMAIL_create(email: EmailCreate): string | Promise<string>;

    abstract USER_login(login: AuthUser): Auth | Promise<Auth>;

    abstract USER_register(register: AuthUser): Auth | Promise<Auth>;
}

export abstract class IQuery {
    abstract EMAIL_listReceived(): Nullable<Email>[] | Promise<Nullable<Email>[]>;

    abstract EMAIL_listSent(): Nullable<Email>[] | Promise<Nullable<Email>[]>;
}

export abstract class ISubscription {
    abstract EMAIL_newReceivedEmail(token: string): Email | Promise<Email>;
}

export class Auth {
    token: string;
}

type Nullable<T> = T | null;
