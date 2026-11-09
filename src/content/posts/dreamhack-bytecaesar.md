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

문제를 풀기에 앞서 카이사르 암호라는 것에 대해 알아보자. 흔히 **시저 암호** 라고도 불리는 **카이사르 암호(Caesar cipher)**는 암호학에서 다루는 간단한 치환암호의 일종이다. 실제로 로마의 황제 카이사르는 이 카이사르 암호를 사용하기도 했다. 카이사르 암호는 암호화하고자 하는 내용을 알파벳별로 일정한 거리만큼 밀어서 다른 알파벳으로 치환하는 방식이다. 예를 들어 `Hello World!`라는 평문이 있다 해보자. 이것을 3칸만큼 카이사르 암호를 사용하면 `Khoor Zroug!`가 된다. 여기서 중요한건 공백과 느낌표같은 기호는 그대로 유지한다는 것이다.



### 카이사르 암호와 ROT의 차이점?

**카이사르 암호(Caesar cipher)**는 평문의 각 알파벳을 일정한 칸 수만큼 이동시켜 암호화하는 고전적인 치환 암호 방식이다. 일반적으로 알파벳 26개를 기준으로 이동하며, 마지막 알파벳인 Z를 넘어가면 다시 A부터 시작한다.

**ROT(Rotate)**는 문자를 일정한 칸 수만큼 회전시키는 방식을 의미하며, ROT 뒤에 붙는 숫자는 이동할 칸 수를 나타낸다. 대표적으로 ROT13은 알파벳을 13칸 이동 시키는 방식이다.

카이사르 암호화 ROT는 기본적으로 동일한 원리를 사용하지만, 카이사르 암호는 암호화 방식 자체를 가르키는 명칭이고 ROT는 회전할 칸 수를 명시하는 표현이라는 차이가 있다. 따라서 3칸 이동하는 카이사르 암호와 ROT3은 동일한 방식이며, ROT13 역시 카이사르 암호의 한 형태라고 볼 수 있다.

이번 문제에서는 일반적인 알파벳 26개가 아닌 바이트 값 256개를 기준으로 이동시키는 변형된 카이사르 암호가 사용되었다.



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

```
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



&nbsp;

&nbsp;

&nbsp;