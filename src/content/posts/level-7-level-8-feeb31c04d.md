---
title: "Level 7 → Level 8"
description: "Level 7 → Level 8"
category: "OverTheWire Bandit"
tags: []
createdAt: "2026-11-03"
updatedAt: "2026-11-03"
draft: false
notionSource: "01377189-8ded-49f7-a965-ccdae8430911_ExportBlock-70e51c03-942c-4958-8025-8f7c870b9fff.zip:bandit/Level 7 → Level 8 3d05747616b28054b168ff856c2bde3e.html"
---

<header><h1 class="page-title" dir="auto">Level 7 → Level 8</h1><p class="page-description" dir="auto"></p></header><div class="page-body"><h2 id="문제-0" class="" dir="auto">문제</h2><figure id="3de57476-16b2-8026-9df5-cb8451e42caa" class="image" data-notion-image="Level%207%20%E2%86%92%20Level%208/image.png" dir="ltr"><a href="../../assets/notion/4bb8f705cd.png"><img src="../../assets/notion/4bb8f705cd.png"></a></figure><p id="3de57476-16b2-80d5-ae36-cd9d7c222eb9" class="" dir="auto">문제는 data.txt 파일 안에 millionth라는 단어 옆에 비밀번호를 찾는 문제다.</p><figure id="3de57476-16b2-8097-bf6b-e800b6082c47" class="image" data-notion-image="Level%207%20%E2%86%92%20Level%208/image%201.png" dir="ltr"><a href="../../assets/notion/7d37660cb2.png"><img src="../../assets/notion/7d37660cb2.png"></a></figure><p id="3de57476-16b2-8021-95e5-dfb22d9f5ecc" class="" dir="auto">확인해보니 해당 파일이 존재하고 <code>cat data.txt</code>로 안에 내용물을 읽어보니…</p><p id="3de57476-16b2-80a4-8870-eed498008b72" class="" dir="auto">
</p><figure id="3de57476-16b2-8077-ad8f-ec41ae0483e9" class="image" data-notion-image="Level%207%20%E2%86%92%20Level%208/image%202.png" dir="ltr"><a href="../../assets/notion/ac55d79460.png"><img src="../../assets/notion/ac55d79460.png"></a></figure><p id="3de57476-16b2-8068-8e18-db0fb7998b7c" class="" dir="auto">이렇게 복잡하고 더럽게 쭉 뜬다. 그렇기 때문에 이걸 일일히 노가다로 찾는건 불가능하다. 여기서 사용해야 할 건 파일 안에 특정 키워드를 찾는 명령어이다.</p><p id="3de57476-16b2-80d4-95fd-eacffa30011f" class="" dir="auto">그래서 나는 <code>grep</code> 명령어를 사용해서 풀어보겠다.</p><p id="3de57476-16b2-80b5-a8a2-f5ca984896b6" class="" dir="auto">
</p><p id="3de57476-16b2-80ad-bb01-f70d16086aec" class="" dir="auto"><code>grep</code> 명령어의 사용법은 <code>grep 찾을키워드 파일명</code> 이다. 그러니까 다음과 같이 입력해주면..</p><p id="3de57476-16b2-8009-98b7-d62b414f8b71" class="" dir="auto">
</p><figure id="3de57476-16b2-80ea-adf1-d5820304b446" class="image" data-notion-image="Level%207%20%E2%86%92%20Level%208/image%203.png" dir="ltr"><a href="../../assets/notion/dba1f7099e.png"><img src="../../assets/notion/dba1f7099e.png"></a></figure><p id="3de57476-16b2-8097-b691-e1c788f94901" class="" dir="auto">
</p><p id="3de57476-16b2-806a-9f74-ee55bf009a06" class="" dir="auto">깔끔하게 다음 레벨로 가는 비밀번호를 획득할 수 있다.</p><p id="3de57476-16b2-8070-8dd9-cbf4efcea471" class="" dir="auto">
</p><p id="3de57476-16b2-8073-8ce3-f413eef30951" class="" dir="auto">pw:</p><pre id="3de57476-16b2-806e-8f9a-d9c164ca2eb9" class="code code-wrap" data-notion-code-syntax="jsx"><code class="language-jsx">VR1ljMayciFxbnUokuQmJFw6QC9VKtub</code></pre><p id="3de57476-16b2-8034-bbdd-cb2d81ecf00d" class="" dir="auto">
</p></div>
