# The Last Show

 a full stack application with React and AWS that generates obituaries for people (fictional or otherwise). You will use [ChatGPT](https://openai.com/blog/chatgpt) to generate an obituary, [Amazon Polly](https://aws.amazon.com/polly/) to turn the obituary into speech, and [Cloudinary](https://cloudinary.com/) to store the speech and a picture of the deceased (may they rest in peace).

## Architecture Overview

<br/>
<p align="center">
  <img src="https://res.cloudinary.com/mkf/image/upload/v1680411648/last-show_dvjjez.svg" alt="the-last-show-architecture" width="800"/>
</p>
<br/>


## :page_with_curl: Notes

-  created all your resources on AWS with Terraform. Put all your configuration in the [`main.tf`](infra/main.tf) file
-  used AWS DynamoDB for the database
-  used [Lambda Function URLs](https://masoudkarimif.github.io/posts/aws-lambda-function-url/) for this assignment to connect your backend to the frontend
-  created 2 Lambda functions for this assignment:

  - `get-obituaries-<your-ucid>`: to retrieve all the obituaries. Function URL only allows `GET` requests
  - `create-obituary-<your-ucid>`: to create a new obituary. The function reads all the data (including the picture) from the body of the request. Function URL only allows `POST` requests

- use Python to write the functions
- used the [Cloudinary Upload API](https://cloudinary.com/documentation/image_upload_api_reference) and **not the SDK** to interact with Cloudinary.
- used the [ChatGPT API](https://platform.openai.com/docs/api-reference/making-requests) and **not the SDK** to interact with ChatGPT

- used [Amazon Polly](https://aws.amazon.com/polly/) to turn the obituary written by ChatGPT to speech and then upload the `mp3` version of that to Cloudinary. Read more about the Polly API [here](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/polly.html). What you need is the [`synthesize_speech`](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/polly/client/synthesize_speech.html) method
