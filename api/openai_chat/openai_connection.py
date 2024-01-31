import json
from pathlib import Path

from dotenv import find_dotenv, load_dotenv
from openai import AsyncOpenAI, OpenAI
from openai.types.beta.assistant import Assistant
from openai.types.beta.thread import Thread
from openai.types.beta.threads.run import Run
from openai.types.chat.chat_completion import ChatCompletion

_: bool = load_dotenv(find_dotenv())
client: OpenAI = OpenAI()
temp_client:AsyncOpenAI =AsyncOpenAI()


# conversation_history = [{'role': 'user', 'content': 'hello, My name is usman'}, {'role': 'assistant', 'content': 'Hello Usman! Nice to meet you. How can I assist you today?'}]
def chat_completion(prompt: str, conversation_history: list):
    # conversation_history.append({"role": "user", "content": prompt})
    chat_completion: ChatCompletion = client.chat.completions.create(
        model='gpt-3.5-turbo-1106',
        max_tokens=150,
        messages=conversation_history,

    )
    # conversation_history.append({"role": "assistant", "content": chat_completion.choices[0].message.content})
    # conversation_history.append({"role": "assistant", "content": chat_completion.choices[0].message.content})
    return chat_completion.choices[0].message.content


def spt_chat_compilation(audio_file: str):
    """Convert speech to text by openai whisper model"""

    audio_file = open(audio_file, "rb")

    transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
        response_format="text",
        prompt='Convert this audio file into text and you have to correct the grammar mistakes if applicable!'
    )
    print(f'transcript: {transcript}')
    return transcript


def tts_chat_compilation(audio_file:str,prompt: str, ):
    """Convert text to speech by whisper model"""
    print('res started:')
    res = client.audio.speech.create(
        model='tts-1',
        voice='alloy',
        input=prompt
        
        )
    
    print("res created: ",res)
    res.stream_to_file(audio_file)
    
    
tempStr:str = ''

async def chat_completion_temp(conversation_history:list):
    # conversation_history.append({"role": "user", "content": prompt})
    chat_completion =await temp_client.chat.completions.create(
        model='gpt-3.5-turbo-1106',
        max_tokens=150,
        messages=conversation_history,
stream=True
    )
    
    async for chunk in chat_completion:
        content = chunk.choices[0].delta.content
        if content:
            yield content