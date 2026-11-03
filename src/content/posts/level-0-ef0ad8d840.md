---
title: "Level 0"
description: "Level 0"
category: "OverTheWire Bandit"
tags: []
createdAt: "2026-11-03"
updatedAt: "2026-11-03"
draft: false
notionSource: "01377189-8ded-49f7-a965-ccdae8430911_ExportBlock-70e51c03-942c-4958-8025-8f7c870b9fff.zip:bandit/Level 0 36a5747616b280a893f5f951f880edab.html"
---

<header><h1 class="page-title" dir="auto">Level 0</h1><p class="page-description" dir="auto"></p></header><div class="page-body"><h2 id="bandit이-무엇인가요-0" class="" dir="auto">bandit이 무엇인가요?</h2><p id="36a57476-16b2-809b-87f4-e6f37aaa8d24" class="" dir="auto">
</p><p id="36a57476-16b2-8090-ad24-da80b0773793" class="" dir="auto"><strong>bandit은 리눅스를 게임처럼 배우는 일종의 워게임입니다. 문제를 풀면서 다음 레벨 비밀번호를 얻고, 그 비밀번호로 다음 단계에 접속하는 방식입니다.</strong></p><p id="36a57476-16b2-8026-b42f-d0e381c8de00" class="" dir="auto">
</p><hr id="36a57476-16b2-8055-a0fd-d80c11f98801" dir="auto"><h2 id="bandit을-하는-이유-1" class="" dir="auto">bandit을 하는 이유?</h2><p id="36a57476-16b2-805f-8a87-ef2c7d80b5df" class="" dir="auto">
</p><p id="36a57476-16b2-80a1-92df-cb5adfeb78a5" class="" dir="auto"><strong>bandit을 하는 이유는 크게 두 가지로 볼 수 있습니다.</strong></p><p id="36a57476-16b2-80a1-9f91-eeb3caa63870" class="" dir="auto">
</p><p id="36a57476-16b2-8055-a036-ca50e49ddc95" class="" dir="auto"><strong>첫 번째는리눅스가 안 무서워진다는 것입니다. 많은 사람들이 처음으로 리눅스를 접하면 어떻게 해야하나 뭐부터 공부해야하나 막막하실텐데 bandit은 입문용으로 하기 사이트 입니다.</strong></p><p id="36a57476-16b2-80bb-96d7-d1eb60f4c730" class="" dir="auto">
</p><p id="36a57476-16b2-80be-8bf3-ca208ac5530e" class="" dir="auto"><strong>        두 번째는 ctf 기본기가 생긴다는 것입니다. ctf에서 자주 나오는 숨겨진 파일 찾기 문자열 추출 같은 것들을 bandit에서 많이 쓰고 배울 수 있습니다.</strong></p><p id="36a57476-16b2-801e-9f4f-efe3443ab7d8" class="" dir="auto">
</p><hr id="36a57476-16b2-80ba-8cd7-fd03ca0dc1f2" dir="auto"><p id="3f157476-16b2-80c3-8289-e190505a3882" class="" dir="auto">
</p><p id="36a57476-16b2-80c2-aac5-e06953fcaa2f" class="" dir="auto">
</p><h2 id="튜토리얼-2" class="" dir="auto">튜토리얼</h2><p id="36a57476-16b2-807f-b2ce-e4f32f127c5a" class="" dir="auto">
</p><p id="36a57476-16b2-801b-9cc4-f7164931b01b" class="" dir="auto">     구글에 “bandit overthewire” 라고 쳐줍니다. 그러면</p><p id="36a57476-16b2-806a-af2a-f13f8b0e304e" class="" dir="auto">
</p><figure id="36a57476-16b2-80f5-9859-ca99d318a905" class="image" data-notion-image="Level%200/image.png" dir="ltr"><a href="../../assets/notion/509108511b.png"><img src="../../assets/notion/509108511b.png"></a></figure><p id="3f157476-16b2-80b2-ac89-f6b3d0e95060" class="" dir="auto">
</p><p id="3f157476-16b2-8016-9e0e-ff60912e9a59" class="" dir="auto">
</p><p id="3f157476-16b2-80fd-91dc-cdef796bd4e3" class="" dir="auto">
</p><p id="36a57476-16b2-80aa-b0ac-c7e5b535c71e" class="" dir="auto">
</p><p id="36a57476-16b2-80ee-8bff-fe6578bd5784" class="" dir="auto">이런 사이트가 뜰텐데 들어가줍니다.</p><p id="36a57476-16b2-8085-9793-daf60dae23aa" class="" dir="auto">
</p><p id="36a57476-16b2-8056-9355-d7179d067ab0" class="" dir="auto">(ip: <a href="https://overthewire.org/wargames/bandit/">https://overthewire.org/wargames/bandit/</a>)</p><p id="36a57476-16b2-800b-ba2f-e755d70a3050" class="" dir="auto">
</p><figure id="36a57476-16b2-8039-947a-d5a488c04f73" class="image" data-notion-image="Level%200/image%201.png" dir="ltr"><a href="../../assets/notion/cadd792eb4.png"><img src="../../assets/notion/cadd792eb4.png"></a></figure><p id="3f157476-16b2-80f3-9d2f-ec66dd4b526f" class="" dir="auto">
</p><p id="3f157476-16b2-80d6-b891-e412c54683a2" class="" dir="auto">
</p><p id="3f157476-16b2-801c-a60a-fa5d67fa6abf" class="" dir="auto">
</p><p id="36a57476-16b2-8066-88e7-fcd77beed7ac" class="" dir="auto">
</p><p id="36a57476-16b2-80d5-a07b-ff8454fb373a" class="" dir="auto">그러면 왼쪽에 주루룩 뜨는데 레벨 0부터 풀어주면 됩니다.</p><p id="36a57476-16b2-809b-b6f1-e2372999ac21" class="" dir="auto">
</p><figure id="36a57476-16b2-8092-b41b-c0a1bbd57f96" class="image" data-notion-image="Level%200/image%202.png" dir="ltr"><a href="../../assets/notion/ab02082076.png"><img src="../../assets/notion/ab02082076.png"></a></figure><p id="3f157476-16b2-8077-8aad-c6861f1dddf9" class="" dir="auto">
</p><p id="36a57476-16b2-8044-8328-c5041148c64c" class="" dir="auto">(Level 0 페이지)</p><p id="36a57476-16b2-8014-b5f2-f4cb08e82ec1" class="" dir="auto">
</p><p id="36a57476-16b2-801b-99dd-e86ae6f8ad72" class="" dir="auto"><strong>bandit의 장점은 아무래도 윈도우 환경에서 할 수 있다는 장점이 있습니다. cmd나 파워쉘로도 바로 가능합니다. 굳이 vm 깔아서 리눅스 설치를 하지 않아도 된다는 장점이 있죠. 리눅스로 하실 분들은 바로 리눅스로 하셔도 됩니다.</strong></p><p id="36a57476-16b2-805f-b92b-f5104b8b1820" class="" dir="auto">
</p><p id="36a57476-16b2-8001-8b26-eb7fc8addd43" class="" dir="auto">왼쪽 상단의 “SSH Information” 이라고 적혀있는걸 보면 Host와 포트 번호를 알 수 있습니다. cmd를 켜주셔서 저 주소로 ssh 접속을 해주면 됩니다.</p><p id="36a57476-16b2-8079-a826-fb60bf67b492" class="" dir="auto">
</p><pre id="36a57476-16b2-80b6-9503-d2cbb914922f" class="code code-wrap" data-notion-code-syntax="bash"><code class="language-bash">ssh bandit0@bandit.labs.overthewire.org -p 2220</code></pre><p id="36a57476-16b2-80ba-a09b-e3028b195820" class="" dir="auto">
</p><p id="36a57476-16b2-802a-a6a1-ed4fd25e6f99" class="" dir="auto">위 명령어를 cmd에 복붙하시면 됩니다. 참고로</p><p id="36a57476-16b2-8071-b035-fc057c168336" class="" dir="auto">
</p><pre id="36a57476-16b2-80cd-ab61-e937a469ae12" class="code code-wrap" data-notion-code-syntax="bash"><code class="language-bash">ssh bandit레벨@bandit.labs.overthewire.org -p 2220</code></pre><p id="3f157476-16b2-8004-8ae5-c847fc784bd1" class="" dir="auto">
</p><p id="36a57476-16b2-8020-b3f7-ca3d17533ad6" class="" dir="auto">
</p><p id="36a57476-16b2-80fd-97af-c82858d704fd" class="" dir="auto">입니다. 0레벨 부터 풀거니까 0으로 써준겁니다.</p><p id="36a57476-16b2-80d5-9d97-c0a668eab355" class="" dir="auto">
</p><figure id="36a57476-16b2-8062-b924-f18086735524" class="image" data-notion-image="Level%200/image%203.png" dir="ltr"><a href="../../assets/notion/154938eaf7.png"><img src="../../assets/notion/154938eaf7.png"></a></figure><p id="36a57476-16b2-80a7-bb1f-cb029da80f26" class="" dir="auto">
</p><p id="36a57476-16b2-8090-acab-e07b94f184ab" class="" dir="auto">치면 여기로 연결하는게 확실하냐 yes no 어쩌고 선택창이 뜨는데 그냥 yes를 치면 됩니다.</p><p id="36a57476-16b2-8098-829f-d741e16e33a4" class="" dir="auto">
</p><figure id="36a57476-16b2-80fd-8a9b-e9442fe2ec45" class="image" data-notion-image="Level%200/image%204.png" dir="ltr"><a href="../../assets/notion/1a64e4b69e.png"><img src="../../assets/notion/1a64e4b69e.png"></a></figure><p id="3f157476-16b2-8006-b824-ee86ad8915ca" class="" dir="auto">
</p><p id="36a57476-16b2-8031-ac7b-f3d8209c1c6c" class="" dir="auto">
</p><p id="36a57476-16b2-809a-a1e7-d0d6ac7229b4" class="" dir="auto">이러면 bandit 접속에 성공한겁니다. 근데 비밀번호를 입력하라고 적혀있죠?</p><p id="36a57476-16b2-8005-8e56-e940d84046a9" class="" dir="auto">
</p><p id="36a57476-16b2-801a-8c23-eb49a26b1219" class="" dir="auto">맨 처음에 봤던 overthewire Level 0 페이지를 보시면 </p><p id="36a57476-16b2-80fc-bace-f0b291da82a1" class="" dir="auto">
</p><figure id="36a57476-16b2-80ae-9162-e4159b1ca08d" class="image" data-notion-image="Level%200/image%205.png" dir="ltr"><a href="../../assets/notion/af61bcb91c.png"><img src="../../assets/notion/af61bcb91c.png"></a></figure><p id="3f157476-16b2-80a1-a7d2-c661414eae55" class="" dir="auto">
</p><p id="36a57476-16b2-8017-98c6-fb4cbbc1c181" class="" dir="auto">
</p><p id="36a57476-16b2-803d-a2e2-dc62f2c59cfd" class="" dir="auto">password is bandit0 이라고 되어있죠?</p><p id="36a57476-16b2-80ff-ba09-fb2654efdaab" class="" dir="auto">
</p><p id="36a57476-16b2-8057-a05c-e07fe8c443e6" class="" dir="auto">  cmd에 bandit0 이라고 치시면 됩니다. (<strong>주의사항: 비밀번호를 입력하면 보이지 않습니다 그러니까 천천히 입력하시거나 복붙하시는걸 추천드립니다.</strong>)</p><p id="36a57476-16b2-8069-bb0e-e5ea1f08d5a7" class="" dir="auto">
</p><figure id="36a57476-16b2-8066-8669-e5de084cbf5e" class="image" data-notion-image="Level%200/image%206.png" dir="ltr"><a href="../../assets/notion/b394a07111.png"><img src="../../assets/notion/b394a07111.png"></a></figure><p id="36a57476-16b2-8072-884e-c1e03e20c521" class="" dir="auto">
</p><p id="36a57476-16b2-80f7-b85b-c303f034d12f" class="" dir="auto">이러면 정상적으로 bandit0 에 들어온겁니다. 그리고 overthewire 사이트에서 Level 0 → Level 1을 눌러서 어떤 명령어를 사용해서 푸는지 참고 할 수 있습니다.</p><p id="36a57476-16b2-80bf-a1e8-fe82ae00819d" class="" dir="auto">
</p><figure id="36a57476-16b2-80d6-a3fb-de1c7cdf7d4b" class="image" data-notion-image="Level%200/image%207.png" dir="ltr"><a href="../../assets/notion/308ba60525.png"><img src="../../assets/notion/308ba60525.png"></a></figure><p id="3f157476-16b2-80f8-8055-e7d643f138bc" class="" dir="auto">
</p><p id="36a57476-16b2-80ff-b1cf-ffa7de0a46df" class="" dir="auto">
</p><p id="36a57476-16b2-806b-965c-cc5ccabd770b" class="" dir="auto">일단 ls 를 입력해보겠습니다.</p><p id="36a57476-16b2-807f-8eaa-ca5909542b1e" class="" dir="auto">
</p><figure id="36a57476-16b2-80a8-a9c6-ee2ad8751a1a" class="image" data-notion-image="Level%200/image%208.png" dir="ltr"><a href="../../assets/notion/abfbb46e3c.png"><img src="../../assets/notion/abfbb46e3c.png"></a></figure><p id="36a57476-16b2-80a7-9a7b-d697de0a4b79" class="" dir="auto">
</p><p id="36a57476-16b2-80b8-b3e3-f9fb856489b6" class="" dir="auto">이렇게 readme 파일이 보입니다 cat 명령어로 읽어보겠습니다.</p><p id="36a57476-16b2-80a5-9d29-eb9fa61b83ee" class="" dir="auto">
</p><figure id="36a57476-16b2-80e2-a309-c1e70ff91790" class="image" data-notion-image="Level%200/image%209.png" dir="ltr"><a href="../../assets/notion/4cb558ba30.png"><img src="../../assets/notion/4cb558ba30.png"></a></figure><p id="36a57476-16b2-807e-b307-e69a26002388" class="" dir="auto">
</p><p id="36a57476-16b2-8013-8b88-d2bed1125c3c" class="" dir="auto">그러면 이렇게 다음 레벨(Level 1)로 가는 비밀번호를 획득하게 됩니다. 아까 Level 0 → Level 1 페이지에서 봤던거 처럼 로컬 환경에 비밀번호를 저장해 두시는걸 추천드립니다. 그렇지 않으면 다음에 풀때 다시 풀어야 하니까요.</p><p id="36a57476-16b2-80a2-82b4-ec73cf78935c" class="" dir="auto">
</p><p id="36a57476-16b2-80ec-b6d2-d59e8a75d0d6" class="" dir="auto">Level 0 → Level 1 비밀번호</p><p id="3f157476-16b2-802e-b44f-f69029bda9b7" class="" dir="auto">
</p><p id="36a57476-16b2-802c-af7e-e5c99120cc38" class="" dir="auto">
</p><pre id="36a57476-16b2-807e-ac57-fa0015d0669c" class="code code-wrap" data-notion-code-syntax="bash"><code class="language-bash">6y2kwnwK6grgvwvpvLaa2T1cpFEKOhNR</code></pre><p id="36a57476-16b2-8095-ab94-e079cd421cf3" class="" dir="auto">
</p><hr id="36a57476-16b2-806f-8b86-cef31cf26189" dir="auto"><p id="3f157476-16b2-8002-961e-f8dad7f27253" class="" dir="auto">
</p><p id="3f157476-16b2-8044-8c5d-c93e834a4dc4" class="" dir="auto">
</p><p id="3f157476-16b2-805d-8951-f107ff45be0b" class="" dir="auto">
</p><p id="36a57476-16b2-8006-9816-f0fd2f34c1b7" class="" dir="auto">
</p><h2 id="공부-방법-3" class="" dir="auto">공부 방법</h2><p id="36a57476-16b2-80be-8a96-de7bf8c87696" class="" dir="auto">
</p><p id="36a57476-16b2-80f6-9c5e-d2d4a1b67744" class="" dir="auto">overthewire 사이트의 Commands you may need to solve this level 이라고 적혀있는데 밑에 명령어들을 llm에게 물어봐서 질문하고 어떻게 사용하는지 배운 후 bandit을 스스로 풀이하는게 제일 좋은 공부 방법이라 생각합니다. (저도 그렇게 공부했음 ㅋㅋ)</p><p id="3f157476-16b2-80e6-9760-f023be5ef720" class="" dir="auto">
</p><p id="3f157476-16b2-80ff-92bf-f36448ed1a0f" class="" dir="auto">
</p><p id="3f157476-16b2-801b-90ec-f055ad4b8ed3" class="" dir="auto">
</p></div>
