---
title: Dreamhack-dreamhack-tools-cyberchef
description: cyberchef 툴을 이용한 워게임 문제 풀이
category: Dreamhack Misc
tags:
  - Dreamhack
  - Wargame
  - Misc
createdAt: 2026-11-19
updatedAt: 2026-11-19
draft: false
---
# DH - dreamhack-tools-cyberchef

## 문제  


![image.png](/images/image-71.png)

link: [dreamhack-tools-cyberchef | Wargame | Dreamhack](https://dreamhack.io/wargame/challenges/270)



---

## 풀이

문제 파일을 다운로드 하니 아래와 같은 `index.html`파일이 하나 있다. 압축을 해제하고 봐보자.

![image.png](/images/image-72.png)

### 소스코드

`index.html`을 확인해보니 아래와 같은 html 코드가 있었다.

```html
<h1>EUg5MJAyYJ9fYJ5iMKqio29iVK1VL2WlnTM0o3AyL2Elq3q3qlRu</h1>
<h2>Rail Fence → Base64 → ROT13</h2>
<h3>Have Fun</h3>
```

![image.png](/images/image-73.png)

브라우저로 보면 이런 느낌이다. 아마 저 문자를 드림핵에서 제공하는 툴을 이용해서 풀어보라는거 같다.

### cyberchef 툴 사용

link: [Dreamhack Tools](https://tools.dreamhack.games/cyberchef)

위 링크는 문제에서 제공된 드림핵 툴즈 링크이다.

![image.png](/images/image-74.png)

들어가게 되면 위처럼 여러가지 방법의 인코딩, 디코딩 툴이 있다. 문제에서 활용해달라 했으니 활용해보자.

```
EUg5MJAyYJ9fYJ5iMKqio29iVK1VL2WlnTM0o3AyL2Elq3q3qlRu
```

먼저 위 코드를 복호화 또는 디코딩을 해야할거 같다. 툴 검색창에 `Rail fence`를 검색해보았다.

![image.png](/images/image-75.png)

그러면 이렇게 "Rail Fence Cipher Encode"와 "Rail Fence Cipher Decode"툴이 나온다. 이 문제는 복호화하는 문제 같으니까 "Rail Fence Cipher Decode"를 눌러보았다.

![image.png](/images/image-76.png)

같은 방법으로 Base64와 ROT13을 복호화 하기 위한 레시피를 추가해준다. (요리 레시피처럼 어떤걸 인코딩 하고 복호화할건지 순서대로 추가가 가능.)

![image.png](/images/image-78.png)

흠 근데 답이 나오지 않는다. 설마 저 힌트는 복호화 순서가 아니라 암호화 순서인걸까? 그래서 반대로 해보았다.



오 레시피 순서를 반대로 하니 플래그를 얻을 수 있었다!

![image.png](/images/image-77.png)

---

## 결과

플래그:

```
DH{cyberchef-tools-encoderwwowowowo!!!}
```

