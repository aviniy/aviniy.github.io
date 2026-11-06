---
title: Dreamhack rev-basic-3
description: IDA 프로그램을 이용한 리버싱 문제 풀이
category: Dreamhack Reversing
tags:
  - Dreamhack
  - Reversing
  - Wargame
createdAt: 2026-11-07
updatedAt: 2026-11-07
draft: false
---
# DH rev-basic-3

## 문제

![image.png](/images/image-19.png)

link: [rev-basic-3 | Wargame | Dreamhack](https://dreamhack.io/wargame/challenges/17)

## 풀이

문제를 다운로드 해주면 아래와 같이 `chall3.exe` 파일이 하나 있다.

![image.png](/images/image-20.png)

IDA 프로그램을 통해 다운 받은 `chall3.exe` 를 열어준다.

![image.png](/images/image-21.png)

그러면 위와 같은 화면이 뜨게 된다. **사실 나는 어셈블리어를 잘 모르기 때문에** c언어로 디컴파일 후 문제를 풀어보겠다. IDA에서 F5를 누르면 c언어로 디컴파일이 된다. 그러면 아래와 같이 c언어 코드가 나온다.

![image.png](/images/image-17.png)

코드를 보면 조건문이 하나 있는걸 발견할 수 있다.

```c
if ( (unsigned int)sub_140001000(v4) )
  puts("Correct");
else
  puts("Wrong");
```

문제를 풀면서 주목해야 할건 이 조건문이다. 여기서 `unsigned int`가 뭔지 몰라서 찾아보니, 양수와 0을 저장하는 자료형이라고 한다. 해당 라이트업에선 간단하게 설명만 하고 문제 풀이로 넘어가보겠다. (나중에 학습 노트에 정리해보도록 하겠다.)

어쨋든, 문제로 돌아와서 `if`문 안을 해석해보면.. `v4`라는 입력 받은 변수를 `sub_140001000()`함수로 처리한 후 반환값을 `unsigned int`로 변환한다. 그 후 0이 아니면 참으로 판단하여 `Correct`를 출력하고, 0이면 거짓으로 판단하여 `Wrong`을 출력한다.

그러니까 `sub_140001000()`함수를 확인하면 이 문제를 풀 수 있을것이다.

![image.png](/images/image-18.png)

위 사진은 `sub_140001000()`함수가 하는 일이 나온다. 먼저 반복문을 확인해보자.

```c
for (i = 0; (unsigned __int64)i < 0x18; ++i)
```

해당 반복문에서 `0x18`은 24라서 0부터 23까지 반복한다는 의미이다. 파이썬으로 생각하면

```python
for i in range(24):
```

이 정도로 해석할 수 있다. 근데 또 처음보는 `__int64` 라는 자료형이 나왔다. 찾아보니, `__int64` 는 정수형 자료형으로 64비트 정수형이고, 마찬가지로 아래 코드를 보면 `__int8`이 나오는데 8비트 정수형이다. (참고로 1바이트 = 8비트이다.)

```c
if ( byte_140003000[i] != (i ^ *(unsigned __int8* )(a1 + i)) + 2 * i )
```

`a1 + i` 는 입력 문자열에서 i번째 바이트가 있는 주소를 구한다. (참고로 `a1`은 `sub_140001000()`함수를 호출할때 넘겨받는 값을 담는 매개변수이다. IDA에서 붙인 이름이다.)

`(unsigned __int8 *)`은 그 주소를 1바이트 정수를 읽을 수 있는 주소로 해석한다.

`*(unsigned __int8 *)(a1 + i)` 에서 맨 앞 `*`로 그 주소의 값을 읽는다.

즉 위 코드의 의미는 다음과 같다. 입력의 i번째 문자 코드를 `i` 와 XOR 연산을 하고, 거기에 `2 * i`를 더한 값이 다르면. 이라는 의미이다. 그리고 `return 0;`다르면 0을 반환하고 같다면 1을 반환하겠다는게 `sub_140001000()`함수의 기능이다. 그리고 처음에 0이 아닌 수가 나와야 `Correct`를 출력한다 했고, 0이면 `Wrong`을 출력한다 하였으니 정확히 일치한다.

## 풀이 코드

```python
hex_list = [0x49, 0x60, 0x67, 0x74, 0x63, 0x67, 0x42, 0x66, 0x80, 0x78, 0x69, 0x69, 0x7B, 0x99, 0x6D, 0x88, 0x68, 0x94, 0x9F, 0x8D, 0x4D, 0xA5, 0x9D, 0x45]

ascii_list = []
for i in range(len(hex_list)):
    decoded = (hex_list[i] - 2 * i) ^ i
    ascii_list.append(chr(decoded))

print(''.join(ascii_list).rstrip('\x00'))
```

## 결과

![image.png](/images/image-14.png)

플래그:

```text
DH{I_am_X0_xo_Xor_eXcit1ng}
```

획득한 입력값은 `DH{}`포맷에 넣어서 인증하라고 했으니 위와 같이 플래그를 입력해주면 된다.