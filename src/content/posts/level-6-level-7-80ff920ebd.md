---
title: "Level 6 → Level 7"
description: "Level 6 → Level 7"
category: "OverTheWire Bandit"
tags: []
createdAt: "2026-11-03"
updatedAt: "2026-11-03"
draft: false
notionSource: "01377189-8ded-49f7-a965-ccdae8430911_ExportBlock-70e51c03-942c-4958-8025-8f7c870b9fff.zip:bandit/Level 6 → Level 7 3725747616b28040adc0e558462e5382.html"
---

<header><h1 class="page-title" dir="auto">Level 6 → Level 7</h1><p class="page-description" dir="auto"></p></header><div class="page-body"><figure id="3d057476-16b2-8010-8980-fc52abb62c81" class="image" data-notion-image="Level%206%20%E2%86%92%20Level%207/image.png" dir="ltr"><a href="../../assets/notion/3ef920ee08.png"><img src="../../assets/notion/3ef920ee08.png"></a></figure><p id="3d057476-16b2-80fa-968a-f21102a8f3f6" class="" dir="auto">6레벨에 접속해준다.</p><figure id="3d057476-16b2-800a-bd0b-f8df6a3423a3" class="image" data-notion-image="Level%206%20%E2%86%92%20Level%207/image%201.png" dir="ltr"><a href="../../assets/notion/e14078db8d.png"><img src="../../assets/notion/e14078db8d.png"></a></figure><p id="3d057476-16b2-80fd-bc26-e709cda760a0" class="" dir="auto">6레벨 문제이다. 해석해보면 서버 어딘가에 있는 파일을 찾는 문제이고, 파일 조건은 owner 가 bandit7이고 group은 bandit6, size는 33 바이트 라는 점이다.</p><p id="3d057476-16b2-807c-ac54-faa154b4f521" class="" dir="auto">
</p><figure id="3d057476-16b2-803d-b614-cd803d87b37b" class="image" data-notion-image="Level%206%20%E2%86%92%20Level%207/image%202.png" dir="ltr"><a href="../../assets/notion/72f0634270.png"><img src="../../assets/notion/72f0634270.png"></a></figure><p id="3d057476-16b2-8034-8d05-ffec1537a66c" class="" dir="auto">그래서 ls 명령어로 쭉 보니 딱히 특별한 파일은 없었다.</p><p id="3d057476-16b2-807c-af16-d9903c93aa68" class="" dir="auto">
</p><p id="3d057476-16b2-806d-89b1-c47a8fba1366" class="" dir="auto">그저 간단하게 </p><p id="3d057476-16b2-803f-9873-e900fc8bcbdd" class="" dir="auto">
</p><pre id="3d057476-16b2-80ac-ad8a-dda68400157d" class="code code-wrap" data-notion-code-syntax="jsx"><code class="language-jsx">find / -user bandit7 -group bandit6 -size 33c</code></pre><p id="3d057476-16b2-804c-88a2-eaf843f58167" class="" dir="auto">위 명령어로 파일을 찾는다. 위 명령어는 루트 경로 안에 있는 파일 중 위에 3개 조건을 만족시켜서 파일을 찾는 명령어이다.</p><p id="3d057476-16b2-80d1-a493-f92013f39bb9" class="" dir="auto">
</p><figure id="3d057476-16b2-8072-b831-f58a32ff0002" class="image" data-notion-image="Level%206%20%E2%86%92%20Level%207/image%203.png" dir="ltr"><a href="../../assets/notion/3a3a43cd7c.png"><img src="../../assets/notion/3a3a43cd7c.png"></a></figure><figure id="3d057476-16b2-8011-8eb3-dd7e5d3b1f88" class="image" data-notion-image="Level%206%20%E2%86%92%20Level%207/image%204.png" dir="ltr"><a href="../../assets/notion/5ed1dd06e3.png"><img src="../../assets/notion/5ed1dd06e3.png"></a></figure><p id="3d057476-16b2-8037-8fa5-cdf8e9c84942" class="" dir="auto">이렇게 bandit7.password 라는 파일을 찾고 열면 다음 단계로 가는 비밀번호를 얻을 수 있다.</p><p id="3d057476-16b2-80f8-8472-d14558401ed1" class="" dir="auto">
</p><p id="3d057476-16b2-807a-b522-ff7e6cb8a34a" class="" dir="auto">하지만 이렇게 찾으면 찾기 어렵고 Permission denied 가 너무 많이 뜰것이다. 그래서..</p><pre id="3d057476-16b2-80d9-b3a7-d374423e508e" class="code code-wrap" data-notion-code-syntax="jsx"><code class="language-jsx">2&gt;/dev/null</code></pre><p id="3d057476-16b2-8029-8a16-d071a590ed03" class="" dir="auto">옵션을 사용해서 권한이 없는 디렉터리에서 발생하는 Permission denied 에러 문구를 숨길 수 있다.</p><p id="3d057476-16b2-808e-82ca-cd9dcd9d6a47" class="" dir="auto">
</p><p id="3d057476-16b2-804a-9e10-d80c1d3be903" class="" dir="auto">이번 문제의 핵심은 서버 어딘가에 있다는 점과 find 명령어를 잘 사용해야 푸는 문제라고 생각한다.</p><pre id="3d057476-16b2-804f-986e-db7a94f8f376" class="code code-wrap" data-notion-code-syntax="jsx"><code class="language-jsx">Bmnnvf82KzQlfxgAI2d1zYbr1u9pr3E3</code></pre><p id="3d057476-16b2-80ac-924d-d9f3fd04845e" class="" dir="auto">
</p></div>
