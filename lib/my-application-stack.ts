import { CfnOutput, Stack, StackProps, Stage, StageProps } from 'aws-cdk-lib';
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

  loadBalancerAddr : CfnOutput

  constructor(scope: Construct, id: string, props: MyApplicationStageProps) {

    super(scope, id, props)

    const app = new MyApplicationStack(this, 'MyApplication', { name: props.name })

    this.loadBalancerAddr = app.loadBalancerAddr

  }
}

export class MyApplicationStack extends Stack {

  loadBalancerAddr : CfnOutput

  constructor(scope: Construct, id: string, props: MyApplicationStackProps) {
    super(scope, id, props);

    /**
     * Define our CDK Application
     */

    // Define the VPC where my application will live
    const vpc = new Vpc(this, 'Vpc', { maxAzs: 2 })

    // Define the ECS cluster where we can place services
    const cluster = new Cluster(this, 'Cluster', { vpc, clusterName: props?.name })

    // Define our service
    const app = new ApplicationLoadBalancedFargateService(this, 'Service', {
      cluster,
      taskImageOptions: { image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample') },
      desiredCount: 1,
      publicLoadBalancer: true
    })

    this.loadBalancerAddr = new CfnOutput(this, 'LBAddress', {
      value: `http://${app.loadBalancer.loadBalancerDnsName}`
    })

  }
}
