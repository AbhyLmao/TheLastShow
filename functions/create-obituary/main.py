import json
import boto3
import requests
import time
import hashlib
import base64
from json import decoder
from requests_toolbelt.multipart import decoder

def create_handler(event, context):
    dynamodb_resource = boto3.resource('dynamodb')
    table = dynamodb_resource.Table('obituaries-30150196')

    body = event[body]

    if event['isBase64Encoded']:
        body = base64.b64decode(body)

    
    content_type = event['headers']['content_type']
    
    data = decoder.MultipartDecoder(body,content_type)

    binary_data = [part.contnet for part in data.parts]

    obitiurary = json.loads(binary_data[0].decode('utf-8'))


    name = obitiurary['title']
    birth = obitiurary['when']
    death = obitiurary['died']
    id = str(obitiurary['id'])
    img_key = f'{id}img.png'
    text = ask_gpt(name,birth,death)

    audio = read_this(text)
    audio_url = upload_to_cloudinary(audio,resource_tyoe = 'video')['secure_url']

    with open(f"/tmp/{img_key}img.png", "wb") as binary_file:
        binary_file.write(binary_data[1]) 
        image_url = upload_to_cloudinary (f"/ tmp/{img_key}img.png") ["secure_url"]
        item = {
        "id": id,
        "name": name,
        "birth_date": birth, 
        "death_date": death, 
        "text": text,
        "audio_url": audio_url, 
        "image_url": image_url
        }

    
    table.put_item(Item = item)

    return{
        "statusCode": 200,
        'body': json.dumps(item)
    }
    

def read_this(text):
    client = boto3.client('polly')
    response = client.synthesize_speech(
        Engine = 'standard',
        LanguageCode = 'en-US',
        OutputFormat = 'mp3' | 'ogg_vorbis',
        SampleRate = 'string',
        Text = text,
        TextType = 'text',
        VoiceId = 'Joanna'
    )

    filename = "polly.mp3"
    with open(filename, "wb") as f:
        f.write(response["AudioStream"].read())

    return filename

def create_query_string(body):
    query_string = ""
    for idx, (k, v) in enumerate(body.items()):
        query_string = f"{k}={v}" if idx == 0 else f"{query_string}&{k}={v}"
    return query_string

def sort_dictionary(dictionary, exclude):
    return {k: v for k, v in sorted(dictionary.items(), key=lambda item: item[0]) if k not in exclude}
    
def create_signature(body, api_secret):
    exclude = ["api_key", "resource_type", "cloud_name"]
    sorted_body = sort_dictionary(body, exclude)
    query_string = create_query_string(sorted_body)
    query_string_appended = f"{query_string}{api_secret}"
    hashed = hashlib.sha1(query_string_appended.encode())
    signature = hashed.hexdigest()
    return ""

def ask_gpt(name, birth, death):
    url = "https://api.openai.com/v1/completions"

    ssm_client = boto3.client('ssm', 'ca-central-1')
    
    response = ssm_client.get_parameter(
        Name = 'gptapi',
        withDecryption = True
    )

    GPT_KEY = response['Parameter']
    # you need to read this from Parameter Store
    headers = {

        "Content-Type": "application/json",
        "Authorization": f"Bearer {GPT_KEY}"
    }
    body = {
        "model": "text-davinci-003",
        "prompt": "Write me a short obitiary about a fictional character named {name} who was born on {birth} and died on {death}",
        "max_tokens": 200,
        "temperature": 0.3
    }

    res = requests.post(url, headers=headers, json=body)

    return res.json()["choices"][0]["text"]


def upload_to_cloudinary(filename, resource_type="image", extra_fields={}):
    """
    Uploads a file to cloudinary
    """
    ssm_client = boto3.client('ssm', 'ca-central-1')

    cloudlol = ssm_client.get_parameter(
        Name = 'cloudname',
        withDecryption = True
    )

    cloud_name = cloudlol['Parameter']['Value']

    keylol = ssm_client.get_parameter(
        Name = 'cloudkey',
        withDecryption = True
    )
    
    api_key = keylol['Parameter']['Value']
    
    secretlol = ssm_client.get_parameter(
        Name = 'cloudsecret',
        withDecryption = True
    )

    api_secret =  secretlol['Parameter']['Value']
    timestamp = int(time.time())
    egar = 'e_art:zorro'

    body = {
        "timestamp": timestamp,
        "api_key": api_key,
        "eager" : egar
    }

    files = {
        "file": open(filename, "rb")
    }

    timestamp = int(time.time())
    body["timestamp"] = timestamp
    body.update(extra_fields)
    body["signature"] = create_signature(body, api_secret)
    url = f"https://api.cloudinary.com/v1_1/{cloud_name}/{resource_type}/upload"
    res = requests.post(url, files=files, data=body)

    response = res.json

    if res.status_code!=200:
        print('error uploading'+response)
    else:
        print("Status Code = "+response)

    return response