---
title: "백준 1032 파일 이름 패턴 풀이"
description: "여러 파일 이름의 같은 위치를 비교해 공통 패턴을 찾는 문자열 문제."
category: "Baekjoon"
tags: ["백준", "문자열", "구현", "Python"]
createdAt: "2026-11-03"
updatedAt: "2026-11-03"
draft: false
notionSource: "32f57476-16b2-802e-81d8-f192ab73b0b7"
---

[문제 1032: 명령 프롬프트](https://www.acmicpc.net/problem/1032)

## 풀이

첫 번째 파일 이름을 기준으로 각 위치의 문자를 다른 파일 이름들과 비교한다. 같은 위치의 문자가 하나라도 다르면 그 자리를 `?`로 바꾼다. 비교가 끝나면 문자 목록을 다시 문자열로 합친다.

```python
n = int(input())
files = [input() for _ in range(n)]
result = list(files[0])

for i in range(len(result)):
    for j in range(1, n):
        if files[j][i] != result[i]:
            result[i] = '?'
            break

print(''.join(result))
```

파일 이름의 길이를 `L`, 개수를 `N`이라고 하면 시간 복잡도는 `O(NL)`이다.
