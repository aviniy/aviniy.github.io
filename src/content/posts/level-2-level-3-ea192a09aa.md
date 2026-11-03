---
title: "Level 2 → Level 3"
description: "Level 2 → Level 3"
category: "OverTheWire Bandit"
tags: []
createdAt: "2026-11-03"
updatedAt: "2026-11-03"
draft: false
notionSource: "01377189-8ded-49f7-a965-ccdae8430911_ExportBlock-70e51c03-942c-4958-8025-8f7c870b9fff.zip:bandit/Level 2 → Level 3 36a5747616b28039a774d71a07014616.html"
---

<header><h1 class="page-title" dir="auto">Level 2 → Level 3</h1><p class="page-description" dir="auto"></p></header><div class="page-body"><figure id="37057476-16b2-8025-b9ea-df205ab18dda" class="image" data-notion-image="Level%202%20%E2%86%92%20Level%203/image.png" dir="ltr"><a href="../../assets/notion/3376d881c4.png"><img src="../../assets/notion/3376d881c4.png"></a></figure><p id="37057476-16b2-8072-aeb5-e97d8055df7f" class="" dir="auto">레벨 2에 접속해준다 저번에 찾은 비밀번호를 입력해준다.</p><p id="37057476-16b2-804d-8ae0-c7afbaff30ab" class="" dir="auto">
</p><figure id="37057476-16b2-8069-9d8c-fb97e8b01162" class="image" data-notion-image="Level%202%20%E2%86%92%20Level%203/image%201.png" dir="ltr"><a href="../../assets/notion/c29e322270.png"><img src="../../assets/notion/c29e322270.png"></a></figure><p id="37057476-16b2-807c-ab79-c366a10bb5b3" class="" dir="auto">성공적으로 접속하였다. ls를 쳐서 디렉터리와 파일을 확인해본다.</p><p id="37057476-16b2-80c3-a7b4-c434153d177c" class="" dir="auto">
</p><figure id="37057476-16b2-80ba-ab61-c390eda2ebd9" class="image" data-notion-image="Level%202%20%E2%86%92%20Level%203/image%202.png" dir="ltr"><a href="../../assets/notion/f03333af56.png"><img src="../../assets/notion/f03333af56.png"></a></figure><p id="37057476-16b2-80d5-8428-c42a0c835567" class="" dir="auto">--spaces in this filename-- 이라는 파일이 하나 있다. cat 명령어를 사용해서 열어보자.</p><p id="37057476-16b2-80f6-9fc6-c243233a42cb" class="" dir="auto">
</p><figure id="37057476-16b2-8013-bba5-f80db3f8e7fc" class="image" data-notion-image="Level%202%20%E2%86%92%20Level%203/image%203.png" dir="ltr"><a href="../../assets/notion/eb1779a946.png"><img src="../../assets/notion/eb1779a946.png"></a></figure><p id="37057476-16b2-800b-bbe6-f973792e072e" class="" dir="auto">쳤더니 인식할 수 없는 옵션이란다. </p><p id="37057476-16b2-80b7-b454-ff508d354f09" class="" dir="auto">
</p><hr id="37057476-16b2-8046-9618-d311eb7819ef" dir="auto"><h3 id="그럼-왜-파일명이-아니라-옵션으로-인식할까-0" class="" dir="auto">그럼 왜 파일명이 아니라 옵션으로 인식할까?</h3><p id="37057476-16b2-802e-b7b4-c9f91400116a" class="" dir="auto">
</p><p id="37057476-16b2-8094-b6a6-e81e7d5831b8" class="" dir="auto"><strong>리눅스 명령어들은 보통 - 또는 -- 로 시작하는 문자열을 옵션으로 해석한다. 따라서 파일명이 --spaces in this filename-- 처럼 -- 로 시작하면 명령어가 이를 옵션으로 오인한다. 이를 방지하기 위해 ./ 를 붙여 경로로 지정하거나 -- 를 사용해 옵션 해석을 종류한 뒤 파일명을 전달해야 한다.</strong></p><p id="37057476-16b2-80ef-a7a4-d0407032903a" class="" dir="auto">
</p><hr id="37057476-16b2-80b1-afe0-f4c55ddeb2f7" dir="auto"><p id="37057476-16b2-80d7-913c-fa8dc86194fe" class="" dir="auto">
</p><figure id="37057476-16b2-802c-aef7-cbc19305e38f" class="image" data-notion-image="Level%202%20%E2%86%92%20Level%203/image%204.png" dir="ltr"><a href="../../assets/notion/a3423bc7d5.png"><img src="../../assets/notion/a3423bc7d5.png"></a></figure><p id="37057476-16b2-8049-829d-dbfb6712c9d7" class="" dir="auto">
</p><p id="37057476-16b2-806f-b52c-f35abaa64074" class="" dir="auto">그럼 이런 오류가 또 뜨는데 이건 파일 이름의 공백때문에 생기는 오류이다. 쉘은 4개의 파일을 찾으려다 없어서 에러가 난 것이다.</p><p id="37057476-16b2-80c2-b06e-c12823edcdd8" class="" dir="auto">
</p><p id="37057476-16b2-80cc-b532-fb19c4202ef9" class="" dir="auto">예를 들어 mkdir 1 2 3 4 명령어를 치면 1 2 3 4라는 파일이 생기는게 아닌 1, 2, 3, 4 이렇게 4개의 파일이 생성되는 원리랑 똑같다. 그래서 양쪽에 따옴표를 붙여주면 된다.</p><p id="37057476-16b2-809f-a73c-f30a2de41787" class="" dir="auto">
</p><hr id="37057476-16b2-800f-b970-f2ff87d5478b" dir="auto"><p id="37057476-16b2-8033-a177-ed8dfe76611e" class="" dir="auto">
</p><figure id="37057476-16b2-807e-99a2-f0d8e48b3f3b" class="image" data-notion-image="Level%202%20%E2%86%92%20Level%203/image%205.png" dir="ltr"><a href="../../assets/notion/0a2ea96145.png"><img src="../../assets/notion/0a2ea96145.png"></a></figure><p id="37057476-16b2-80ae-9870-fa8b47375708" class="" dir="auto">
</p><p id="37057476-16b2-8079-abac-fce001498012" class="" dir="auto">그럼 성공적으로 비밀번호를 얻을 수 있다.</p><p id="37057476-16b2-8055-ae45-ce87b805f0c3" class="" dir="auto">
</p><p id="37057476-16b2-8091-9db7-c48acbf53797" class="" dir="auto">비번:</p><pre id="37057476-16b2-80a8-843b-c3288117e755" class="code code-wrap" data-notion-code-syntax="jsx"><code class="language-jsx">7ZZ2LFrykP2zEyvBl4m3clcL7tGYJPME</code></pre><p id="37057476-16b2-809e-abf2-fee4dc6709f1" class="" dir="auto">
</p><p id="37057476-16b2-80e4-8f99-e509970af5db" class="" dir="auto">
</p></div>
