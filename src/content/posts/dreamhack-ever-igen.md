---
title: Dreamhack EVER-igen
description: 비즈네르 암호 관련 워게임 문제 풀이
category: Dreamhack Crypto
createdAt: 2026-11-13
updatedAt: 2026-11-13
draft: false
tags:
  - Dreamhack
  - Crypto
  - Wargame
  - Vigenere
---
# DH - EVER-igen

## 문제

![image.png](/images/image-54.png)

link: [EVER-igen | Wargame | Dreamhack](https://dreamhack.io/wargame/challenges/1277)

문제 설명을 읽어보면 Vigenere를 어떻게 하는지 아냐고 물어본다. 문제를 풀기 위해 Vigenere가 뭔지 알아보자.



---

## 비즈네르 암호란?

문제에서 말하는 Vigenere는 아마 비즈네르 암호에 관한 내용일것이다. 그러면 이 비즈네르 암호가 뭔지 알아보자. 비즈네르 암호는 프랑스 외교관이었던 블레즈 드 비즈네르에 의하여 1586년에 발표된 암호이다. 비즈네르 암호의 장점은 단순한 빈도분석으로 해독하기 어렵다는 점이다. 같은 글자도 키에 따라 서로 다른 글자로 바뀌기 때문에, 암호문에서 자주 나오는 글자만 보고 원래 글자를 추측하기 어려워진다. 또한, 열쇠의 개수가 무궁무진하다는 것도 큰 장점이다. (빈도분석법: 문자마다 등장하는 횟수가 다르다는 점을 이용해 암호를 푸는 방법이다.)

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



---

## 풀이

그럼 간단한 개념을 봤으니 본격적으로 문제를 해결해보자.

### 소스코드 분석

![image.png](/images/image-58.png)

위에는 `output.txt`, 아래는 `prob.py`의 나와있는 코드이다.

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

어 근데? 왜 세번째 `L`이 왜 소문자로 `e`가 되나? 아까 예시에선 `A`부터 `Z`까지 26개만 다뤘고 이번 예시에선 대문자, 소문자, 숫자까지 총 62개를 다루기 때문이다. 62개중, `L`은 인덱스 11번이고 19가 더해지니까 인덱스 30번째인 `e`가 되는것이다.

참고로 순서는 아래와 같다.

```
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
```

---

## 복호화 코드

### 제작 과정

일단 복호화를 하려면 키가 필요한데 `prob.py`에서 `main()`함수가 정의된 부분을 보면..

```python
key = [random.randint(0, len(words)) for _ in range(16)]
```

위와 같이 62개중(대문자, 소문자, 숫자) 16개를 랜덤하게 뽑아서 키를 만든다는걸 알 수 있다.

해결하기 위해 빈도분석법을 사용해보자. 어? 근데 아까 빈도분석법으로 해독하기 어렵다 하지 않았나? 왜 여기서 써먹냐하는 질문이 생길 수 있다. 여기서 중요한 건 키가 반복된다는 점이다. 우리는 키 길이가 16이라는 걸 알고 있으니까, 0번째, 16번째, 32번째처럼 같은 키값을 사용하는 문자끼리 모을 수 있다. 이렇게 모은 문자들은 모두 같은 값만큼 이동했으니, 각 그룹에 따로 빈도분석을 시도해볼 수 있다. 물론 이 방법으로 항상 정확한 키가 나오는 건 아니다. 그래서 일단 아래와 같은 파이썬 코드를 작성해보았다.

```
from string import ascii_uppercase, ascii_lowercase, digits
from collections import Counter

words = ascii_uppercase + ascii_lowercase + digits

# 영어에서 자주 등장하는 문자
freq = {
    'e': 12.7, 't': 9.1, 'a': 8.2,
    'o': 7.5, 'i': 7.0, 'n': 6.7,
    's': 6.3, 'h': 6.1, 'r': 6.0,
    'd': 4.3, 'l': 4.0, 'u': 2.8
}

def shift(c, d):
    if c not in words:
        return c
    return words[(words.index(c) + d) % 62]

def score(text):
    text = text.lower()
    return sum(freq.get(c, 0) for c in text)

with open("C:\\exploits\\output.txt", "r", encoding="utf-8") as f:
    data = f.read()

ct = data.split("my encrypted sentence > ", 1)[1].rstrip("\n")

key = []

for i in range(16):
    group = ct[i::16]

    candidates = []

    for k in range(62):
        decrypted = ''.join(shift(c, -k) for c in group)
        candidates.append((score(decrypted), k))

    best = max(candidates)
    key.append(best[1])

print("추정한 키:", key)

pt = ""

for i in range(len(ct)):
    pt += shift(ct[i], -key[i % 16])

print("복호화 결과:")
print(pt)
```

위 코드의 대략적인 흐름은 먼저 암호화에 사용되는 문자를 설정하고, 영어 문자 빈도 설정을 한다. 그 후 `output.txt`를 읽어오고 문자별 가중치를 합산해서 빈도분석 점수를 계산한다. 그리고 점수가 제일 높으면 그 키값을 기준으로 복호화를 한다.

![image.png](/images/image-59.png)

음 그렇게 하니까 위와 같이 조금은 알아볼 수 있지만 완전하게 복호화가 되지 않은걸 알 수 있다. 그러고 보니 내가 간과(?)한게 있었다. 아까 `prob.py`에서 다음과 같은 코드가 있었다.

```python
assert "Vigenere", "cipher" in secret
```

여기서 위와 같은 코드가 눈에 들어왔다. 해당 `assert`문은 문법상 두 단어의 포함 여부를 검사하지 않는다. 그럼 출제자는 굳이 들어갈 필요 없는 코드를 왜 써둔걸까? 그래서 나는 출제자가 평문에 `Vigenere`와 `cipher`가 포함된다 힌트를 줬다고 생각하고 한번 두 단어를 예상 평문으로 사용해봤다.

```python
from string import ascii_uppercase, ascii_lowercase, digits

words = ascii_uppercase + ascii_lowercase + digits

with open(r"C:\exploits\output.txt", encoding="utf-8") as f:
    ct = f.read().split("my encrypted sentence > ", 1)[1].rstrip("\r\n")

def shift(c, k):
    return words[(words.index(c) - k) % 62] if c in words else c

def find_keys(word):
    for pos in range(len(ct) - len(word) + 1):
        key = [None] * 16

        for i, p in enumerate(word):
            c = ct[pos + i]

            if c not in words:
                break

            key[(pos + i) % 16] = (words.index(c) - words.index(p)) % 62
        else:
            yield pos, key

v = list(find_keys("Vigenere"))
c = list(find_keys("cipher"))

print("Vigenere 후보:", len(v))
print("cipher 후보:", len(c))

results = []

for vp, vk in v:
    for cp, ck in c:
        if vp < cp + 6 and cp < vp + 8:
            continue

        if any(a != b for a, b in zip(vk, ck)
               if a is not None and b is not None):
            continue

        key = [a if a is not None else b for a, b in zip(vk, ck)]

        if key.count(None) <= 2:
            results.append((vp, cp, key))

print("일치하는 후보:", len(results))

for vp, cp, key in results[:30]:
    temp = [k if k is not None else 0 for k in key]
    pt = "".join(shift(ch, temp[i % 16]) for i, ch in enumerate(ct))

    print("\n" + "=" * 60)
    print("Vigenere 위치:", vp)
    print("cipher 위치:", cp)
    print("추정한 키:", key)
    print("예상 복호화:")
    print(pt)
```

처음에는 영어 문자 빈도로 키를 추측했지만.. 이번에는 평문에 들어 있을 것 같은 단어를 이용해서 키를 거꾸로 구해봤다.

먼저 두 단어가 어디에 들어갈지 모르니까 가능한 위치에 하나씩 대입해본다. 그 위치의 암호문과 예상한 평문을 비교하면 `K = (C - P) % 62`로 키값을 구할 수 있다. 이렇게 두 단어에서 구한 키값이 서로 맞는지 확인하고, 16개 중 14개 이상을 알아낸 후보만 남겼다. 아직 모르는 키값에는 일단 0을 넣고, 어느 정도까지 읽히는지 확인해봤다.

![image.png](/images/image-60.png)

오 이제 `DH{}`포멧 형태도 잘 나온다. 그리고 `Vigenere`라는 단어와 `cipher`라는 단어가 조금씩 나오는걸 볼 수 있다. 나는 여기서 한가지 잔머리(?)라고 해야하나 추리를 해보았다. 아까 내가 맨 처음에 1586년에 프랑스 외교관이었던 블레즈 드 비즈네르에 의하여 발표되었다고 했다? 근데 잘 봐보자 예상 복호화문 첫번째 줄에 1586이라는 숫자가 정확히 나온다. 우연이라고 하기엔 무언가 있는거 같다? 그리고 계속 확인해보자. 특히 `BlXoei NP Vigenere`이 부분 비즈네르 풀네임이 '블레즈 드 비즈네르' 이라고 했는데 저 문장과 거의 맞는다. 그리고 앞에 `Bl`이 부분도 `블`을 나타내는 영어문자같다. 오 그러면 한번 블레즈 드 비즈네르의 영어 표기를 확인해보자.

![image.png](/images/image-61.png)

이렇게 친절하게 알려준다. 심지어 6글자 2글자 `Vigenere`이다. 오 그럼? 첫번째 줄에 저 이름이 들어갔겠구나 생각했다. 그래서 코드를 다음과 같이 수정해줬다.

```python
from string import ascii_uppercase, ascii_lowercase, digits

words = ascii_uppercase + ascii_lowercase + digits

with open(r"C:\exploits\output.txt", encoding="utf-8") as f:
    ct = f.read().split("my encrypted sentence > ", 1)[1].rstrip("\r\n")

def find_keys(word):
    for pos in range(len(ct) - len(word) + 1):
        key = [None] * 16

        for i, p in enumerate(word):
            c = ct[pos + i]

            if p not in words:
                if p != c:
                    break
                continue

            if c not in words:
                break

            idx = (pos + i) % 16
            k = (words.index(c) - words.index(p)) % 62

            if key[idx] is not None and key[idx] != k:
                break

            key[idx] = k
        else:
            yield pos, key

def decrypt(key):
    return "".join(
        words[(words.index(c) - (key[i % 16] or 0)) % 62]
        if c in words else c
        for i, c in enumerate(ct)
    )

a = list(find_keys("1586 Blaise de Vigenere"))
b = list(find_keys("cipher"))

results = []

for p1, k1 in a:
    for p2, k2 in b:
        if p1 < p2 + 6 and p2 < p1 + 23:
            continue

        if any(x != y for x, y in zip(k1, k2)
               if x is not None and y is not None):
            continue

        key = [x if x is not None else y for x, y in zip(k1, k2)]

        if key.count(None) <= 2:
            results.append((p1, p2, key))

print("일치하는 후보:", len(results))

for p1, p2, key in results[:30]:
    print("\n1586 Blaise de Vigenere 위치:", p1)
    print("cipher 위치:", p2)
    print("추정한 키:", key)
    print("예상 복호화:")
    print(decrypt(key))
```

기존 코드에서 `Vigenere`대신 `1586 Blaise de Vigenere`를 찾게끔 수정했다.

![image.png](/images/image-62.png)

오 드디어 조금 모양새가 더 잡혀져간다. 그리고 여기서 한가지 추리를 해보면, 맨앞에는 `In`이라는 영어 단어가 들어갈거 같다. (바로 뒤에가 년도니까). 아마 "In 1586 Blaise de Vigenere" 이렇게 나올거같다. 근데 추정한 키에서 1번째 인덱스가 `None`으로 되어있으니까. 9를 n으로 바꿔줄 키만 알아내면 될거같다. 9가 1번째 인덱스 자리니까. 그러면 기존 키값에서 `None`을 22로 바꿔주고 복호화 해보자. (9는 61번째, n은 39번째니까 `(61 - 39) mod 62 = 22`)

```python
from string import ascii_uppercase, ascii_lowercase, digits

words = ascii_uppercase + ascii_lowercase + digits

key = [47, 22, 41, 1, 29, 2, 53, 53, 35, 20, 47, 60, 20, 20, 48, 5]

with open(r"C:\exploits\output.txt", encoding="utf-8") as f:
    ct = f.read().split("my encrypted sentence > ", 1)[1].rstrip("\r\n")

pt = ""

for i, c in enumerate(ct):
    if c in words:
        pt += words[(words.index(c) - key[i % 16]) % 62]
    else:
        pt += c

print("복호화 결과:")
print(pt)
```

이렇게 기존 추정한 키값에서 1번째 인덱스에서 암호문 9를 평문 n으로 복호화할 수 있도록 키값 22를 추가해줬다.



그래서 아래와 같이 플래그를 얻을 수 있었다.

![image.png](/images/image-63.png)

이렇게 아무 글자 깨짐 없이 깔끔하게 출력되는 것을 확인할 수 있었다.



---

## 해결

플래그:

```
DH{10587bd243d302e95d4b4b0fe331166605b85dd6660e18a305e1fc3db72bf3be}
```



(해당 문제 라이트업을 작성하고 있었는데 날라가서 다시 작성했다.) + (음 근데 나처럼 잔머리를 써서 추리를 하면서 푸는 문제가 맞나싶다. 다른 방법이 있으려나..? -> 이것을 한번 조사해보는것도 괜찮겠다.)

---



## 번외

### 다른 사람들의 풀이

음 나는 이분의 풀이를 한번 보았다.

[DreamHack EVER-igen 풀이 (드림핵 Bronze 3) — 주기 16 비제네르를 열별 빈도로 깨다](https://zino.kr/blog/dreamhack-ever-igen-writeup)

빈도로 깬다는거 보니까 나랑 초반엔 비슷한 방향으로 간건가 싶다..? 한번 이분의 라이트업을 정독해보았다.

이분의 풀이도 나의 초반 풀이처럼 빈도분석으로 하셨는데 나와 차이점이 있었다. 나의 빈도분석법은 단순히 일반적으로 많이 나오는 문자들의 가중치를 두고 점수를 계산하는 방식이였는데, 이분의 풀이와 차이점은 소문자, 대문자, 숫자에 서로 다른 확률을 적용하고, 이분은 로그가능도를 더했다.  아래는 기존의 나의 방식이다.

$$

S=\sum_i f(c_i)

$$  

그리고 아래는 이분의 방식이다.

$$  
S=\sum_i\log P(c_i)

$$  

여기서 `(P(c_i)`는 해당 문자가 영어 문장에서 등장할 것으로 가정한 확률이다. 다만 중요한건 로그를 사용했다는 사실 자체가 무조건 더 정확하다는 뜻은 아니다. 진짜 중요한 건 이분이 소문자, 대문자, 숫자의 확률을 구별하고, 영어의 문자 분포를 확률 모델로 사용했다는 점이라고 생각한다.



(추가로 드림핵 라이트업 기능에서 다른 분들이 푼 라이트업을 확인해보니 대부분 나랑 비슷하게 푸셨다.)