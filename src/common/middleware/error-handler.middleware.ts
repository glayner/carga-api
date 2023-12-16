import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import AppError from "../errors/app-error.js";

export default async (
  err: Error,
  request: Request,
  response: Response,
  _: NextFunction
): Promise<Response> => {
  if (err instanceof AppError) {
    return response
      .status(err.statusCode || 400)
      .json({ code: err.code, texto: err.message });
  }

  if (err instanceof z.ZodError) {
    return response.status(400).json({
      code: 400,
      message: "Erro de validação",
      errors: err.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    });
  }

  return response.status(500).json({
    code: 999,
    texto: err.message,
  });
};
