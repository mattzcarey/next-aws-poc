import { SSTConfig } from "sst";
import { NextjsSite, Bucket, Cron } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "next-sst-poc",
      region: "eu-west-2",
      cdk: {
        qualifier: "hnb659fad",
        fileAssetsBucketName: "cdk-hnb659fad-assets-469147938340-eu-west-2",
      },
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const bucket = new Bucket(stack, "public");
      const site = new NextjsSite(stack, "site", {
        bind: [bucket],
      });

      new Cron(stack, "cron", {
        schedule: "rate(1 day)",
        job: {
          function: {
            bind: [bucket],
            handler: "functions/delete.handler",
          },
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
