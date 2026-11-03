---
title: "백준 1676 팩토리얼 0의 개수 풀이"
description: "팩토리얼 끝의 0을 만들 수 있는 5의 인수를 세는 수학 문제."
category: "Baekjoon"
tags: ["백준", "수학", "Python"]
createdAt: "2026-11-03"
updatedAt: "2026-11-03"
draft: false
notionSource: "32f57476-16b2-8071-ba51-dc876210c2b9"
---

[문제 1676: 팩토리얼 0의 개수](https://www.acmicpc.net/problem/1676)

## 풀이

끝의 0은 `10 = 2 × 5`가 곱해질 때 생긴다. `N!`에는 2가 5보다 많으므로 5의 개수만 세면 된다. `N // 5`는 5의 배수, `N // 25`는 5가 한 번 더 들어 있는 25의 배수, `N // 125`는 그다음 배수를 센다.

```python
n = int(input())
count = 0

while n > 0:
    n //= 5
    count += n

print(count)
```

반복 횟수는 `O(log₅ N)`이다.
