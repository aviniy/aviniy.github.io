---
title: Dreamhack Affe!n
description: 아핀 암호 관련 드림핵 워게임 문제 풀이
category: Dreamhack Crypto
tags:
  - Dreamhack
  - Crypto
  - Wargame
  - Affine
createdAt: 2026-11-08
updatedAt: 2026-11-08
draft: false
---
# DH - Affe!n

## 문제

![image.png](/images/image-26.png)

문제만 봐서는 어떻게 풀지 감이 안 온다. 근데 문제에 **Byte-Affine cipher**라는 말이 나온다. 암호 관련 문제인 만큼 저것을 조사해보기 시작했다. (link: [Affe!n | Wargame | Dreamhack](https://dreamhack.io/wargame/challenges/1752))



---



## Affine 암호란?

아핀 암호(Affine Cipher)는 수학적 연산을 이용해 문자를 다른 문자로 바꾸는 고전적인 단일 문자 치환 암호이다. 문자를 숫자로 변환한 뒤, 곱셈과 덧샘, 모듈러 연산을 이용해 암호화하는 방식이다. 암호화 공식은 다음과 같다.

![image.png](/images/image-27.png)

x는 원본 문자의 숫자 값이고, a와 b는 암호화에 사용하는 두개의 키이고, m은 사용하는 문자의 집합의 크기이다. 원본 문자의 숫자 값이라는 말은 문자의 집합에서의 인덱스(index)값이다. A면 0 B면 1 C면 2... 처럼..

그럼 한번 예시로 아핀 암호를 활용하여 암호를 만들어 보겠다.

키가 `a = 5`, `b = 8`일 때 문자 `A`를 암호화하면 `E(0) = (5 * 0 + 8) mod 26 = 8`이다. 숫자 8은 알파벳 `I`이므로 A가 I로 바뀌는것이다. m이 26인 이유는 영어 알파벳이 총 26개이기 때문이다.

그럼 복호화는 어떻게 해야할까? 복호화 공식은 아래와 같다.

![image.png](/images/image-28.png)

자세한 증명은 스터디 노트에서 이어해보도록 하겠다. ([아핀 암호의 복호화 공식과 모듈러 연산 · Aviniy's Lab](https://aviniy.github.io/lab/posts/affine-cipher-decryption/))



---



## 풀이

그래서 어떻게 풀어야할까? 일단 파일을 다운 받아본다. 그러면 아래와 같이 `output.txt`와 `prob.py`이라는 파이썬 파일이 있다.

![image.png](/images/image-30.png)

한번 소스코드를 하나씩 보도록 하자.

## 소스 코드 분석

아래는 `output.txt`의 내용이다. 상당히 긴 암호화문을 볼 수 있다.

```
my encrypted sentence > c5142269dc717163f322697f639614223969638869dc69d76c962269477169a447f347dc559
614dc3022d7637f69882b3088d763d72bd76347f3697f6396142239692b8822ce6963f3697
f396c96d747c039dc96146ccf6951d769638869dc698863a496552269dcf3ce69dcf37f632
2f3d769a422d71447ce6947716922f37f396c96d763f3c069dc69a4228888dcc022cf6951f
369d7146388697f6396142239316922dc7f14695522d7d7223969477169d71422699655dc6
3f3d7221dd76963886971633988d769a4dc969622ce69d7476963d78869f32ba42239637fd
c556922e52b637adc5522f3d7692b8863f3c069d714226996478863d76347f36963f369d71
42269dc559614dc3022d769eb22cfc0cf3169ca897231691e89c13169cfcfcf3169a989150
73fcf69c51422f33169d71422695522d7d722399c8869f32ba42239637fdc55697adc552b2
269638869a42b55d76396556322ce69306c69dc697f47f388d7dcf3d7699cdc9c69dcf3ce6
9d71422f369dccece22ce69d74769dcf347d7142239697f47f388d7dcf3d7699c30cf9c69c
51422693922882b55d769638869d7dc0622f369a447ce2b554769155669d747694730d7dc6
3f369d71422697f47393922889647f3ce63f3c0697f6396142239d7221dd7695522d7d7223
9cf69c51422697f47f388d7dcf3d788699cdc9c69dcf3ce699c309c69dc392269d71422690
6226c8869477169d71422697f639614223969dcf3ce69dc3922697fdc3922712b55556c697
f14478822f369d7476922f3882b392269d714226922f37f396c96d76347f369dcf3ce69ce2
27f396c96d76347f3699639477f2288882288697fdcf3693022697f473939227fd7556c693
9227a22398822cecf69c5142269dc717163f322697f6396142239699639477a63ce228869d
c695563a463d722ce6955227a22556947716988227f2b3963d76c69dcf3ce697fdcf369302
26922dc8863556c693039470622f3692b8863f3c069713922e52b22f37f6c69dcf3dc556c8
8638869637169d714226906226c69638869f347d769c9225555697f14478822f3cf690247c
9227a22393169c963d71469dc96963947963963dcd7226906226c69882255227fd76347f33
16963d7697fdcf3698822397a2269dc8869dc6930dc88637f69a422d71447ce6947716922f
37f396c96d76347f36963f36922ce2b7fdcd76347f3dc556947396939227f3922dcd76347f
3dc55698822d7d763f3c088cf69e147c9316914223922697f47a4228869d71422697155dcc
08069bc020f64717fce5672ceb356717172643056717fce64dc56ceb37fa5c1f4720730c16
4c171f471b3f4dc71077171ce71b37130b33048dc30a57f7107dc7248dcb32271ad
```



아래에는 `prob.py`의 파이썬 소스 코드 내용이다.

```python
import random

class Affine:
    def __init__(self, key1, key2):
        assert isinstance(key1, int) and 1 <= key1 <= 250
        assert isinstance(key2, int) and 1 <= key2 <= 250
        self._key1 = key1
        self._key2 = key2

    def encrypt(self, msg):
        msg_enc = b""
        for b in msg:
            msg_enc = msg_enc + bytes([(self._key1 * b + self._key2) % 251])
        return msg_enc

    def decrypt(self, msg):
        msg_dec = b""
        for b in msg:
            msg_dec = msg_dec + bytes([pow(self._key1, -1, 251) * (b - self._key2) % 251])
        return msg_dec

def main():
    key1, key2 = random.randint(1, 250), random.randint(1, 250)
    with open("secret", "rb") as f:
        secret = f.read()
    assert b'cryptography' in secret
    
    cipher = Affine(key1, key2)
    secret_enc = cipher.encrypt(secret)
    
    print("Affine cipher? It's quite fine :>")
    print("No one can leak my secret sentence!")
    print(f"my encrypted sentence > {secret_enc.hex()}")

if __name__ == '__main__':
    main()
```

이 파이썬 코드에서 중요한건 크게 4가지로 볼 수 있다.



### 암호화 방식 확인

```python
msg_enc = msg_enc + bytes([(self._key1 * b + self._key2) % 251])
```

이 부분에서 아핀 암호를 사용한다는 걸 알 수 있다. 코드에 있는 걸 수학 공식에 대입해보면 `E(x) = (key1 * x + key2) mod 251`이 된다. 참고로 모듈러 연산은 파이썬에서 나머지 연산과 같다.



### 암호화 키의 범위 확인

```python
key1, key2 = random.randint(1, 250), random.randint(1, 250)
```

이 부분이 중요한 이유는 `key1`과 `key2`의 범위는 1부터 250까지이고 따라서 가능한 키 조합은 62,500개 라는 것을 알 수 있다. 가능한 키 조합이 적기 때문에 브루트포스 공격으로 모든 키를 검사할 수 있다.



### 평문에 대한 힌트

```python
assert b'cryptography' in secret
```

이 부분은 이번 문제에서 가장 결정적인 코드이다. 이 코드로부터 암호화되기 전의 평문이 반드시 `cryptography`라는 문자열이 포함되어 있다는 사실을 알 수 있다. 따라서 모든 키 조합으로 암호문을 복호화한 다음, 결과에 `cryptography`가 포함되는지 검사하면 된다.



### 복호화 공식 확인

```python
msg_dec = msg_dec + bytes([
    pow(self._key1, -1, 251) * (b - self._key2) % 251
])
```

이 부분은 복호화 함수이다. 여기서 `pow(self._key1, -1, 251)` 이 부분은 `key1`의 `mod 251`에 대한 모듈러 곱셈 역원을 계산하는 코드이다. 즉, 문제에서 복호화 함수까지 제공하고 있기 때문에 별도로 복호화 알고리즘을 구현할 필요 없이 기존 코드를 활용하면 된다.



---



## 복호화 코드

```python
# output.txt 파일 읽기
with open("C:\\exploits\\output.txt", "r") as f:
    data = f.read()

# 암호문 추출
encrypted_hex = data.split("my encrypted sentence > ")[1].strip()

# HEX -> bytes 변환
encrypted = bytes.fromhex(encrypted_hex)

# 브루트포스
for a in range(1, 251):
    inv_a = pow(a, -1, 251)

    for b in range(1, 251):
        decrypted = bytes(
            (inv_a * (x - b)) % 251
            for x in encrypted
        )

        if b"cryptography" in decrypted:
            print(f"[+] key1 = {a}, key2 = {b}")
            print(f"[+] plaintext: {decrypted.decode()}")
```

코드의 흐름은 먼저 `output.txt`의 암호화문의 전체 내용을 문자열로 읽어온 다음, `my encrypted sentence >`뒤에 있는 16진수 문자열을 바이트 데이터로 변환한다. 그 다음에 브루트포스 대입 공격을 하고 `cryptography`라는 내용이 포함되면 `key1`과 `key2`값을 출력하고 복호화된 내용을 출력한다.



---



## 결과

![image.png](/images/image-31.png)

이렇게 플래그를 얻을 수 있다.



플래그:

```
DH{3fcd60d46ff03b6fcd3a6d4c71805b131f8f48af5ffdf4fb4b9ab7cf5a09a4ef}
```

