---
title: Dreamhack ROT128 풀이
description: DH ROT128 풀이
category: Dreamhack Crypto
tags:
  - Dreamhack
  - Crypto
  - ROT128
createdAt: 2026-11-06
updatedAt: 2026-11-06
draft: false
---
# DH ROT128

## 문제

![image.png](/images/image-8.png)

link: [ROT128 | Wargame | Dreamhack](https://dreamhack.io/wargame/challenges/852)



## 풀이

일단 소스 코드를 다운받으면 아래와 같이 암호화된 파일과 파이썬 소스 코드가 있다.

![image.png](/images/image-9.png)



```python
#!/usr/bin/env python3

hex_list = [(hex(i)[2:].zfill(2).upper()) for i in range(256)]

with open('flag.png', 'rb') as f:
    plain_s = f.read()

plain_list = [hex(i)[2:].zfill(2).upper() for i in plain_s]

enc_list = list(range(len(plain_list)))

for i in range(len(plain_list)):
    hex_b = plain_list[i]
    index = hex_list.index(hex_b)
    enc_list[i] = hex_list[(index + 128) % len(hex_list)]

enc_list = ''.join(enc_list)

with open('encfile', 'w', encoding='utf-8') as f:
    f.write(enc_list)
```

위는 `rot128.py`소스 코드 내용이다. 여기서 중요한 로직은 `for`문이다.



```python
for i in range(len(plain_list)):
    hex_b = plain_list[i]
    index = hex_list.index(hex_b)
    enc_list[i] = hex_list[(index + 128) % len(hex_list)]
```

바로 이 부분이다. `plain_list`는 기존 사진 파일의 바이트 데이터를 16진수 문자열로 변환하여 담은 리스트이고, `hex_list`는 0부터 255까지 16진수화 시킨 값들이 모여있는 리스트이다.

그리고 이 반복문에서는 `plain_list`의 길이만큼 반복하면서 각 값을 하나씩 가져온 후 `.index()`메서드를 통해 해당 값이 `hex_list`의 몇번째 인덱스에 위치한지 확인한다.

그 다음 찾은 인덱스에 128을 더하고, 256으로 나눈 나머지를 구한다. 이것이 바로 기존 인덱스에서 128칸 이동시키는 `ROT128`연산이다.

마지막으로 계산된 인덱스에 해당하는 16진수 값을 `hex_list`에서 가져와 `enc_list`에 저장한다.

이 반복문은 원본 파일의 각 바이트에 `ROT128`연산을 적용하여 암호화된 값을 생성하는 과정이다.



## 복호화 코드

```python
with open('encfile', 'r') as f:
    enc = f.read()

enc_bytes = bytes.fromhex(enc)

dec = bytes((b + 128) % 256 for b in enc_bytes)

with open('flag.png', 'wb') as f:
    f.write(dec)

print("복호화 성공!")
```

복호화 코드는 위와 같이 작성할 수 있다.

암호화된 파일 (`encfile`)을 가져와 읽고, `bytes.fromhex()`를 사용하여 파일에 저장된 16진수 문자열을 바이트 데이터로 변환한다.

이후 각 바이트에 128을 더하고 256으로 나눈 나머지를 구하는 `ROT128`연산을 다시 적용한다.

한 바이트는 0부터 255까지 총 256개의 값을 가진다. 암호화할 때 128을 더한 값에 다시 128을 더하면 총 256을 더하게 되므로, 256으로 나눈 나머지는 원래 값과 같아진다.

즉, 원본 바이트를 `x`라고 하면 `((x + 128) % 256 + 128) % 256 = (x + 256) % 256 = x`가 된다.

따라서 ROT128은 동일한 연산을 두 번 수행하면 원본 값으로 돌아오며, 복호화할 때도 128을 더하는 같은 연산을 사용할 수 있다.

마지막으로 복호화된 바이트 데이터를 `flag.png`파일로 저장하여 암호화된 이미지 파일을 복호화한다.



## 해결

이렇게 플래그를 얻을 수 있다.

![image.png](/images/image-7.png)

플래그:

```
DH{y0u_So1ved_basic_cryp7o_How_wa5_1t?}
```

