---
title: "Level 8 → Level 9"
description: "Level 8 → Level 9"
category: "OverTheWire Bandit"
tags: []
createdAt: "2026-11-03"
updatedAt: "2026-11-03"
draft: false
notionSource: "01377189-8ded-49f7-a965-ccdae8430911_ExportBlock-70e51c03-942c-4958-8025-8f7c870b9fff.zip:bandit/Level 8 → Level 9 3d05747616b28038adbbe7a7a846233e.html"
---

<header><h1 class="page-title" dir="auto">Level 8 → Level 9</h1><p class="page-description" dir="auto"></p></header><div class="page-body"><h2 id="문제-0" class="" dir="auto">문제: </h2><figure id="3de57476-16b2-807f-98a6-c87e33289adf" class="image" data-notion-image="Level%208%20%E2%86%92%20Level%209/image.png" dir="ltr"><a href="../../assets/notion/9da0b4e1ea.png"><img src="../../assets/notion/9da0b4e1ea.png"></a></figure><p id="3de57476-16b2-80be-9ab8-db91745e9600" class="" dir="auto">다음 레벨의 비밀번호는 data.txt 파일에 저장되어 있으며, 딱 한 번만 등장하는 유일한 줄이다.</p><p id="3de57476-16b2-809e-9c59-f2c620aa4587" class="" dir="auto">
</p><p id="3de57476-16b2-8057-973d-e65ddb3fdb81" class="" dir="auto">Helpful Reading Material 항목을 읽어보면 파이프와 리다이렉션을 알려주고 있다.</p><p id="3de57476-16b2-8074-b7bc-d990aa8f8a6e" class="" dir="auto">
</p><h3 id="파이프-1" class="" dir="auto">파이프 <code>|</code></h3><p id="3de57476-16b2-800a-8f21-cda2de16b1c1" class="" dir="auto">파이프는 앞 명령어의 출력 결과를 다음 명령어의 입력으로 넘기는 것이다. 예를 들어 <code>cat data.txt | grep hello</code>를 입력하면 data.txt를 출력 후 hello 라는 키워드를 찾는 명령어가 되는거다.</p><p id="3de57476-16b2-8031-83e7-d358153c3936" class="" dir="auto">
</p><h3 id="리다이렉션-2" class="" dir="auto">리다이렉션 <code>&gt;</code></h3><p id="3de57476-16b2-8006-bed6-cfae99861193" class="" dir="auto">리다이렉션은 명령어의 출력 결과를 파일에 저장하는 것이다.</p><p id="3de57476-16b2-80c8-93c6-f493f2f3e922" class="" dir="auto"><code>ls</code>를 입력하면 원래 터미널에 해당 디렉터리에 파일들을 보여주는 명령어인데.. <code>ls &gt; result.txt</code> ls의 결과를 result.txt를 저장하는 것 이다. 주의할 점은 <code>&gt;</code> 은 기존 파일 내용을 덮어쓰니 주의해야한다. 추가로 <code>&gt;&gt;</code> 도 같은 개념인데 기존 파일 내용 뒤에 추가하는 리다이렉션이다.</p><p id="3de57476-16b2-80fa-8c60-d2451c4c4f76" class="" dir="auto">
</p><h3 id="리다이렉션-3" class="" dir="auto">리다이렉션 <code>&lt;</code></h3><p id="3de57476-16b2-80dd-badc-d27898bf2f8e" class="" dir="auto">파일의 내용을 명령어의 입력(stdin)으로 전달하는 입력 리다이렉션.</p><p id="3de57476-16b2-8094-850b-c779259e6fe6" class="" dir="auto">
</p><h2 id="풀이-4" class="" dir="auto">풀이</h2><p id="3df57476-16b2-809a-bd91-c8adbd21285a" class="" dir="auto">그럼 이 문제를 어떻게 해결해야 할까?</p><p id="3df57476-16b2-808c-bc17-dbdc43024749" class="" dir="auto"><br>이 문제의 핵심은 <code>data.txt</code>에서 딱 한 번만 등장하는 유일한 한 줄을 찾는 것이다. 이를 위해 <code>uniq -u</code> 명령어를 사용할 수 있다. 하지만 <code>uniq</code>는 서로 인접한 동일한 줄만 중복으로 판단하기 때문에, 먼저 <code>sort</code>를 사용하여 같은 내용의 줄끼리 모아줘야 한다.</p><p id="3df57476-16b2-80f8-bf34-f7da9c01995a" class="" dir="auto">
</p><pre id="3df57476-16b2-80b9-a593-c761fa456015" class="code code-wrap" data-notion-code-syntax="bash"><code class="language-bash">sort data.txt | uniq -u</code></pre><p id="3df57476-16b2-8091-bec4-ec75d9a4d130" class="" dir="auto"><code>sort data.txt</code>는 <code>data.txt</code>의 내용을 정렬하여 출력하고, 파이프를 통해 그 출력 결과를 <code>uniq -u</code>의 입력으로 전달한다. <code>uniq -u</code>는 그중 한 번만 등장하는 줄을 출력하므로 다음 레벨의 비밀번호를 찾을 수 있다.</p><p id="3df57476-16b2-803a-b813-c4dc347bdc2f" class="" dir="auto">
</p><figure id="3df57476-16b2-8061-9811-c400c96cf677" class="image" data-notion-image="Level%208%20%E2%86%92%20Level%209/image%201.png" dir="ltr"><a href="../../assets/notion/cbdb5a0672.png"><img src="../../assets/notion/cbdb5a0672.png"></a></figure><p id="3df57476-16b2-80e1-9697-d4676edd327a" class="" dir="auto">이렇게 비밀번호를 획득하였다.</p><p id="3df57476-16b2-8035-9a59-d030d4c4c1a5" class="" dir="auto">
</p><p id="3df57476-16b2-8082-9ffb-e957323cd316" class="" dir="auto">비번:</p><pre id="3df57476-16b2-8061-90c4-e6b8a95c5f8d" class="code code-wrap" data-notion-code-syntax="jsx"><code class="language-jsx">EjmOSvuAu7sGAHqHVcBDPirRe9T03kxl</code></pre></div>
