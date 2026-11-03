---
title: "Level 1 → Level 2"
description: "Level 1 → Level 2"
category: "OverTheWire Bandit"
tags: []
createdAt: "2026-11-03"
updatedAt: "2026-11-03"
draft: false
notionSource: "01377189-8ded-49f7-a965-ccdae8430911_ExportBlock-70e51c03-942c-4958-8025-8f7c870b9fff.zip:bandit/Level 1 → Level 2 36a5747616b280ef9706ff77efb64877.html"
---

<header><h1 class="page-title" dir="auto">Level 1 → Level 2</h1><p class="page-description" dir="auto"></p></header><div class="page-body"><p id="36a57476-16b2-808b-9bc6-f00d9743e4f5" class="" dir="auto">
</p><p id="36a57476-16b2-80e3-beb8-d0cd5b9cb124" class="" dir="auto">Level 1을 들어가는 ssh 명령어를 작성해줍니다.</p><p id="36a57476-16b2-8044-8a76-f49dfc0bb13c" class="" dir="auto">
</p><figure id="36a57476-16b2-800e-a502-c98549cf2c76" class="image" data-notion-image="Level%201%20%E2%86%92%20Level%202/image.png" dir="ltr"><a href="../../assets/notion/70890b6fd2.png"><img src="../../assets/notion/70890b6fd2.png"></a></figure><p id="36a57476-16b2-808b-ab0e-d8301cf99ae6" class="" dir="auto">
</p><p id="36a57476-16b2-8070-802e-fe5640c9cddf" class="" dir="auto">Level 1을 들어가는 비밀번호는 </p><p id="36a57476-16b2-8020-afe6-e3bc0e34e1f2" class="" dir="auto">
</p><pre id="36a57476-16b2-8044-9119-ec6ce3794cd5" class="code code-wrap" data-notion-code-syntax="bash"><code class="language-bash">6y2kwnwK6grgvwvpvLaa2T1cpFEKOhNR</code></pre><p id="36a57476-16b2-8098-ac74-df28ba87bdaa" class="" dir="auto">
</p><p id="36a57476-16b2-806d-aace-de1f583b4304" class="" dir="auto">이거였죠? 복붙해줍니다. 그러면 Level 1에 성공적으로 들어올 수 있습니다.</p><p id="36a57476-16b2-801c-a10a-f2abb08ed421" class="" dir="auto">
</p><figure id="36a57476-16b2-8062-b73d-e4e694627db8" class="image" data-notion-image="Level%201%20%E2%86%92%20Level%202/image%201.png" dir="ltr"><a href="../../assets/notion/f1771675de.png"><img src="../../assets/notion/f1771675de.png"></a></figure><p id="36a57476-16b2-80d5-bdd2-c7e343ef30e5" class="" dir="auto">
</p><p id="36a57476-16b2-8092-be18-def7ac57e64e" class="" dir="auto">일단 ls 를 쳐보겠습니다.</p><p id="36a57476-16b2-800d-941c-d8e41421e67b" class="" dir="auto">
</p><figure id="36a57476-16b2-8034-a2f5-d6a715b4f36e" class="image" data-notion-image="Level%201%20%E2%86%92%20Level%202/image%202.png" dir="ltr"><a href="../../assets/notion/2981a56e93.png"><img src="../../assets/notion/2981a56e93.png"></a></figure><p id="36a57476-16b2-8010-973d-fa7bb2259272" class="" dir="auto">
</p><ul id="36a57476-16b2-80aa-90c0-d11d1bc7961a" class="bulleted-list" dir="auto"><li>파일 하나만 있다고 뜨네요.</li></ul><p id="36a57476-16b2-8025-9583-f3ae1eb49759" class="" dir="auto">
</p><p id="36a57476-16b2-80e7-b109-d6346ac0c753" class="" dir="auto">bandit Level 1 → Level 2 페이지를 읽어볼게요.</p><p id="36a57476-16b2-8043-986c-da035ef776f8" class="" dir="auto">
</p><figure id="36a57476-16b2-8078-b14e-c46fcfc7d74e" class="image" data-notion-image="Level%201%20%E2%86%92%20Level%202/image%203.png" dir="ltr"><a href="../../assets/notion/ac3b224408.png"><img src="../../assets/notion/ac3b224408.png"></a></figure><p id="36a57476-16b2-805a-bf67-d32c66dce490" class="" dir="auto">
</p><p id="36a57476-16b2-8017-88f0-f469aecd8abe" class="" dir="auto">아 비밀번호는 - 이라는 파일 안에 있답니다.</p><p id="36a57476-16b2-8012-a694-f797f4220780" class="" dir="auto">
</p><p id="36a57476-16b2-8021-86d7-d5403cb94ccf" class="" dir="auto">그럼 cat 명령어로 열어봐야겠죠.</p><figure id="36a57476-16b2-8067-b887-ce98f8bcf187" class="image" data-notion-image="Level%201%20%E2%86%92%20Level%202/image%204.png" dir="ltr"><a href="../../assets/notion/f412e2a090.png"><img src="../../assets/notion/f412e2a090.png"></a></figure><p id="36a57476-16b2-80af-9019-e7c2d7b3ebde" class="" dir="auto">
</p><p id="36a57476-16b2-8076-a896-d2ee11b3b86c" class="" dir="auto">어라? 아무것도 안 뜨고 이상하게 됩니다. <strong>그 이유는 리눅스가 - 를 “표준 입력(stdin)” 옵션처럼 해석해버리기 때문인데요.</strong></p><p id="36a57476-16b2-800d-b614-f89c648c7894" class="" dir="auto">
</p><hr id="36a57476-16b2-8002-8181-f55bbabf5671" dir="auto"><h3 id="표준-입력-stdin-이란-0" class="" dir="auto">표준 입력(stdin)이란?</h3><p id="36a57476-16b2-80f6-9255-d1ac4f2325ee" class="" dir="auto">리눅스에는 프로그램이 기본적으로 사용하는 “입출력 통로” 개념이 있는데 대표적으로 표준 입력, 표준 출력, 표준 에러 이렇게 3가지가 있습니다. 여기서 표준 입력은 “프로그램이 입력을 받는 기본 통로” 라고 보면 됩니다. 예를 들어, cat만 입력하면 커서만 깜빡거리는데 여기서 hello라고 입력하면 그대로 출력됩니다. 왜냐하면 cat이 입력을 읽고 있기 때문입니다. 그리고 리눅스에서는 - 문자가 종종 표준 입력을 사용하라는 의미로 사용합니다. 그래서</p><pre id="36a57476-16b2-80ce-8a39-de5956c06ede" class="code code-wrap" data-notion-code-syntax="bash"><code class="language-bash">cat -</code></pre><p id="36a57476-16b2-8088-895a-f71355734b4b" class="" dir="auto">이걸 입력하면 “- 파일을 읽어라” 이 뜻이 아닌 “키보드 입력을 읽어라” 이런 의미로 해석하는겁니다. 그래서 리눅스가 헷갈려하죠. </p><p id="36a57476-16b2-80cd-8f6d-fabc1047166d" class="" dir="auto">
</p><figure id="36a57476-16b2-80da-9da5-e0ad222211d2" class="image" data-notion-image="Level%201%20%E2%86%92%20Level%202/image%205.png" dir="ltr"><a href="../../assets/notion/f4c2984ac4.png"><img src="../../assets/notion/f4c2984ac4.png"></a></figure><p id="36a57476-16b2-8055-b891-fbc294e06015" class="" dir="auto">이렇게 입력한 값이 출력되는걸 볼 수 있습니다. 그리고 저 입출력 상태를 나오고 싶으면 ‘컨트롤 + c’를 누르면 나와집니다.</p><p id="36a57476-16b2-806d-b54b-f148dc725022" class="" dir="auto">
</p><figure id="36a57476-16b2-8015-ad18-ebb619f5ab01" class="image" data-notion-image="Level%201%20%E2%86%92%20Level%202/image%206.png" dir="ltr"><a href="../../assets/notion/00f2af182e.png"><img src="../../assets/notion/00f2af182e.png"></a></figure><hr id="36a57476-16b2-80e3-ba79-dde0e9525e78" dir="auto"><h2 id="해결-방법-1" class="" dir="auto">해결 방법?</h2><p id="36a57476-16b2-807e-b43a-c55919135b99" class="" dir="auto">
</p><hr id="36a57476-16b2-805d-af8e-ca53be04c8a4" dir="auto"><p id="36a57476-16b2-808c-b87f-dfd0c986bf12" class="" dir="auto">그러면 이 문제를 어떻게 해결해야 할까요? </p><p id="36a57476-16b2-80e9-b107-cac76b17135d" class="" dir="auto">
</p><pre id="36a57476-16b2-803c-ae16-d2aa8912f2ef" class="code code-wrap" data-notion-code-syntax="bash"><code class="language-bash">cat ./-</code></pre><p id="36a57476-16b2-80a5-924d-db0f00469d47" class="" dir="auto">
</p><p id="36a57476-16b2-8030-8239-cbf8f7c52214" class="" dir="auto">바로 이렇게 현재 경로를 붙여줘야 합니다. 현재 경로를 붙여주면 “이건 옵션이 아니라 진짜 파일 이름이구나” 하고 리눅스가 제대로 읽습니다.</p><p id="36a57476-16b2-8069-9ae7-c0d98ab3cc2d" class="" dir="auto">
</p><figure id="36a57476-16b2-80f1-9b45-ce32ba9d743b" class="image" data-notion-image="Level%201%20%E2%86%92%20Level%202/image%207.png" dir="ltr"><a href="../../assets/notion/01fc9536e7.png"><img src="../../assets/notion/01fc9536e7.png"></a></figure><p id="36a57476-16b2-80b6-b695-e66b6dcb5de5" class="" dir="auto">
</p><p id="36a57476-16b2-80ea-9ce2-eb5897fea3b2" class="" dir="auto">그럼 이렇게 성공적으로 다음 레벨(Level 2)로 가는 비밀번호를 획득할 수 있습니다.</p><p id="36a57476-16b2-8001-a5f8-c089b6462e11" class="" dir="auto">
</p><p id="36a57476-16b2-80c4-b947-c4285c1ccc52" class="" dir="auto">비밀번호:</p><pre id="36a57476-16b2-80fc-a78c-e4bf25bc4449" class="code code-wrap" data-notion-code-syntax="bash"><code class="language-bash">PK8fYLZg2hnHSz83plBL1iEPKdD3QToB</code></pre><p id="36a57476-16b2-80e6-b0f3-f061de5f1667" class="" dir="auto">
</p></div>
