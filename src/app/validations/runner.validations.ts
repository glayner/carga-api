import { NextFunction, Request, Response } from "express";
import { z } from "zod";
const methodArray = [
  "get",
  "post",
  "patch",
  "put",
  "delete",
  "acl",
  "bind",
  "checkout",
  "connect",
  "copy",
  "head",
  "link",
  "lock",
  "m-search",
  "merge",
  "mkactivity",
  "mkcalendar",
  "mkcol",
  "move",
  "notify",
  "options",
  "propfind",
  "proppatch",
  "purge",
  "report",
  "search",
  "source",
  "subscribe",
  "rebind",
  "trace",
  "unbind",
  "unlink",
  "unlock",
  "unsubscribe",
  "GET",
  "POST",
  "PATCH",
  "PUT",
  "DELETE",
  "ACL",
  "BIND",
  "CHECKOUT",
  "CONNECT",
  "COPY",
  "HEAD",
  "LINK",
  "LOCK",
  "M-SEARCH",
  "MERGE",
  "MKACTIVITY",
  "MKCALENDAR",
  "MKCOL",
  "MOVE",
  "NOTIFY",
  "OPTIONS",
  "PROPFIND",
  "PROPPATCH",
  "PURGE",
  "REPORT",
  "SEARCH",
  "SOURCE",
  "SUBSCRIBE",
  "REBIND",
  "TRACE",
  "UNBIND",
  "UNLINK",
  "UNLOCK",
  "UNSUBSCRIBE",
] as const;

const requestSchemaData = {
  url: z.string(),
  method: z
    .enum(methodArray, {
      invalid_type_error: "Você deve informar um método válido",
      required_error: "Você deve informar um método",
    })
    .transform((val) => val.toLocaleUpperCase())
    .default("GET"),
  headers: z
    .record(z.string())
    .optional()
    .default({ "content-type": "application/json" }),
  body: z.record(z.string()).optional(),
};

const PreAndPosRequestSchema = z.object({
  request: z
    .object({
      ...requestSchemaData,
    })
    .strict(),
  environment: z
    .array(
      z
        .object({
          nome: z.string(),
          campo: z.string(),
        })
        .strict()
    )
    .optional(),
});

const LoadRequestSchema = z.object({
  ...requestSchemaData,
  socketPath: z.string().optional(),
  workers: z.number().optional(),
  connections: z.number().optional().default(10),
  duration: z.number().or(z.string()).optional(),
  amount: z.number().optional(),
  timeout: z.number().optional().default(10),
  pipelining: z.number().optional().default(1),
  bailout: z.number().optional(),
  title: z.string().optional(),
  maxConnectionRequests: z.number().optional(),
  maxOverallRequests: z.number().optional(),
  connectionRate: z.number().optional(),
  overallRate: z.number().optional(),
  ignoreCoordinatedOmission: z.boolean().optional(),
  reconnectRate: z.number().optional(),
  excludeErrorStats: z.boolean().optional(),
  skipAggregateResult: z.boolean().optional(),
});

export const RunnerAutocannonSchema = z
  .object({
    preRequest: z.array(PreAndPosRequestSchema.optional()),
    testeDeCarga: LoadRequestSchema.strict(),
    posRequest: z.array(PreAndPosRequestSchema.optional()),
    namespace: z.string(),
    versao: z.string(),
    cenario: z.string().optional(),
  })
  .strict();

const SearchResultQuerySchema = z.object({
  namespace: z.string().optional(),
  versao: z.string().optional(),
  cenario: z.string().optional(),
  antesDe: z.string().datetime().optional(),
  depoisDe: z.string().datetime().optional(),
});

const GetResultParamSchema = z.object({
  keyReq: z.string(),
  namespace: z.string(),
  versao: z.string(),
  cenario: z.string().optional(),
});

export type RunnerLoadTestBody = z.infer<typeof RunnerAutocannonSchema>;
export type LoadTestExecute = z.infer<typeof LoadRequestSchema>;
export type RequestEngine = z.infer<typeof PreAndPosRequestSchema>;
export type QuerySearchResultLoadTest = z.infer<typeof SearchResultQuerySchema>;
export type ParamGetResultLoadTest = z.infer<typeof GetResultParamSchema>;

export const validateRunnerLoadTest = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const data = RunnerAutocannonSchema.parse(request.body);

  request.body = data;

  next();
};

export const validateGetResultRunnerLoadTest = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const params = GetResultParamSchema.parse(request.params);

  request.params = params;

  next();
};

export const validateSearchResultRunnerLoadTest = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const query = SearchResultQuerySchema.parse(request.query);

  request.query = query;

  next();
};
