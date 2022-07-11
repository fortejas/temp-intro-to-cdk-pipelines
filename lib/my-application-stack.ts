import { Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { Construct } from 'constructs';

interface MyApplicationStageProps extends StageProps {
  name: string
}

interface MyApplicationStackProps extends StackProps {
  name: string
}

export class MyApplicationStage extends Stage {
  constructor(scope: Construct, id: string, props: MyApplicationStageProps) {
    super(scope, id, props)

    new MyApplicationStack(this, 'MyApplication', { name: props.name })
  }
}

export class MyApplicationStack extends Stack {
  constructor(scope: Construct, id: string, props: MyApplicationStackProps) {
    super(scope, id, props);

    /**
     * Define our CDK Application
     */

    // Define the VPC where my application will live
    const vpc = new Vpc(this, 'Vpc', { maxAzs: 3 })

    // Define the ECS cluster where we can place services
    const cluster = new Cluster(this, 'Cluster', { vpc, clusterName: props?.name })

    // Define our service
    new ApplicationLoadBalancedFargateService(this, 'Service', {
      cluster,
      taskImageOptions: { image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample') },
      desiredCount: 1,
      publicLoadBalancer: true
    })

  }
}
