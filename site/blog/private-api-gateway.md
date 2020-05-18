---
title: "Private API Gateway with the AWS CDK "
date: 2020-01-22
excerpt: "Setup an private API Gateway with the AWS Cloud Development Kit (CDK)"
permalink: "blog/private-api-gateway-with-the-aws-cdk/"
tags:
    - blog
    - aws-cdk
    - cdk
    - aws
---

## Private API Gateway with the AWS CDK

- Lambda
- Private Api Gateway
- VPC Endpoint

NB: In order to access the Api Gateway through the public DNS of the VPC endpoint, a curl request has to have the api id as header. See also [here](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html)

```
curl -i -H "x-apigw-api-id: <api-id>" https://vpce-<vpce-id>.execute-api.<region>.vpce.amazonaws.com/
```

{% gist "https://gist.github.com/skorfmann/6941326b2dd75f52cb67e1853c5f8601", "stack.ts" %}