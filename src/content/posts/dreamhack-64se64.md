---
title: "Dreamhack 64se64 풀이"
description: "HTML에서 인코딩된 문자열을 찾아 복호화하는 Dreamhack 문제 풀이."
category: "Dreamhack Web"
tags: ["Dreamhack","Web","Encoding"]
createdAt: "2026-11-05"
updatedAt: "2026-11-05"
draft: false
notionSource: "3375747616b2805187cbcd81c602cf2f"
---

<figure id="33757476-16b2-80f2-84ef-ec434760a6c7" class="image" data-notion-image="image%201.png" dir="ltr"><a href="../../assets/notion/b9f67f20f3.png"><img src="../../assets/notion/b9f67f20f3.png" alt="DH 64se64 풀이 이미지 1"></a></figure><p id="33757476-16b2-80b4-b736-c015ca56d348" class="" dir="auto">문제 파일을 다운 받아봅니다.</p><figure id="33757476-16b2-8024-848b-d1db6a6050e0" class="image" data-notion-image="image%202.png" dir="ltr"><a href="../../assets/notion/ff56a6e535.png"><img src="../../assets/notion/ff56a6e535.png" alt="DH 64se64 풀이 이미지 2"></a></figure><p id="33757476-16b2-801e-9a6c-dc987bcb57c3" class="" dir="auto">이러한 idenx.html 이 다운이 되고 로컬에서 실행시켜 줍니다.</p><figure class="image"><a href="/assets/notion/dreamhack-64se64-browser-redacted.png"><img src="/assets/notion/dreamhack-64se64-browser-redacted.png" alt="64se64 HTML을 연 브라우저 화면, 사용자 이름을 가린 파일 경로"></a></figure><p id="33757476-16b2-80b5-9069-c7e3205122b0" class="" dir="auto">이러한 페이지가 뜨는데 f12를 눌러 개발자 도구를 켜서 element 탭에 들어가 html 구조를 확인합니다.</p><figure id="33757476-16b2-80b6-9a3c-f4e3ec338853" class="image" data-notion-image="image%204.png" dir="ltr"><a href="../../assets/notion/a8c5a81cd1.png"><img src="../../assets/notion/a8c5a81cd1.png" alt="DH 64se64 풀이 이미지 4"></a></figure><p id="33757476-16b2-80dd-b932-ebda6fa9a54d" class="" dir="auto">이렇게 암호화된 이상한 문자열이 뜹니다. 이것을 복호화하기 위해 복호화 사이트를 들어가줍니다.</p><figure id="33757476-16b2-80eb-b15c-f4e9317d33d7" class="image" data-notion-image="image%205.png" dir="ltr"><a href="../../assets/notion/882d6e5c08.png"><img src="../../assets/notion/882d6e5c08.png" alt="DH 64se64 풀이 이미지 5"></a></figure><p id="33757476-16b2-8028-9e9c-c476156cab4f" class="" dir="auto">복호화를 하니 파이썬 코드가 나오는데 이 코드는 아스키코드로 암호화한 문자열을 복호화하고 출력하는 파이썬 코드입니다.</p><figure class="image"><a href="/assets/notion/dreamhack-64se64-terminal-redacted.png"><img src="/assets/notion/dreamhack-64se64-terminal-redacted.png" alt="64se64 플래그 출력 결과, 사용자 이름을 가린 터미널 화면"></a></figure><p id="33757476-16b2-801f-b7c5-c0e7bebc7a8a" class="" dir="auto">코드를 복사한 후 파이썬으로 실행하면 이렇게 flag 값을 얻을 수 있습니다.</p>
