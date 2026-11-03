---
title: "Dreamhack rev-basic-1 풀이"
description: "바이트별 상수 비교를 읽고 정답 문자열을 복원한다."
category: "Dreamhack"
tags: ["Dreamhack","Reversing"]
createdAt: "2026-11-03"
updatedAt: "2026-11-03"
draft: false
notionSource: "36b57476-16b2-814d-8ee1-e8ea1f4c1408"
---

문제 파일은 <code>chall1.exe</code> 하나이며, 64비트 Windows PE 실행 파일이다.

<code>rev-basic-0</code>와 마찬가지로 입력값이 맞으면 <code>Correct</code>, 틀리면 <code>Wrong</code>을 출력하지만, 이번에는 정답 문자열이 통째로 보이지 않는다.

문자열을 확인하면 입출력에 사용되는 문구만 찾을 수 있다.

```bash
strings -a -n 3 chall1.exe
```

```txt
Input :
%256s
Correct
Wrong
```

그래서 <code>objdump</code>로 <code>Correct</code>를 출력하기 전에 호출되는 입력 검사 함수 <code>0x140001000</code>을 확인하였다.

```bash
objdump -d -M intel --start-address=0x140001000 --stop-address=0x140001400 chall1.exe
```

검사 함수는 사용자 입력의 각 문자를 한 자리씩 상수와 비교한다.

```asm
cmp eax, 0x43  ; input[0]  = 'C'
cmp eax, 0x6f  ; input[1]  = 'o'
cmp eax, 0x6d  ; input[2]  = 'm'
cmp eax, 0x70  ; input[3]  = 'p'
cmp eax, 0x61  ; input[4]  = 'a'
cmp eax, 0x72  ; input[5]  = 'r'
cmp eax, 0x33  ; input[6]  = '3'
cmp eax, 0x5f  ; input[7]  = '_'
```

이후 비교값도 순서대로 이어 붙이면 다음 문자열이 완성된다.

```txt
Compar3_the_ch4ract3r
```

마지막으로 <code>input[21]</code>이 <code>0</code>인지 확인하므로, 추가 문자가 없는 정확한 문자열이어야 성공한다.

로직을 정리하면 다음과 같다.

```c
return input == "Compar3_the_ch4ract3r";
```

정답 입력값:

```txt
Compar3_the_ch4ract3r
```

제출 플래그:

```txt
DH{Compar3_the_ch4ract3r}
```

