---
title: "Introducing Terrastack: Polyglot Terraform supercharged by the CDK"
date: 2020-03-12
excerpt: "Terrastack enables you to keep using Terraform as engine, while defining your resources in actual programming languages such as Typescript, Python, Java or C#"
tags:
    - blog
    - terraform
---

Terrastack enables you to keep using [Terraform](https://terraform.io) as engine, while defining your resources in actual programming languages such as Typescript, Python, Java or C# - with more to come (perhaps [Ruby](https://github.com/aws/jsii/issues/144)?).

This is made possible by the [Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) and [jsii](https://github.com/aws/jsii/) for generating the polyglot libraries. While the major use-case for the CDK is generating Cloudformation configuration as YAML, it's capable of generating pretty much any configuration.

The actual idea of going forward with Terrastack was inspired by yet another project which leverages the CDK / jsii combo to generate Kubernetes configuration: [cdk8s](https://github.com/awslabs/cdk8s). When I saw that project, I eventually realized that the CDK could be useful for more scenarios than just generating Cloudformation YAML.

A first quick prototype was up and running in roughly two evenings. While not all types were properly generated, it was able to generate a simple but working Terraform configuration.

{% twitter "1235298514646773760" %}

The general workflow is:

- Generate a [JSON schema](https://www.terraform.io/docs/commands/providers/schema.html) for a given Terraform provider (e.g. AWS or Google Cloud) with builtin Terraform command
- Use this schema as input for a Typescript generator, to generate classes for each Resource and Data type of that provider
- Compile polyglot libraries from these generated Typescript classes via jsii
- Define your Cloud resources in your prefered language
- Generate [Terraform compatible JSON](https://www.terraform.io/docs/configuration/syntax-json.html) and use it as you would any other HCL based Terraform project

When looking at these steps, that's pretty much what the CDK team does for Cloudformation. Since Terraform and Cloudformation are both declarative, it's conceptually pretty close. This makes Terraform a perfect contender for getting "CDKified".

Similar to the CDK, that's how a simple Terrastack looks like right now
{% gist "https://gist.github.com/skorfmann/d70337b2d5089884aa40e5467e89217b", "stack.ts" %}

## Background

Finishing up an on premise -> AWS migration utilising Terraform, here are the pain points we've hit on a regular basis over the last two years:

- Refactoring is hard - Unless you love digging around in JSON state files
- Lack of good dependency management
- Most of the product teams, don't actually want to learn a new syntax like HCL.
- Terraform Modules are a primitive way to share code. Want to dynamically adapt its definition? Good luck with that.
- Code Distribution becomes complex in larger organisations
- Ensuring certain configuration standards (think of Tagging, Object Storage / VM configurations)
- Git Ops with small components to separate state is more complex than it should be
- Established Software Engineering practices like unit / integration tests are hard to implement
- HCL / Terraform integration in code editors such as VS Code is poor and mostly broke for us with Terraform 0.12

Terrastack tackles all of the above by leveraging existing technologies:

- The Javascript ecosystem
- [Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/)
- [jsii](https://github.com/aws/jsii/) for polyglot libraries

The engine of Terraform and its providers are quite good overall. From my point of view, most of the issues are stemming from the rather static and declarative nature of Terraform.

With Terrastack we can start to treat "raw" Terraform configuration as an "assembly" artifact which we can generate in a predictable way. This enables us to tackle most of the pain points above:

- Use existing, well established dependency management like NPM or Yarn
- Leverage mono repo / build tooling in the respective programming language
- Build upon existing testing frameworks for unit and integration tests
- Enjoy intellisense of your favourite language in whatever editor you're using right now
- Create commonly shared packages of cloud solutions for internal, or even public usage.
- Share code which is aimed at the AWS CDK (e.g. Tags, IAM Policies, ECS Task Definitions, Kubernetes config?)

I'm still thinking about the refactoring part. My current conclusion is, that there are mainly two things are getting in the way of proper refactorings:

- Static naming of resources
- Terraform modules aka namespaces

I strongly believe, that we can come up with a better concept in Terrastack. But that's for another blog post.

## Summary

From the initial very rough prototype, it took about a week to release a bit more polished prototype on Github.

{% twitter "1237848600354254849" %}

{% github "TerraStackIO/terrastack" %}

Please check it out and give it a try. I would love to get feedback!

This is the first post of a series regarding Terrastack. In the next post, I'll dive a bit deeper into the internals of the CDK itself and what I've learned about its mechanics so far.