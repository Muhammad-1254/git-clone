import uvicorn
from dotenv import find_dotenv, load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from openai import OpenAI

# streaming voice from openai tss by fast api

_ = load_dotenv(find_dotenv())  # read local .env file

client = OpenAI()
app =FastAPI()

input ="""The information you provided seems to be related to Next.js, a React framework for building web applications. However, as of my last knowledge update in January 2022, I don't have specific details about the "createContext" function you mentioned or the "use client" directive in Next.js.

# However, based on the context,it seems like "createContext" might be a reference to the React createContext function, which is used for creating a context object in React. Context provides a way to pass data through the component tree without having to pass props down manually at every level.

# In the provided message, it's mentioned that createContext works only in client components and that you need to add the "use client" directive at the top of the file to use it. This suggests that there might be some server-side rendering (SSR) considerations or limitations when working with context in certain components. The link provided in the message directs you to the Next.js documentation for more information.

# If you are working with Next.js,I recommend checking the latest Next.js documentation for any updates or changes related to context, "createContext," and the "use client" directive. The information might have evolved since my last update."""
    # input="Hello world! This is a new streaming test streaming test.",





@app.get("/stream-mp3")
async def stream_mp3():
    response = client.audio.speech.create(
    model="tts-1",
    voice="alloy",
 input=input,
 response_format='opus',
)
    
    # Replace "your_file.mp3" with the actual path to your MP3 file
    file_path = "output.mp3"

    try:
        return StreamingResponse(response.iter_bytes(), media_type="audio/mp3")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app='temp:app', host='0.0.0.0', port=8000, reload=True)