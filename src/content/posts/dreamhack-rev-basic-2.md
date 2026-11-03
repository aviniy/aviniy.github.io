---
title: "Dreamhack rev-basic-2 풀이"
description: "정수 배열에 저장된 ASCII 값을 분석해 입력값을 복원한다."
category: "Dreamhack Reversing"
tags: ["Dreamhack","Reversing"]
createdAt: "2026-11-03"
updatedAt: "2026-11-03"
draft: false
notionSource: "36b57476-16b2-81db-93ff-c822c581af88"
---

문제 파일은 <code>chall2.exe</code> 하나이며, 64비트 Windows PE 실행 파일이다.

앞 문제들과 동일하게 입력값을 검사해 맞으면 <code>Correct</code>, 틀리면 <code>Wrong</code>을 출력한다.

문자열을 확인하면 정답은 직접 보이지 않고, 입출력 관련 문자열만 확인된다.

```bash
strings -a -n 3 chall2.exe
```

```txt
Input :
%256s
Correct
Wrong
```

따라서 <code>Correct</code> 출력 전 호출되는 검증 함수 <code>0x140001000</code>을 <code>objdump</code>로 확인하였다.

```bash
objdump -d -M intel --start-address=0x140001000 --stop-address=0x140001200 chall2.exe
```

핵심 부분은 다음과 같다.

```asm
cmp    rax, 0x12
lea    rcx, [rip+0x1fd1]    ; 0x140003000
movzx  edx, byte ptr [r8+rdx]
cmp    dword ptr [rcx+rax*4], edx
```

이 함수는 18회 반복하며, 사용자가 입력한 문자열의 각 바이트를 <code>0x140003000</code>에 있는 4바이트 정수 배열과 순서대로 비교한다.

즉, 정답은 문자열 상수로 바로 저장된 것이 아니라 배열의 각 원소를 ASCII 문자로 읽어 복원해야 한다.

배열 값을 문자로 해석하면 다음 입력값이 나온다.

```txt
Comp4re_the_arr4y
```

검증 로직은 다음과 같이 정리할 수 있다.

```c
for (int i = 0; i < 18; i++) {
    if (answer[i] != (unsigned char)input[i])
        return 0;
}
return 1;
```

정답 입력값:

```txt
Comp4re_the_arr4y
```

제출 플래그:

```txt
DH{Comp4re_the_arr4y}
```

