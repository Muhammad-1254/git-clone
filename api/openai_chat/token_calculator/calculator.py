
import tiktoken

_ = tiktoken.encoding_for_model('gpt-3.5-turbo')

class TokenCalculator:
    encoding_name = 'cl100k_base'
    encoding = tiktoken.get_encoding(encoding_name)
    num_token = len(encoding.encode("Hello, world!"))
     
    def __init__(self):
        pass
    
    def calculate_tokens_from_dict(self, data:list[dict]):
        """Returns the number of token in a dictionary"""
        tempStr:str = ''
        for item in data:
            tempStr += item['role'] +item['content']
        
        tokens = len(self.encoding.encode(tempStr))
        print(f'string calc from calculator class: {tempStr}')
        print(f'len of tokens is: {len}')
        return tokens
        
        
        

        
