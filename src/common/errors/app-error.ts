class AppError {
  public readonly code: string | number;

  public readonly message: string;

  public readonly statusCode: number;

  public readonly obj?: object;

  constructor(
    code: string | number,
    message: string,
    obj?: object,
    statusCode = 400,
  ) {
    this.code = code;
    this.message = message;
    this.statusCode = statusCode;
    if (obj) this.obj = obj;
  }
}

export default AppError;
