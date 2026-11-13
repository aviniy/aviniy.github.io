---
title: Dreamhack EVER-igen
description: 비즈네르 암호 관련 워게임 문제 풀이
category: Dreamhack Crypto
createdAt: 2026-11-13
updatedAt: 2026-11-13
draft: false
---
## 문제

![image.png](/images/image-54.png)

link: [EVER-igen | Wargame | Dreamhack](https://dreamhack.io/wargame/challenges/1277)

문제 설명을 읽어보면 Vigenere를 어떻게 하는지 아냐고 물어본다. 문제를 풀기 위해 Vigenere가 뭔지 알아보자.



---

## 비즈네르 암호란?

문제에서 말하는 Vigenere는 아마 비즈네르 암호에 관한 내용일것이다. 그러면 이 비즈네르 암호가 뭔지 알아보자. 비즈네르 암호는 프랑스 외교관이었던 블레즈 드 비즈네르에 의하여 1586년에 발표된 암호이다. 비즈네르 암호의 장점은 '빈도분석법'으로 해독이 거의 불가능하다는 사실이다. 또한, 열쇠의 개수가 무궁무진하다는 것도 큰 장점이다. (빈도분석법이 무엇인지, 비즈네르 암호를 해독하는 방법이 있는지 스터디 노트에서 다뤄보도록 하겠다.)

![image.png](/images/image-56.png)

(사진 출처: [비즈네르 암호 - 위키백과, 우리 모두의 백과사전](https://ko.wikipedia.org/wiki/%EB%B9%84%EC%A6%88%EB%84%A4%EB%A5%B4_%EC%95%94%ED%98%B8))

먼저 암호문 제작을 위해서 위와 같은 '비즈네르 표'를 만들어야 한다. 표에서 가로는 평문, 세로는 이동 칸 수가 적혀있다. 그리고 평문과 키를 정해야한다. 예를 들어 평문을 `HELLO`로 하고 키를 `CAT`으로 해보겠다. 비즈네르 암호에서는 일반적으로 알파벳에 숫자를 부여한다. (`A = 0`, `B = 1` .. `Z = 25`) 그렇기 때문에, `CAT`은 `C`는 2이고, `A`는 0이고, `T`는 19이다.

이제 평문 `HELLO`를 키 `CAT`을 이용해 암호화해보자. 먼저 비즈네르 암호는 평문의 각 문자에 키를 순서대로 적용하는 방식이다. 만약 키의 길이가 평문보다 짧다면 키를 반복해서 사용한다. 따라서 평문과 키를 나열하면 다음과 같다.

```
평문: H E L L O
키:  C A T C A
```

앞서 설명했듯이 알파벳은 A부터 0으로 시작하기 때문에 키 `CAT`은 각각 `2, 0, 19` 의 이동값을 가진다. (즉 글자 하나씩 마다 다른 ROT 알고리즘을 적용한것이다.)

표를 보고 정리하면 H는 2만큼 이동하니까 J가 되고, E는 0만큼 이동하니 그대로인 E, 3번째 L은 19칸 만큼 이동하니 E, 4번째 L은 2칸 만큼 이동하니 N, O는 0칸 만큼 이동하니 그대로인 O가 된다. 즉 평문 `HELLO`를 `CAT` 이라는 키로 암호화하면 `JEENO`가 된다.



## 풀이

그럼 간단한 개념을 봤으니 본격적으로 문제를 해결해보자.

### 소스코드 분석

아래는 `prob.py`의 나와있는 코드이다.

```python
import random
from string import ascii_lowercase, ascii_uppercase, digits

words = ascii_uppercase + ascii_lowercase + digits
class Vigenere:
    def __init__(self, key):
        self._key = key

    def shift(self, a, d):
        if a not in words:
            return a
        index = words.index(a)
        return words[(index + d) % len(words)]

    def encrypt(self, pt):
        ct = ""
        for i in range(len(pt)):
            ct += self.shift(pt[i], self._key[i % len(self._key)])
        return ct

    def decrypt(self, ct):
        pt = ""
        for i in range(len(ct)):
            pt += self.shift(ct[i], -self._key[i % len(self._key)])
        return pt

def main():
    key = [random.randint(0, len(words)) for _ in range(16)]
    with open("secret", "r") as f:
        secret = f.read()

    assert "Vigenere", "cipher" in secret
    cipher = Vigenere(key)
    secret_enc = cipher.encrypt(secret)
    print(f"my encrypted sentence > {secret_enc}")

if __name__ == '__main__':
    main()
```

코드의 중요한 부분을 확인해보자.

```python
words = ascii_uppercase + ascii_lowercase + digits
```

위에서 봤던 비즈네르 표처럼 일반적인 비즈네르 암호는 알파벳 26개를 사용하지만, 위 코드를 보면 소스 코드는 총 62개의 문자를 사용한다는 것을 알 수 있다. (대문자 26개, 소문자 26개, 숫자 10개 26 + 26 + 10 = 62)

```python
def shift(self, a, d):
    if a not in words:
        return a
    index = words.index(a)
    return words[(index + d) % len(words)]
```

위 코드가 실제 암호화를 수행하는 핵심 함수이다. 예를 들어 `shift('A', 3)`을 실행한다 해보자. `A`의 인덱스 값은 0이고 이동값은 3이니까 A는 D가 된다. 그리고 `words`에 포함이 되지 않은 글자는 그대로 반환한다. (특수문자 등)

```python
def encrypt(self, pt):
    ct = ""
    for i in range(len(pt)):
        ct += self.shift(pt[i], self._key[i % len(self._key)])
    return ct
```

위 코드는 평문(pt)을 암호문(ct)으로 바꾸는 함수이다. 빈 문자열을 생성 후 평문(pt)의 길이만큼 shift 함수를 사용해서 암호화된 글자를 암호를 담을 공간(ct)에 담은 후 완성된 암호문(ct)을 반환한다.

문제에서는 고맙게도 복호화 코드까지 적어놨다.

```python
    def decrypt(self, ct):
        pt = ""
        for i in range(len(ct)):
            pt += self.shift(ct[i], -self._key[i % len(self._key)])
        return pt
```

그럼 복호화 코드가 왜 이렇게 나오는걸까? 암호화 코드와 복호화 코드를 봐보자.

```python
ct += self.shift(pt[i], self._key[i % len(self._key)])

pt += self.shift(ct[i], -self._key[i % len(self._key)])
```

보다시피 암호화 코드에는 `-`가 없고 복호화 코드에는 `-`가 있다. 왜냐하면 암호화 할때 그 문자가 이동한 만큼 거꾸로 이동하면 원래 문자로 돌아오기 때문이다. 위에 예시에서 평문이 `HELLO`이고 키가 `CAT`이라는 예시를 들었으니, 같은 예시로 해보자. 아까 설명한대로 암호화 과정은 아래와 같다.

```
평문:  H E L L O
키:    2 0 19 2 0
암호문: J E e N O
```

이제 여기서 복호화를 하려면 어떻게 해야할까? 우리가 앞으로 세걸음 가고 뒤로 세걸음 가면 제자리인거 처럼, 똑같이 원래 키만큼 돌려주면 된다.

```
암호문: J E  e  N  O
키:   -2 0 -19 -2 0
평문:   H E  L  L O
```



![image.png](/images/image-57.png)



output.txt



&nbsp;

&nbsp;

&nbsp;

&nbsp;

&nbsp;

## 디코딩 코드

## 해결

(해당 문제 라이트업을 작성하고 있었는데 날라가서 다시 작성했다.)