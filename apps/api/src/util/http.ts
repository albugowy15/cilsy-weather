import { type Request } from "express";

export interface TypedRequest<T> extends Request {
  body: T;
}

export type ApiResponse<T, E> = {
  success: boolean;
  data?: T;
  error?: E;
};

export function successRes<T>(data?: T): ApiResponse<T, unknown> {
  return {
    success: true,
    data,
  };
}

export function errorRes<E>(error?: E): ApiResponse<unknown, E> {
  return {
    success: false,
    error,
  };
}
