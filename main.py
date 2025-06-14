from fastapi import FastAPI, Request
from pydantic import BaseModel
from openai import OpenAI
import base64

app = FastAPI()
client = OpenAI()

class ImageRequest(BaseModel):
    image_base64: str

def get_items_from_base64(base64_image: str):
    response = client.chat.completions.create(
        model='gpt-4o',
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Give me a list of the items of food you see from the image and separated by commas. No extra text just the food items ex french fries, coke, ketchup, burger"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            },
        ],
    )

    response_message = response.choices[0].message
    content = response_message.content
    return content

@app.post("/analyze-image")
async def analyze_image(req: ImageRequest):
    try:
        content = get_items_from_base64(req.image_base64)
        items = [item.strip() for item in content.split(",") if item.strip()]
        return {"food_items": items}
    except Exception as e:
        return {"error": str(e)}