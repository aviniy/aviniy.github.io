---
title: Dreamhack ByteCaesar
description: 카이사르 암호 문제 풀이
category: Dreamhack Crypto
tags:
  - Dreamhack
  - Crypto
  - Wargame
  - Caesar
createdAt: 2026-11-09
updatedAt: 2026-11-09
draft: false
---
# DH ByteCaesar

## 문제

![image.png](/images/image-37.png)

link: [ByteCaesar | Wargame | Dreamhack](https://dreamhack.io/wargame/challenges/1817)



---



## 카이사르 암호란?

문제를 풀기에 앞서 카이사르 암호라는 것에 대해 알아보자. 흔히 **시저 암호** 라고도 불리는 **카이사르 암호(Caesar cipher)**는 암호학에서 다루는 간단한 치환암호의 일종이다. 실제로 로마의 정치가이자 장군인 카이사르는 이 카이사르 암호를 사용하기도 했다. 카이사르 암호는 암호화하고자 하는 내용을 알파벳별로 일정한 거리만큼 밀어서 다른 알파벳으로 치환하는 방식이다. 예를 들어 `Hello World!`라는 평문이 있다 해보자. 이것을 3칸만큼 카이사르 암호를 사용하면 `Khoor Zruog!`가 된다. 여기서 중요한건 일반적인 알파벳 카이사르 암호에서는 공백과 느낌표같은 기호는 그대로 유지한다는 것이다.



### 카이사르 암호와 ROT의 차이점?

**카이사르 암호(Caesar cipher)**는 평문의 각 알파벳을 일정한 칸 수만큼 이동시켜 암호화하는 고전적인 치환 암호 방식이다. 일반적으로 알파벳 26개를 기준으로 이동하며, 마지막 알파벳인 Z를 넘어가면 다시 A부터 시작한다.

**ROT(Rotate)**는 문자를 일정한 칸 수만큼 회전시키는 방식을 의미하며, ROT 뒤에 붙는 숫자는 이동할 칸 수를 나타낸다. 대표적으로 ROT13은 알파벳을 13칸 이동 시키는 방식이다.

카이사르 암호와 ROT는 기본적으로 동일한 원리를 사용하지만, 카이사르 암호는 암호화 방식 자체를 가리키는 명칭이고 ROT는 회전할 칸 수를 명시하는 표현이라는 차이가 있다. 따라서 3칸 이동하는 카이사르 암호와 ROT3은 동일한 방식이며, ROT13 역시 카이사르 암호의 한 형태라고 볼 수 있다.

이번 문제에서는 일반적인 알파벳 26개가 아닌 바이트 값 256개를 기준으로 이동시키는 변형된 카이사르 암호가 사용되었다.



---



## 문제 소스

드림핵 사이트에서 문제를 다운로드 받으면 다음과 같은 파일들이 들어있다.

![image.png](/images/image-38.png)

`secret`파일이 열고 싶게 생겨서 열어보니

![image.png](/images/image-39.png)

이렇게 친절하게 가짜라고 알려준다.. 그러면 나머지 파일들의 내용을 확인해보자.

```
I believe Caesar cipher is greatest encryption of all time.
No one can leak my secret sentence!
my encrypted sentence > 061a17d2252720d2251e21291e2bd225172625d221281724d2261a17d215131e1fded2132c272417d22115171320ded2151325261b2019d213d2281b1424132026d2261322172526242bd22118d215211e212425d2131524212525d2261a17d2251d2be0d205171319271e1e25d225211324d2192413151718271e1e2bd2212817241a171316ded2261a171b24d215131e1e25d217151a211b2019d21b20d2261a17d225131e262bd2142417172c17e0d2f325d2261a17d22913281725d2191720261e2bd21e1322d21319131b202526d2261a17d2251320162bd2251a212417ded213d22517202517d22118d22624132023271b1e1b262bd22913251a1725d221281724d21f17e0d2fbd2181b2016d225211e131517d21b20d2261a1b25d21f211f172026ded213d2221713151718271ed224172624171326d21824211fd2261a17d2142725261e1b2019d22921241e16e0d2001326272417d925d214171327262bd2172028171e212225d21f17ded224171f1b20161b2019d21f17d22118d2261a17d229212016172425d2261a1326d21e1b17d214172b212016d2212724d216131b1e2bd2242127261b201725e0d2fb20d2261a1b25d2251724172017d2251726261b2019ded2fbd2171f1424131517d2261a17d21a13241f21202bd22118d2261a17d222241725172026d2132016d21e1726d21f2bd2292124241b1725d216241b1826d21329132bd2291b261ad2261a17d2261b1617e0d2f81b20131e1e2bded2fbd2181b2016d21f2b25171e18d2251e1717221b2019d2291b261ad2261a17d2181e1319ded2f6fa2de5e914161815eae4e5e7e4e516171513e8e8e515e9e5e913e815e817e4e61815e7e8e31613e61616e7e3e718e2ebe91518ea13e6ea16e6e3e913e51814e615132f
```

위에 있는 문자들은 `output.txt`의 내용이고, 아래에 있는 코드가 `prob.py`파이썬 파일이다.

```python
import random

class Caesar:
    def __init__(self, key):
        assert isinstance(key, int) and 1 <= key <= 255
        self._key = key

    def encrypt(self, msg):
        msg_enc = b""
        for b in msg:
            msg_enc = msg_enc + bytes([(b + self._key) % 256])
        return msg_enc

    def decrypt(self, msg):
        msg_dec = b""
        for b in msg:
            msg_dec = msg_dec + bytes([(b - self._key) % 256])
        return msg_dec

def main():
    key = random.randint(1, 255)
    with open("secret", "rb") as f:
        secret = f.read()

    cipher = Caesar(key)
    secret_enc = cipher.encrypt(secret)
    print("I believe Caesar cipher is greatest encryption of all time.")
    print("No one can leak my secret sentence!")
    print(f"my encrypted sentence > {secret_enc.hex()}")

if __name__ == "__main__":
    main()
```



---



## 소스코드 분석

위에 소스코드를 분석해보자.

```python
class Caesar:
    def __init__(self, key):
        assert isinstance(key, int) and 1 <= key <= 255
        self._key = key

    def encrypt(self, msg):
        msg_enc = b""
        for b in msg:
            msg_enc = msg_enc + bytes([(b + self._key) % 256])
        return msg_enc

    def decrypt(self, msg):
        msg_dec = b""
        for b in msg:
            msg_dec = msg_dec + bytes([(b - self._key) % 256])
        return msg_dec
```

코드를 보면 클래스안에 메서드들이 정의되어있다. 클래스 내부에 정의된 `__init__()`메서드를 보면, 암호화 키가 정수형이며 1 이상 255 이하의 값을 가져야 한다는 것을 알 수 있다. 또한 `self._key = key`를 통해 전달받은 키를 객체의 속성으로 저장한다.

`encrypt()`메서드를 보면, `msg_enc = b""`를 통해 암호화된 데이터를 저장할 빈 바이트 객체를 생성한다.

이후 `for`문을 이용해 전달받은 `msg`를 바이트 단위로 순회하며, 각 바이트에 암호화 키(self._key)를 더한 뒤 256으로 나눈 나머지를 구한다.

이렇게 계산된 값을 `bytes()`를 통해 바이트 형태로 변환하고, `msg_enc`에 순차적으로 이어 붙인다. 마지막으로 암호화된 데이터를 반환한다.

`decrypt()`메서드는 암호화된 데이터를 원래 상태로 복호화 하는 역할을 한다. 메서드를 보면 먼저, `msg_dec = b""`를 통해 복호화된 데이터를 저장할 빈 바이트 객체를 생성한다.

이후 `for`문을 이용해 전달받은 암호문을 바이트 단위로 순회하며, 각 바이트에서 암호화 키를 뺀 뒤 256으로 나눈 나머지를 구한다.

계산된 값을 `bytes()`를 통해 바이트 형태로 변환하고, `msg_dec`에 순차적으로 이어붙인다. 그리고 마지막에 반환한다.



하나하나 이해하느라 말이 길어진거 같다. (생소한 문법이 많아서 이해하느라..)



---



## 취약점과 복호화 원리



본격적으로 어디에서 취약점이 발생하는지 알아보자. 먼저, `main()`함수의 `key = random.randint(1, 255)`를 보면 1부터 255까지의 정수 중 하나를 암호화 키로 선택한다는 것을 알 수 있다. 여기서 이번 풀이에 이용하는 약점은 가능한 키가 총 255개뿐이라는 점이다. 키 후보가 적기 때문에 모든 키를 대입하는 브루트포스 공격이 가능하다.

다음으로 암호화 방식인 `(b + self._key) % 256`을 보자. 이 코드는 원본 바이트 값에 키를 더하고 256으로 나눈 나머지를 구한다. 모든 바이트에 같은 키를 더하는 단순한 이동 방식이므로, 키 후보마다 반대 방향으로 이동시켜 복호화한 결과를 확인할 수 있다. 수식으로 표현하면 `C = (P + K) mod 256`이다.

여기서 C는 암호문 바이트이고, P는 평문 바이트, K는 암호화 키이다. 그럼 복호화를 하려면 어떻게 해야할까? 우리가 구해야하는건 `P`니까 `P`를 기준으로 계산해주면 된다. `P = (C - K) mod 256` 이다.

그래서 왜? 복호화 공식이 저렇게 나올까? 이건 그냥 수학적으로 유도가 가능하다. `C = (P + K) mod 256`이다. 암호화는 평문에 키를 더한 다음 256으로 나눈 나머지를 구하는 것이다.

모듈러 연산에서는 양쪽에서 같은 값을 빼도 합동 관계가 유지된다. 따라서 양쪽에서 `K`를 빼면..

$$

C-K\equiv P+K-K\pmod{256}

$$

가 되고 오른쪽에 `K`가 상쇄되므로..

$$

C-K\equiv P\pmod{256}

$$

이다. 결국 `P = (C - K) mod 256`이 된다. 즉 암호화할때 더했던 키를 복호화할때 빼서 원래 값을 복원하는 것이다. 여기서 주의할점은 복호화에도 `mod 256`을 사용해야한다는 것이다.

예를 들어, 평문 바이트가 `P = 250`이고 키가 `K = 10`이면 암호문 바이트는 `(250 + 10) % 256 = 4`가 된다. 여기서 키만 빼면 `4 - 10 = -6`이지만, 다시 `mod 256`을 적용하면 파이썬에서 `-6 % 256 = 250`이 되어 원래 바이트를 복원할 수 있다.



&nbsp;

---



## 복호화 코드

그래서 복호화 코드는 다음과 같이 작성하였다. 먼저, 암호문을 읽어오고, 16진수 문자열을 바이트 데이터로 변환한 후, 브루트포스 공격을 진행한다. 복호화 결과에 `DH{`가 포함되어 있으면 키 값과 복호화한 내용을 출력하고, 닫는 중괄호 `}`도 있으면 플래그를 추출해 출력한다. 이후 반복문(브루트포스)을 종료한다.

```python
# 암호문 읽기
with open("C:\\exploits\\output.txt", "r") as f:
    data = f.read()

# 암호문 추출 및 16진수 문자열을 바이트 데이터로 변환
hex_data = data.split("my encrypted sentence > ")[1].strip()
ciphertext = bytes.fromhex(hex_data)

# 브루트포스
for key in range(1, 256):

    plaintext = bytes(
        (b - key) % 256 for b in ciphertext
    )

    # 복호화된 평문에 "DH{"가 포함되어 있는지 확인
    if b"DH{" in plaintext:
        print(f"키 값: {key}")
        print(f"복호화 결과:\n{plaintext.decode()}")

        start = plaintext.find(b"DH{")
        end = plaintext.find(b"}", start)

        if end != -1:
            flag = plaintext[start:end + 1].decode()
            print(f"\n플래그: {flag}")

        break
```



---



## 결과

![image.png](/images/image-40.png)



플래그:

```
DH{37bdfc823523deca663c737a6c6e24fc561da4dd515f097cf8a48d417a3fb4ca}
```

