---
title: "EC2 Instance Connect meets AWS Session Manager via SSH"
date: 2019-07-25
excerpt: "Access ec2 instances via ssh without having to distribute ssh keys"
permalink: "blog/aws-ecs-instance-connect-meets-aws-session-manager/"
tags:
    - blog
    - aws
---

[EC2 Instance Connect](https://aws.amazon.com/about-aws/whats-new/2019/06/introducing-amazon-ec2-instance-connect/) meets [AWS Session Manager via SSH](https://aws.amazon.com/about-aws/whats-new/2019/07/session-manager-launches-tunneling-support-for-ssh-and-scp/)

Both things have been introduced recently, and let you access even private ec2 instances

1. Without VPN
1. No open SSH port
1. Authentication / Authorization is fully delegated to IAM

```
# Assumes valid AWS Credentials in ENV
ssh -v ec2-user@i-002afb820244e392f
```
What this will do (through the `aws-proxy` script below):

- Generate a single use ssh key
- Push the generated publich key to AWS for the given user of the provided ec2 instance id
- Adds the private key to the ssh agent
- Create a tunnel through Session Manager
- Establish an SSH session

The host has to be configured to run:

- SSM Agent
- ec2-instance-connect

Locally, you'll have to have a recent version of the AWS cli and the [SSM plugin](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html)

{% gist "https://gist.github.com/skorfmann/24169f8e8d4a2aa036f959e8337d5747", "aws-proxy" %}

{% gist "https://gist.github.com/skorfmann/24169f8e8d4a2aa036f959e8337d5747", "ssh_config" %}