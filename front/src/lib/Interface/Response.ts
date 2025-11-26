export interface ResponseDto<T> {
  data: T | null
  error: string | null
  statusCode: number
}