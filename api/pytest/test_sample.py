import requests

res = requests.get('http://localhost:8000/api/v1/users/chat/7b33b633-a54c-4b06-b57e-3416611a4776')
def test_01():
    assert res.status_code == 200
    data = res.json()
    print(f'data: {data}')
    assert type(data) == dict 