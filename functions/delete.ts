import {
  S3Client,
  DeleteObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";

import { Bucket } from "sst/node/bucket";

export async function handler() {
  const client = new S3Client({});

  const list = await client.send(
    new ListObjectsCommand({
      Bucket: Bucket.public.bucketName,
    })
  );

  await Promise.all(
    (list.Contents || []).map((file) =>
      client.send(
        new DeleteObjectCommand({
          Key: file.Key,
          Bucket: Bucket.public.bucketName,
        })
      )
    )
  );
}
