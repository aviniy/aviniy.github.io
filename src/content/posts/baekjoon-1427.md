---
title: "백준 1427 소트인사이드 풀이"
description: "숫자의 각 자릿수를 내림차순으로 정렬해 다시 출력한다."
category: "Baekjoon"
tags: ["백준", "정렬", "문자열", "Python"]
createdAt: "2026-11-03"
updatedAt: "2026-11-03"
draft: false
notionSource: "32f57476-16b2-80ff-b20a-c0963533e17b"
---

[문제 1427: 소트인사이드](https://www.acmicpc.net/problem/1427)

## 풀이

입력값을 문자열로 받으면 각 자릿수를 그대로 순회할 수 있다. 문자 `'0'`부터 `'9'`는 문자 순서와 숫자 순서가 같으므로 내림차순 정렬 후 이어 붙이면 된다.

```python
digits = list(input().strip())
digits.sort(reverse=True)
print(''.join(digits))
```

자릿수를 `D`라고 하면 정렬의 시간 복잡도는 `O(D log D)`이다.
