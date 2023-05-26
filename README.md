This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install dependencies and run the development server:

```bash
pnpm i
pnpm dev
```

Check your Next app runs locally.

## SST

This app uses SST. SST is a framework built on top of CDK. It has a nice NextJSApp construct which makes it easy to deploy NextJS apps to AWS (Cloudfront and S3). It uses `open-next` under the hood. 

Update your serverless stack in `sst.config.ts`. Especially the config object. Mine probably wont work for you. Here I use a previously bootstraped by cdk stack. You can remove the cdk object if you don't have a cdk stack already in your account.

```typescript
name: "project-name",
region: "eu-west-2",
cdk: {
qualifier: "randomQualifier",
fileAssetsBucketName: "someBucketName",
}
```

Make sure you have valid AWS credentials (I like Leapp to manage my AWS credentials)
Then run the server:

```bash
pnpm sst dev
```

SST may need to bootstrap your account.

Deploy to prod with:

```bash
pnpm sst deploy --stage prod
```

## SSR

SST lets you to use SSR natively in your normal frontend code using `getServerSideProps` (as Vercel does) eg:

```typescript
export async function getServerSideProps() {
  const command = new PutObjectCommand({
    ACL: "public-read",
    Key: crypto.randomUUID(),
    Bucket: Bucket.public.bucketName,
  });
  const url = await getSignedUrl(new S3Client({}), command);

  return { props: { url } };
}
```