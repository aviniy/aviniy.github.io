---
title: Dreamhack broken-png
description: 이미지 복구하는 워게임 풀이
category: Dreamhack Misc
tags:
  - Dreamhack
  - Wargame
createdAt: 2026-11-14
updatedAt: 2026-11-14
draft: false
---
# DH - broken-png

## 문제

![image.png](/images/image-64.png)

link: [broken-png | Wargame | Dreamhack](https://dreamhack.io/wargame/challenges/104)

---

## 풀이

문제를 다운 받아주니 `image.png`파일이 하나있다. 이미지 파일을 열어보면 아래와 같이 플래그 처럼 보이는 글자가 잘린 모습을 볼 수 있다.

![image.png](/images/image-66.png)

아마 PNG 파일의 헤더 정보가 조작되었을 가능성이 있다고 생각했다. 문제를 풀기 위해 IHDR과 CRC를 알아보도록 하자.

### IHDR이란?

<span><strong>IHDR(Image Header)</strong>은 PNG 파일에서 이미지의 기본 정보를 저장하는 헤더이다.</span>

### CRC란?

<span><strong>CRC(Cyclic Redundancy Check)</strong>는 데이터에 오류가 있는지 확인하는 검사 방식이다.</span>

따라서 이번 문제는 PNG 파일의 IHDR을 분석하여 이미지의 크기 정보를 확인하고, CRC 값을 검증하여 높이 값이 조작되었음을 파악한 후, 이를 수정해서 이미지를 복구하는 문제처럼 보인다.

그럼 바로 풀어보자. 먼저 HxD툴로 PNG 파일을 열어 IHDR 영역을 확인하였다.

![image.png](/images/image-67.png)

PNG 파일의 IHDR에는 이미지의 너비와 높이가 저장되어 있다.

너비는 `00 00 02 00`이라 되어있는데 높이는 `00 00 01 00`이라 되어있는걸 확인 할 수 있다.

그리고 IHDR에 저장된 CRC 값은 `F4 78 D4 FA`였다. 현재 이미지 높이인 256px을 기준으로 계산한 CRC와 저장된 CRC가 일치하지 않았다. 그렇기 때문에 높이 정보가 조작된 사진이라고 생각하였다.

![image.png](/images/image-70.png)

[pnggroup/pngcheck: Development of pngcheck 4](https://github.com/pnggroup/pngcheck)에서 pngcheck를 다운 받고 `image.png`를 확인해보니 CRC error in chunk IHDR이 뜬것을 확인할 수 있다.



![image.png](/images/image-69.png)

위와 같이 높이를 `00 00 02 00`으로 수정해주고 저장하고 이미지 파일을 다시 열어준다.



## 결과

![image.png](/images/image-68.png)

플래그:

```
DH{image_height_property}
```

