---
title: "Level 17 → Level 18"
description: "Level 17 → Level 18"
category: "OverTheWire Bandit"
tags: []
createdAt: "2026-11-03"
updatedAt: "2026-11-03"
draft: false
notionSource: "01377189-8ded-49f7-a965-ccdae8430911_ExportBlock-70e51c03-942c-4958-8025-8f7c870b9fff.zip:bandit/Level 17 → Level 18 3e35747616b28063ac00df9789207d19.html"
---

<header><h1 class="page-title" dir="auto">Level 17 → Level 18</h1><p class="page-description" dir="auto"></p></header><div class="page-body"><h2 id="문제-0" class="" dir="auto">문제:</h2><figure id="3e357476-16b2-80a2-81f7-dee5357ceaf3" class="image" data-notion-image="Level%2017%20%E2%86%92%20Level%2018/image.png" dir="ltr"><a href="../../assets/notion/51dac2f9cf.png"><img src="../../assets/notion/51dac2f9cf.png"></a></figure><p id="3e357476-16b2-8059-96e0-fcd0bdb7c2ae" class="" dir="auto">홈 디렉터리에 passwords.old 와 <a href="http://passwords.new">passwords.new</a> 라는 두 개의 파일이 있다. 다음 레벨의 비밀번호는 passwords.new에 있으며, passwords.old 와 passwords.new를 비교 했을때 유일하게 변경된 한 줄이 다음 레벨의 비밀번호이다.</p><p id="3e357476-16b2-8027-b5b2-d8e4b30f5bf1" class="" dir="auto">
</p><p id="3e357476-16b2-8065-995f-eb67ac88e765" class="" dir="auto">이번 문제에서 핵심인 명령어는 <code>diff</code>이다. <code>diff</code>는 두 파일의 내용을 비교해서 서로 다른 부분을 보여주는 명령어이다.</p><p id="3e357476-16b2-8062-941a-e2794600092e" class="" dir="auto">사용법:</p><pre id="3e357476-16b2-8090-adf5-f19e2937caf6" class="code code-wrap" data-notion-code-syntax="bash"><code class="language-bash">diff [파일1] [파일2]</code></pre><p id="3e357476-16b2-8077-926f-e11d44fee959" class="" dir="auto">
</p><p id="3e357476-16b2-80cb-9383-d3dab3540974" class="" dir="auto">그래서 간단하게 하면 된다.</p><figure id="3e357476-16b2-80a3-b434-c1c8e8f3d634" class="image" data-notion-image="Level%2017%20%E2%86%92%20Level%2018/image%201.png" dir="ltr"><a href="../../assets/notion/baaed75d5e.png"><img src="../../assets/notion/baaed75d5e.png"></a></figure><p id="3e357476-16b2-80c3-a0c8-fe912f722cc1" class="" dir="auto">해석하면 <code>&lt;</code>는 첫번째 파일인 passwords.old의 42번째 줄이고, <code>&gt;</code>는 두번째 파일인 passwords.new의 42번째 줄이다. 그러니까 비밀번호는..</p><p id="3e357476-16b2-8031-8555-d23c0184d6df" class="" dir="auto">
</p><p id="3e357476-16b2-8013-9c2b-de9ef8b9c960" class="" dir="auto">pw:</p><pre id="3e357476-16b2-8099-9cd1-f4bbc3016b51" class="code code-wrap" data-notion-code-syntax="bash"><code class="language-bash">OQxXZjELndr90zuhOTDYBEomI0SZITXI</code></pre><p id="3e357476-16b2-80ed-ba4c-fd9020451621" class="" dir="auto">
</p></div>
