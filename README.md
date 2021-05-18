# SQS FIFO - Lambda - DynamoDB

Goal: each entity may be processed by no more than one Lambda instance at a time.

Precond: 

    npm install -g serverless

Sample (Terminal 1)

    sls deploy

    QUEUE_URL=$(aws cloudformation describe-stacks --region eu-central-1 --stack-name lambda-fifo-poc-dev --query 'Stacks[].Outputs[?OutputKey==`Queue`].OutputValue' --output text)

    aws sqs send-message --region eu-central-1 --queue-url $QUEUE_URL --message-body '{"increment":10}' --message-group-id id100 --message-deduplication-id $(uuidgen)
    aws sqs send-message --region eu-central-1 --queue-url $QUEUE_URL --message-body '{"increment":20}' --message-group-id id100 --message-deduplication-id $(uuidgen)
    aws sqs send-message --region eu-central-1 --queue-url $QUEUE_URL --message-body '{"increment":30}' --message-group-id id200 --message-deduplication-id $(uuidgen)
    aws sqs send-message --region eu-central-1 --queue-url $QUEUE_URL --message-body '{"increment":40}' --message-group-id id200 --message-deduplication-id $(uuidgen)
    aws sqs send-message --region eu-central-1 --queue-url $QUEUE_URL --message-body '{"increment":50}' --message-group-id id100 --message-deduplication-id $(uuidgen)
    aws sqs send-message --region eu-central-1 --queue-url $QUEUE_URL --message-body '{"increment":60}' --message-group-id id200 --message-deduplication-id $(uuidgen)

Sample (Terminal 2)

    sls logs -f hello -t
