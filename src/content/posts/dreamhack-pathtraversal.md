---
title: Dreamhack pathtraversal 풀이
description: https://dreamhack.io/wargame/challenges/12
category: Dreamhack Web
tags:
  - WebHacking
  - Web
  - Wargame
  - Dreamhack
createdAt: 2026-11-04
updatedAt: 2026-11-04
draft: true
---
# DH - Pathtraversal



## 문제:

![image.png](/images/image-1.png)

link: [https://dreamhack.io/wargame/challenges/12](https://dreamhack.io/wargame/challenges/12)



## Path Traversal 취약점이란?

**Path Traversal(경로 탐색 취약점)**은 `../`와 같은 경로 이동 문자열을 이용하여 정상적으로 접근할 수 없는 파일이나 디렉터리, URL 경로에 접근하는 취약점이다.

사용자 입력값에 대한 검증이 제대로 이루어지지 않을 때 발생하며, 이를 악용하면 서버 내부의 민감한 정보를 열람하거나 접근이 제한된 경로에 접근할 수 있다.



## 코드:

`

```python
from flask import Flask, request, render_template, abort
from functools import wraps
import requests
import os, json

users = {
    '0': {
        'userid': 'guest',
        'level': 1,
        'password': 'guest'
    },
    '1': {
        'userid': 'admin',
        'level': 9999,
        'password': 'admin'
    }
}

def internal_api(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        if request.remote_addr == '127.0.0.1':
            return func(*args, **kwargs)
        else:
            abort(401)
    return decorated_view

app = Flask(__name__)
app.secret_key = os.urandom(32)
API_HOST = 'http://127.0.0.1:8000'

try:
    FLAG = open('./flag.txt', 'r').read() # Flag is here!!
except:
    FLAG = '[**FLAG**]'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_info', methods=['GET', 'POST'])
def get_info():
    if request.method == 'GET':
        return render_template('get_info.html')
    elif request.method == 'POST':
        userid = request.form.get('userid', '')
        info = requests.get(f'{API_HOST}/api/user/{userid}').text
        return render_template('get_info.html', info=info)

@app.route('/api')
@internal_api
def api():
    return '/user/<uid>, /flag'

@app.route('/api/user/<uid>')
@internal_api
def get_flag(uid):
    try:
        info = users[uid]
    except:
        info = {}
    return json.dumps(info)

@app.route('/api/flag')
@internal_api
def flag():
    return FLAG

application = app # app.run(host='0.0.0.0', port=8000)
# Dockerfile
#     ENTRYPOINT ["uwsgi", "--socket", "0.0.0.0:8000", "--protocol=http", "--threads", "4", "--wsgi-file", "app.py"]
```



## 풀이:



&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;