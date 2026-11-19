---
title: Dreamhack STREAMer-Prototype
description: 드림핵 스트림 사이퍼 암호 워게임 문제 풀이
category: Dreamhack Crypto
createdAt: 2026-11-19
updatedAt: 2026-11-19
draft: false
---
# DH - STREAMer-Prototype

## 문제

![image.png](/images/image-80.png)

link: [STREAMer-Prototype | Wargame | Dreamhack](https://dreamhack.io/wargame/challenges/1534)

해석: 내가 직접 프로토타입 스트림 암호(Stream Cipher)를 구현했는데, 꽤 안전하다고 생각해. 이 암호를 뚫어서 내 플래그(flag)를 알아낼 수 있겠어?



---

## 스트림 암호란?

스트림 암호는 평문과 키스트림(Keystream)을 XOR 연산해서 암호문을 만드는 방식이다. 수식으로 하면 `C = P ^ K`이다. C는 암호문, P는 평문, K는 키스트림이다.



## 풀이

문제 파일을 다운 받으면 아래와 같이 4개의 파일이 들어있다.

![image.png](/images/image-81.png)

`flag`파일에는 페이크 플래그가 들어가 있고, 아마도 중요하게 봐야하는건 `cipher.py`와 `prob.py`인거 같다.

### 소스 분석

그러면 소스 코드들을 확인해보자. 아래는 `cipher.py`내용이다.

```python
class STREAM:
    def __init__(self, seed, size):
        self.state = self.num2bits(seed, size)

    def num2bits(self, num, size):
        assert num < (1 << size)

        return bin(num)[2:].zfill(size)
    
    def bits2num(self, bits):
        return int('0b' + bits, 2)
    
    def shift(self):
        new_bit = self.state[-1]
        self.state = new_bit + self.state[:-1]

        return new_bit
    
    def getNbits(self, num):
        sequence = ""
        for _ in range(num):
            sequence += self.shift()
        
        return sequence

    def encrypt(self, plaintext):
        ciphertext = b""
        for p in plaintext:
            stream = self.bits2num(self.getNbits(8))
            c = p ^ stream
            ciphertext += bytes([c])

        return ciphertext

    def decrypt(self, ciphertext):
        plaintext = b""
        for c in ciphertext:
            stream = self.bits2num(self.getNbits(8))
            p = c ^ stream
            plaintext += bytes([p])

        return plaintext


if __name__ == "__main__":
    import os

    for seed in range(0x100):
        Alice = STREAM(seed, 16)
        Bob = STREAM(seed, 16)
        plaintext = os.urandom(128)
        ciphertext = Alice.encrypt(plaintext)
        assert plaintext == Bob.decrypt(ciphertext)
```

먼저 아래의 `encrypt()`함수의 정의를 확인하여보자.

```python
def encrypt(self, plaintext):
    ciphertext = b""
    for p in plaintext:
        stream = self.bits2num(self.getNbits(8))
        c = p ^ stream
        ciphertext += bytes([c])

    return ciphertext
```

위 코드가 어떤 기능을 하는지 보면, `ciphertext`라는 빈 바이트 문자열을 생성하고, 평문을 가져와서 암호화에 사용할 8비트 키스트림을 생성하고, 평문과 키스트림을 XOR 연산하여 암호화를 한다. 그 후 암호화된 1바이트를 암호문 뒤에 추가한다.

```python
def shift(self):
    new_bit = self.state[-1]
    self.state = new_bit + self.state[:-1]
```

그 다음으로 중요한 코드는 위 코드이다. 위 코드의 기능은 `self.state`에 저장된 마지막 비트를 가져오고 마지막 비트를 맨 앞으로 이동시키는 오른쪽 순환 시프트를 한다.

이 과정에서는 새로운 비트가 생성되지 않고 기존 비트의 위치만 변경된다. 따라서 내부 상태가 16비트인 경우 16번 순환하면 원래 상태로 돌아오며, 이로 인해 키스트림이 16비트마다 반복되는 취약점이 발생한다.

```
from cipher import STREAM
import random


if __name__ == "__main__":
    with open("flag", "rb") as f:
        flag = f.read()

    assert flag[:3] == b'DH{' and flag[-1:] == b'}'

    seed = random.getrandbits(16)
    stream = STREAM(seed, 16)

    print(f"encrypted flag > {stream.encrypt(flag).hex()}")
```

위 코드는 `prob.py`이다. `prob.py`는 `flag` 파일을 읽어 온 뒤, 무작위로 생성한 16비트 시드를 이용해 `flag`를 암호화하는 코드이다.

여기서 `assert`문을 통해 FLAG가 `DH{...}` 형태라는 것을 알 수 있다. 또한 `STREAM(seed, 16)`을 통해 내부 상태가 16비트임을 확인할 수 있다.

`cipher.py`의 `shift()` 함수는 비트를 단순히 순환시키므로 키스트림이 16비트마다 반복된다.

따라서 가능한 시드의 개수는 (2^{16}=65,536)개이므로 브루트포스 공격이 가능하다. 모든 시드를 대입하여 암호문을 복호화한 뒤, `DH{`로 시작하고 `}`로 끝나는 평문을 찾아 FLAG를 추출할 수 있다.

```
대략적인 흐름)

flag(플래그) -> prob.py -> flag 파일 읽기 -> cipher.py에서 STREAM 클래스 불러오기 -> 암호화 진행
```



### 복호화 코드

```python
from cipher import STREAM

with open("C:/exploits/output.txt", "r") as f:
    data = f.read().split("> ")[1].strip()

ciphertext = bytes.fromhex(data)

for seed in range(65536):
    stream = STREAM(seed, 16)

    plaintext = stream.decrypt(ciphertext)

    if plaintext.startswith(b"DH{") and plaintext.endswith(b"}"):
        print("seed:", seed)
        print("flag:", plaintext.decode())
        break
```

먼저 `cipher.py`에 정의되어 있는 함수들을 사용하기 위해 `STREAM`클래스를 가져온다. 그 후 암호화된 텍스트가 담겨져있는 파일을 읽는다. (`>` 를 기준으로 분리해서 1번째 인덱스를 가져옴.) 그 다음, 16진수 문자열을 바이트로 변환해준다. 변환하는 이유는 `STREAM.decrypt()`함수가 바이트 단위로 암호문을 처리하기 때문이다. 그리고 시드가 16비트이기 때문에 표현할 수 있는 시드는 총 `2^16 = 65536`개로 브루트포스 공격을 진행해준다. 그렇게 브루트포스로 대입하고 `DH{..}`형태가 나오면 값을 출력하고 반복문을 종료한다.



---



## 해결

이렇게 아래와 같이 플래그를 획득할 수 있다.

![image.png](/images/image-82.png)

플래그:

```
DH{a2e8d10e942df6ca8851ef12b8b8377d44e8451983958dceaed65adcfb6769ab}
```

