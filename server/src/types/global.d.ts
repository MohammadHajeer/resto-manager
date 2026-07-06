import type { Request } from "express";

export type AuthUser = {
  id: string;
  role?: string;
};

declare global {
  type AuthedRequest<
    Params = Record<string, string>,
    ResBody = unknown,
    ReqBody = unknown,
    ReqQuery = Record<string, unknown>,
  > = Request<Params, ResBody, ReqBody, ReqQuery> & {
    auth?: {
      user: AuthUser;
    };
  };
}
