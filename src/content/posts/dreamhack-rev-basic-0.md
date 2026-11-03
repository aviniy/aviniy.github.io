---
title: "Dreamhack rev-basic-0 풀이"
description: "문자열과 디스어셈블 결과로 입력 검증 로직을 분석한다."
category: "Dreamhack Reversing"
tags: ["Dreamhack","Reversing"]
createdAt: "2026-11-03"
updatedAt: "2026-11-03"
draft: false
notionSource: "36b57476-16b2-81af-9ff6-d234bf9966e3"
---

문제 파일은 <code>chall0.exe</code> 하나이며, 64비트 Windows PE 실행 파일이다.

이번 문제는 바이너리를 직접 실행하지 않고 문자열과 디스어셈블 결과만으로 정답을 찾을 수 있다.

먼저 문자열을 확인하면 입력 안내와 성공/실패 문구, 눈에 띄는 문자열이 나온다.

```bash
strings -a -n 3 chall0.exe
```

```txt
Compar3_the_str1ng
Input :
%256s
Correct
Wrong
```

이 문자열이 실제 정답으로 사용되는지 확인하기 위해 <code>objdump</code>로 입력 검사 부분을 확인하였다.

```bash
objdump -d -M intel chall0.exe
objdump -s -j .rdata chall0.exe
```

검증 함수에는 다음과 같은 코드가 있다.

```asm
140001009  lea  rdx, [rip+0x1210]   ; 0x140002220
140001010  mov  rcx, [rsp+0x40]     ; 사용자 입력
140001015  call strcmp
14000101a  test eax, eax
```

<code>.rdata</code>의 <code>0x140002220</code> 주소에는 다음 문자열이 저장되어 있다.

```txt
Compar3_the_str1ng
```

즉, 함수의 로직은 아래와 같다.

```c
return strcmp(input, "Compar3_the_str1ng") == 0;
```

<code>main</code>은 <code>%256s</code>로 입력을 받고, 검사 결과가 참이면 <code>Correct</code>, 거짓이면 <code>Wrong</code>을 출력한다.

정답 입력값:

```txt
Compar3_the_str1ng
```

제출 플래그:

```txt
DH{Compar3_the_str1ng}
```

