import { Stack, StackProps } from "aws-cdk-lib";
import { CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { MyApplicationStage } from "./my-application-stack";


export class MyApplicationPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        /**
         * Adding the pipeline to our source code.
         */
        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'MyApplicationPipeline',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.connection('fortejas/intro-to-cdk-pipelines', 'main', {
                    connectionArn: 'arn:aws:codestar-connections:eu-west-1:335688126910:connection/8553f863-0a85-4f5e-bff7-e97de16bd390'
                }),
                commands: [
                    `npm ci`,
                    `npm run build`,
                    `npx cdk synth`
                ]
            })
        })

        const devStage = new MyApplicationStage(this, 'Dev', { name: 'Develop' })

        /**
         * Add the first Dev Stage
         */

        const dev = pipeline.addStage(devStage)

        /**
         * Add a test stage
         */

        dev.addPost(new ShellStep('SmokeTest', {
            envFromCfnOutputs: {
                URL: devStage.loadBalancerAddr
            },
            commands: [
                'curl -Ssf $URL'
            ]
        }))

        /**
         * Add Production Stage
         */

        pipeline.addStage(new MyApplicationStage(this, 'Prod', { name: 'Prod' }))


    }
}
