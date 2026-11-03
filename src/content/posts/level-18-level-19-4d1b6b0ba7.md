---
title: "Level 18 → Level 19"
description: "Level 18 → Level 19"
category: "OverTheWire Bandit"
tags: []
createdAt: "2026-11-03"
updatedAt: "2026-11-03"
draft: false
notionSource: "01377189-8ded-49f7-a965-ccdae8430911_ExportBlock-70e51c03-942c-4958-8025-8f7c870b9fff.zip:bandit/Level 18 → Level 19 3e35747616b28050833adf8c4ddcce77.html"
---

<header><h1 class="page-title" dir="auto">Level 18 → Level 19</h1><p class="page-description" dir="auto"></p></header><div class="page-body"><h2 id="문제-0" class="" dir="auto">문제:</h2><figure id="3e357476-16b2-808e-adb6-c3a2b424b687" class="image" data-notion-image="Level%2018%20%E2%86%92%20Level%2019/image.png" dir="ltr"><a href="../../assets/notion/df76f47efe.png"><img src="../../assets/notion/df76f47efe.png"></a></figure><p id="3e357476-16b2-8078-9303-deaf6bc415b5" class="" dir="auto">다음 레벨의 비밀번호는 홈 디렉터리에 있는 readme 파일에 저장되어 있다. 그런데 안타깝게도 누군가 .bashrc 파일을 수정해서, SSH로 로그인하면 바로 로그아웃 되도록 만들어 놓았다.</p><p id="3e357476-16b2-8080-8217-cf2943fd9c0f" class="" dir="auto">
</p><p id="3e357476-16b2-80c3-887d-fd2a7eb490c9" class="" dir="auto">전 단계에서 말했던대로..</p><figure id="3e357476-16b2-80b5-994e-f4f7084d9828" class="image" data-notion-image="Level%2018%20%E2%86%92%20Level%2019/image%201.png" dir="ltr"><a href="../../assets/notion/a2b36cce77.png"><img src="../../assets/notion/a2b36cce77.png"></a></figure><p id="3e357476-16b2-80c4-89bb-d68f451193a5" class="" dir="auto">Byebye ! 라고 한 다음 연결이 끊긴다. 그러면 어떻게 풀어야할까?</p><p id="3e357476-16b2-8085-9c8a-d635e5f0486c" class="" dir="auto">
</p><p id="3e357476-16b2-8012-8f02-ff541dabe708" class="" dir="auto">사실 <code>ssh</code>명령어는 실행할 명령어를 바로 붙일 수 있다. 그렇기 때문에..</p><pre id="3e357476-16b2-80bb-9380-cdf4dce5f81f" class="code code-wrap" data-notion-code-syntax="bash"><code class="language-bash">ssh bandit18@bandit.labs.overthewire.org -p 2220 cat readme</code></pre><p id="3e357476-16b2-8062-a16d-c6879e78f21a" class="" dir="auto">위 명령어를 사용하면 바로 풀 수 있을것이다.</p><p id="3e357476-16b2-80d0-8b88-cd91abf7ad81" class="" dir="auto">
</p><figure id="3e357476-16b2-80de-b90a-d7e58d76de6f" class="image" data-notion-image="Level%2018%20%E2%86%92%20Level%2019/image%202.png" dir="ltr"><a href="../../assets/notion/4878786bcd.png"><img src="../../assets/notion/4878786bcd.png"></a></figure><p id="3e357476-16b2-8072-9e90-e1fe490023fd" class="" dir="auto">예상대로 바로 풀 수 있는 간단한 문제다.</p><p id="3e357476-16b2-8073-8640-c125e6a8a70d" class="" dir="auto">
</p><p id="3e357476-16b2-803a-a17f-ec7eb2fa45b4" class="" dir="auto">pw:</p><pre id="3e357476-16b2-80b6-bed6-f712b4d34e6c" class="code code-wrap" data-notion-code-syntax="bash"><code class="language-bash">KpsOfPkcP7i1FlIExk2QEjyt6dw8dxZI</code></pre><p id="3e357476-16b2-801a-a978-f26c091f3d19" class="" dir="auto">
</p></div>
