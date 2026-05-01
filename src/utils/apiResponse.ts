import { NextResponse } from 'next/server';

export const ApiResponse = {
  success: (
    data: any,
    message: string = 'Success',
    statusCode: number = 200
  ) => {
    return NextResponse.json(
      {
        status: statusCode,
        message: message,
        data: data,
        errorData: null,
      },
      { status: statusCode }
    );
  },

  error: (
    errorData: any,
    message: string = 'Error',
    statusCode: number = 500
  ) => {
    return NextResponse.json(
      {
        status: statusCode,
        message: message,
        data: null,
        errorData: errorData,
      },
      { status: statusCode }
    );
  },
};
