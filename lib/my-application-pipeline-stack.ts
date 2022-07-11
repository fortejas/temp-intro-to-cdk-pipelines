import { Stack, StackProps } from "aws-cdk-lib";
import { CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";


export class MyApplicationPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        /**
         * Adding the pipeline to our source code.
         */
        new CodePipeline(this, 'Pipeline', {
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
    }
}
