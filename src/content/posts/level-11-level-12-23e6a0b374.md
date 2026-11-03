---
title: "Level 11 → Level 12"
description: "Level 11 → Level 12"
category: "OverTheWire Bandit"
tags: []
createdAt: "2026-11-03"
updatedAt: "2026-11-03"
draft: false
notionSource: "01377189-8ded-49f7-a965-ccdae8430911_ExportBlock-70e51c03-942c-4958-8025-8f7c870b9fff.zip:bandit/Level 11 → Level 12 3df5747616b2804ca8a7e300ebe025ae.html"
---

<header><h1 class="page-title" dir="auto">Level 11 → Level 12</h1><p class="page-description" dir="auto"></p></header><div class="page-body"><h2 id="문제-0" class="" dir="auto">문제:</h2><figure id="3df57476-16b2-8066-afa6-ec0af27db1ad" class="image" data-notion-image="Level%2011%20%E2%86%92%20Level%2012/image.png" dir="ltr"><a href="../../assets/notion/08adf800e2.png"><img src="../../assets/notion/08adf800e2.png"></a></figure><p id="3df57476-16b2-8078-b77f-c2f629fe9e48" class="" dir="auto">다음 레벨의 비밀번호는 data.txt 파일에 저장되어 있다. 그런데 모든 소문자(a-z)와 대문자(A-Z)가 알파벳에서 13칸씩 회전(이동)되어 있다.</p><p id="3df57476-16b2-80e4-9fa3-d262390bd1e8" class="" dir="auto">
</p><h3 id="rot13-1" class="" dir="auto">Rot13</h3><p id="3df57476-16b2-8063-a21f-e64ddc7402fb" class="" dir="auto">이 문제에서 주목해야할건 Rot13기법 인데 Rot13은 문제처럼 알파벳을 13칸 이동 시키는 기법이다. a → n, b → o, c → p 하지만 알파벳은 총 26개이고, Rot13은 13칸을 이동하기 때문에 서로 반대가 된다. n → a, o → b, p → c. </p><p id="3df57476-16b2-8085-b122-c52628a8c540" class="" dir="auto">
</p><h3 id="문제-해결-방법-2" class="" dir="auto">문제 해결 방법</h3><p id="3df57476-16b2-802b-b5f9-f867d3e34390" class="" dir="auto">리눅스에는 <code>tr</code> 명령어가 있는데, 이 명령어는 문자를 다른 문자로 치환하거나 삭제하는 명령어이다.</p><pre id="3df57476-16b2-8021-96f9-f0e0f8062cad" class="code code-wrap" data-notion-code-syntax="bash"><code class="language-bash">tr '바꿀 문자' '바뀔 문자'</code></pre><p id="3df57476-16b2-8011-9f98-d678c675c2e6" class="" dir="auto">
</p><p id="3df57476-16b2-80c9-bd66-cbf6464f973f" class="" dir="auto">지금 그냥 <code>cat</code> 명령어로 data.txt 파일을 보면…</p><figure id="3df57476-16b2-8068-95ca-e6cc426abfc4" class="image" data-notion-image="Level%2011%20%E2%86%92%20Level%2012/image%201.png" dir="ltr"><a href="../../assets/notion/284c0f0968.png"><img src="../../assets/notion/284c0f0968.png"></a></figure><p id="3df57476-16b2-809c-b272-e95472ccfc69" class="" dir="auto">이런식으로 Rot13 방식으로 치환되어 있기 때문에 원문을 바로 알아보기 어렵다.</p><p id="3df57476-16b2-8072-ab78-e23b45e58ccc" class="" dir="auto">
</p><p id="3df57476-16b2-806a-a03d-dfdbe1ddf7c1" class="" dir="auto">기존에 배운 <code>cat</code> 명령어와 파이프와 <code>tr</code> 명령어를 조합해서 명령어를 작성해보면..</p><p id="3df57476-16b2-8048-a794-dc76c232c487" class="" dir="auto">
</p><pre id="3df57476-16b2-80ef-9585-f65afb55a152" class="code code-wrap" data-notion-code-syntax="bash"><code class="language-bash">cat data.txt | tr 'a-mn-zA-MN-Z' 'n-za-mN-ZA-M'</code></pre><p id="3df57476-16b2-80fe-a29a-cd89b27c8476" class="" dir="auto">이렇게 Rot13 규칙으로 되돌릴 수 있는 간단한 명령어를 만들 수 있다. 위 명령어의 의미는 data.txt 파일에 있는걸 a부터 m까지, n부터 z까지 A부터 M까지 N부터 Z까지를 n부터 z, a부터 m, N부터 Z, A부터 M으로 바꿔서 출력하라는 명령어이다.</p><p id="3df57476-16b2-80a9-aee3-dcf684b48db5" class="" dir="auto">
</p><figure id="3df57476-16b2-80a9-9205-d41e54a8e513" class="image" data-notion-image="Level%2011%20%E2%86%92%20Level%2012/image%202.png" dir="ltr"><a href="../../assets/notion/217cab8cc6.png"><img src="../../assets/notion/217cab8cc6.png"></a></figure><p id="3df57476-16b2-8014-91e0-df90fe0e1e7e" class="" dir="auto">
</p><p id="3df57476-16b2-80fe-b859-d77f4604c2f6" class="" dir="auto">pw:</p><pre id="3df57476-16b2-80ad-b7ed-f84caeccfa93" class="code code-wrap" data-notion-code-syntax="bash"><code class="language-bash">GROozWPO8QyN0mGrjUkID0WCYkZiQxrN</code></pre></div>
