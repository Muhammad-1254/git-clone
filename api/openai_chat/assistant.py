from dotenv import find_dotenv, load_dotenv

from openai import OpenAI
from openai.types.beta.assistant import Assistant
from openai.types.chat.chat_completion import ChatCompletion

_: bool = load_dotenv(find_dotenv())
client: OpenAI = OpenAI()
tools = [
    {"type": "code_interpreter"},
    {"type": "retrieval"},
]
def create_assistant(client:OpenAI):
    ## Creating Assistant
    instruction='You are helpful general Chat Bot. User can asked you any question related to any fields, types, etc. You have to give your answer in proper and simple way'
    assistant: Assistant = client.beta.assistants.create(
    model='gpt-3.5-turbo-1106',
    name='General Chat Bot',
        instructions=instruction,
        tools=tools
        )
    return assistant


assistant  = create_assistant(client)
print(f'assistant: {assistant}')

