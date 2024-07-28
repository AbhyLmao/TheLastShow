# add your get-obituaries function here
import json
import boto3


def get_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('obituaries-30150196')
    
    response = table.scan()
    items = response.get('Items', [])

    while 'LastEvaulatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        items += response.get('Items', [])
    
    return {
        "statusCode": 200,
        "body": json.dumps(res["Items"])
    }
