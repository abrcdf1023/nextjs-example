export default function s3Url(path: string) {
  return `${process.env.NEXT_PUBLIC_S3_URL}/${path}`;
}
