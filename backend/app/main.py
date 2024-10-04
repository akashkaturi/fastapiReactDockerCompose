from fastapi import FastAPI, File, UploadFile, HTTPException,WebSocket
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import boto3
from dotenv import load_dotenv
from botocore.exceptions import ClientError
from pydantic import BaseModel
import os
load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Configure your AWS credentials and bucket name
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
AWS_REGION = os.getenv("AWS_REGION")  # e.g., 'us-west-1'
BUCKET_NAME = os.getenv("BUCKET_NAME")

# Initialize the S3 client
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION,
)

class ImageModel(BaseModel):
    filename: str
    url: str

@app.post("/upload/", response_model=ImageModel)
async def upload_file(file: UploadFile = File(...)):
    try:
        # Upload the file to S3
        s3_client.upload_fileobj(file.file, BUCKET_NAME, file.filename)
        file_url = f"https://{BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{file.filename}"
        return {"filename": file.filename, "url": file_url}
    
    except ClientError as e:
        raise HTTPException(status_code=500, detail=e.response['Error']['Message'])
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"You said: {data}")
@app.get("/images/{filename}", response_model=ImageModel)
async def get_image(filename: str):
    try:
        file_url = f"https://{BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}"
        return {"filename": filename, "url": file_url}
    
    except Exception as e:
        raise HTTPException(status_code=404, detail="Image not found")

@app.delete("/images/{filename}", response_model=dict)
async def delete_image(filename: str):
    try:
        s3_client.delete_object(Bucket=BUCKET_NAME, Key=filename)
        return {"detail": "Image deleted successfully"}
    
    except ClientError as e:
        raise HTTPException(status_code=404, detail=e.response['Error']['Message'])

@app.get("/images/", response_model=list[ImageModel])
async def list_images():
    try:
        response = s3_client.list_objects_v2(Bucket=BUCKET_NAME)
        images = []
        if 'Contents' in response:
            for obj in response['Contents']:
                filename = obj['Key']
                file_url = f"https://{BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}"
                images.append({"filename": filename, "url": file_url})
        return images
    
    except ClientError as e:
        raise HTTPException(status_code=500, detail=e.response['Error']['Message'])
