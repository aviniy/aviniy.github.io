---
title: "One UI 7 Popup View 투명도 복구 POC"
description: "숨겨진 투명도 UI를 복구하고 task surface에 alpha를 적용한 LSPosed 실험 전체 기록."
category: "Misc"
tags: ["Android", "One UI", "LSPosed", "리버싱"]
createdAt: "2026-11-03"
updatedAt: "2026-11-04"
draft: false
notionSource: "37657476-16b2-81b8-9a09-c5aaa316e6a2"
---

## 요약

Samsung Galaxy Tab S8+ SM-X800 / Android 15 / One UI 7.0 환경에서 제거된 것처럼 보이는 Popup View 투명도 기능을 LSPosed 모듈로 복구하는 POC를 진행했다.

현재 결론은 다음과 같다.

- One UI 7 내부에 Popup View opacity 관련 리소스와 API는 남아 있다.
- 하지만 UI 버튼은 SystemUI 쪽 정책 코드에서 숨겨져 있다.
- `setFreeformTaskOpacity()` API는 존재하고 값도 저장하지만, One UI 7에서는 실제 화면 alpha 적용 경로가 끊겼거나 비활성화된 것으로 보인다.
- 최종 POC는 기존 opacity 버튼과 슬라이더 UI를 되살리고, 실제 투명도는 `SurfaceControl.Transaction.setAlpha()`로 Popup View task surface에 직접 적용한다.

## 대상 환경

- Device: Samsung Galaxy Tab S8+ Wi-Fi
- Model: SM-X800
- Firmware 계열: One UI 7 / Android 15
- Root: Magisk 30.7
- Zygisk: 사용
- LSPosed: LSPosed_mod v1.9.3_mod
- Module package: `com.example.oneui7popupopacitypoc`
- Hook scope: `com.android.systemui`

## 리버싱 결론

### 남아있는 구성요소

One UI 7 SystemUI와 framework/services 분석 결과 opacity 기능 흔적은 완전히 삭제되지 않았다.

- `opacity_window` resource 존재
- `WindowDecorSlider` 존재
- `sec_caption_handle_menu.xml` 내부에 slider 관련 UI 존재
- `TaskOrganizer.setFreeformTaskOpacity()` 존재
- `TaskOrganizer.getFreeformTaskOpacity()` 존재
- `TaskOrganizerController.setFreeformTaskOpacity()` 구현 존재
- `Task.mFreeformAlpha` 필드 존재

확인된 resource ID:

```txt
opacity_window = 0x7f0a0879
```

### 숨겨진 위치

버튼이 사라진 핵심 원인은 UI 제거라기보다 SystemUI 정책에서 opacity 버튼을 강제로 숨기는 쪽에 가깝다.

- `CaptionShellUtils.isButtonVisible()`에서 `opacity_window`에 대해 false 처리
- `FreeformCaptionButtonPolicy.setupButtons()`에서 `opacity_window` 버튼을 GONE 처리

즉 버튼 UI와 슬라이더 리소스는 남아 있지만, 노출 정책이 막혀 있다.

### API만으로 부족했던 이유

`TaskOrganizer.setFreeformTaskOpacity(taskId, alpha)` 호출 자체는 가능했고 로그도 확인됐다. 하지만 실제 Popup View 투명도가 바뀌지 않았다.

판단:

- API와 내부 값 저장은 살아 있음
- `mFreeformAlpha` 업데이트도 가능해 보임
- 하지만 One UI 7의 실제 window/surface 렌더링 경로에서 이 값을 alpha로 적용하지 않는 것으로 보임

그래서 최종적으로 직접 surface alpha를 건드리는 방식이 필요했다.

## Hook 포인트

### 버튼 표시 복구

```txt
com.android.wm.shell.windowdecor.CaptionShellUtils.isButtonVisible(...)
```

- `opacity_window` 버튼에 대해 true를 반환하도록 후킹
- 기본 SystemUI 정책에서 숨긴 버튼을 다시 표시

```txt
com.android.wm.shell.windowdecor.FreeformCaptionButtonPolicy.setupButtons(...)
```

- setup 이후 `opacity_window` view를 찾아 `VISIBLE`, `enabled`, `alpha=1.0`으로 복구
- 클릭 리스너를 새로 붙여 slider container를 표시

### 슬라이더 제어

```txt
com.android.wm.shell.windowdecor.MultiTaskingWindowDecorViewModel$CaptionTouchEventListener.onProgressChanged(...)
```

- 내장 `WindowDecorSlider` 움직임 감지
- progress를 0~100 범위 alpha 값으로 변환
- 실시간으로 popup surface alpha 적용

### 실제 alpha 적용

```txt
android.view.SurfaceControl.Transaction.setAlpha(surface, alpha)
```

- Popup View task surface에 직접 alpha 적용
- `WindowDecoration.mTaskSurface`를 찾아 적용

보조 호출:

```txt
android.window.WindowContainerTransaction.setFreeformTranslucent(taskToken, mode)
android.window.TaskOrganizer.setFreeformTaskOpacity(taskId, alpha)
```

삼성 내부 상태와 가능한 한 맞춰두되, 실제 시각 효과는 surface alpha가 담당한다.

### 크기 변경 후 alpha 유지

Popup View 크기를 바꾸면 SystemUI가 relayout/transition 과정에서 surface 상태를 다시 세팅하면서 불투명해지는 문제가 있었다.

```txt
com.android.wm.shell.windowdecor.MultiTaskingWindowDecoration.relayout(...)
com.android.wm.shell.windowdecor.MultiTaskingWindowDecorViewModel.onTaskChanging(...)
```

- taskId별 현재 alpha를 메모리에 저장
- relayout 후 decoration의 `mTaskSurface`에 alpha 재적용
- transition transaction에도 `setAlpha()`를 같이 넣어 transaction 순서 문제를 줄임

## 동작 흐름

1. 사용자가 앱을 Popup View로 띄운다.
2. SystemUI가 caption button/menu를 구성한다.
3. LSPosed hook이 `opacity_window` 버튼을 다시 보이게 만든다.
4. 사용자가 opacity 버튼을 누른다.
5. 숨겨져 있던 slider container를 표시한다.
6. slider progress를 alpha 값으로 변환한다.
7. `WindowDecoration.mTaskSurface`에 `SurfaceControl.Transaction.setAlpha()`를 적용한다.
8. resize/relayout/onTaskChanging 시 저장된 alpha를 다시 적용한다.

## 현재 POC 상태

구현된 것:

- opacity 버튼 표시 복구
- 버튼 클릭 시 기존 slider UI 표시
- slider 이동 시 실시간 Popup View 투명도 변경
- `setFreeformTaskOpacity()` 호출 로그 확인
- `SurfaceControl.Transaction.setAlpha()` 직접 적용
- resize 후 alpha 유지를 위한 relayout/onTaskChanging hook 추가

초기 제품화 전 단계에서 남아 있던 항목:

- 앱별 alpha 저장
- 재부팅 후 alpha 유지
- One UI 빌드별 resource/class 차이 대응
- 로그 정리
- unsupported firmware graceful disable

## 주요 트러블슈팅 기록

### LSPosed Manager 문제

기존 LSPosed Manager가 Android 15 환경에서 정상 동작하지 않거나 crash 문제가 있었다.

- LSPosed_mod v1.9.3_mod 사용
- Zygisk 활성화
- module scope를 `com.android.systemui`에 직접 지정

### Xposed stub 문제

초기 stub에서 hook 메서드 return type이 맞지 않아 런타임에서 `NoSuchMethodError`가 발생했다.

- `XposedHelpers.findAndHookMethod(...)` stub return type을 `XC_MethodHook.Unhook`로 맞춤
- `XposedBridge.hookAllMethods(...)`도 동일하게 맞춤

### SystemUI R class 문제

`com.android.systemui.R$id`를 직접 찾는 방식은 ClassNotFound가 발생할 수 있었다.

- `Resources.getIdentifier("opacity_window", "id", "com.android.systemui")` 우선 사용
- 실패 시 hardcoded fallback `0x7f0a0879` 사용

### API 호출은 되는데 투명도 변화 없음

`setFreeformTaskOpacity()`는 호출됐지만 실제 화면 변화가 없었다. One UI 7에서 API는 남아 있지만 실제 렌더링 적용 경로가 빠져 있거나 비활성화된 것으로 판단했다.

해결은 `WindowDecoration.mTaskSurface`를 직접 찾아 `SurfaceControl.Transaction.setAlpha()`를 적용하는 것이었다.

### 창 크기 변경 시 불투명해지는 문제

크기 변경이나 relayout 중 surface transaction이 다시 들어가며 alpha가 1.0으로 돌아가는 현상이 있었다.

- taskId별 alpha 저장
- `MultiTaskingWindowDecoration.relayout(...)` 이후 alpha 재적용
- `MultiTaskingWindowDecorViewModel.onTaskChanging(...)`의 start/finish transaction에도 alpha 적용

## Logcat 필터

```bash
adb logcat -s PopupOpacityPOC LSPosed-Bridge LSPosed
```

```bash
adb logcat | grep PopupOpacityPOC
```

확인해야 하는 로그 예시:

```txt
Hooked CaptionShellUtils.isButtonVisible
Hooked FreeformCaptionButtonPolicy.setupButtons
Restored opacity button visible
Showing opacity slider
Applied surface alpha
Restored alpha after relayout
Restored alpha in onTaskChanging
```

## 배포 가능성

일반 앱 형태 배포는 어렵다.

- 일반 앱은 SystemUI 내부 class를 후킹할 수 없음
- 다른 앱의 Popup View task surface에 직접 alpha 적용 권한이 없음
- `SurfaceControl`/TaskOrganizer 계열 접근은 system/root/privileged 영역

가능한 배포 형태:

- LSPosed module APK
- Magisk/Zygisk 기반 모듈
- XDA/GitHub 배포

배포 시 반드시 안내해야 할 조건:

- root, Magisk, Zygisk, LSPosed 필요
- bootloader unlock 필요
- OTA 후 깨질 수 있음
- tested build 외에서는 class/resource ID가 다를 수 있음

## 보안 메모

현재 기기는 bootloader unlocked + root + LSPosed 상태라 기본 보안 모델이 약해져 있다.

- 출처 불명 Magisk/LSPosed 모듈 설치 금지
- USB debugging은 작업 후 꺼두기
- Magisk DenyList/앱별 root 권한 관리 확인
- banking/DRM/회사 계정용 기기로 사용하지 않기
- OTA 업데이트 전 원복/백업 준비

## 다음 할 일

1. 앱별 alpha 저장 구조 만들기
2. Popup task packageName 추출
3. SharedPreferences 또는 module config로 packageName → alpha 저장
4. Popup View 생성/relayout 시 저장 alpha 자동 적용
5. Slider 초기 progress를 저장값과 맞추기
6. SystemUI build fingerprint 체크
7. resource ID fallback 테이블 구성
8. release build, README, 위험 고지 작성

## 최종 판단

One UI 7의 Popup View 투명도 기능은 완전히 삭제됐다기보다, UI와 실제 적용 경로가 분리된 상태로 남아 있는 것으로 보인다.

- UI 리소스와 내부 API는 남아 있음
- 버튼은 정책 코드에서 숨겨짐
- API는 값 저장용으로 살아 있음
- 실제 시각 효과는 더 이상 자동 연결되지 않음
- LSPosed로 버튼/슬라이더를 복구하고 surface alpha를 직접 적용하면 실사용 가능한 POC가 가능함

## 2026-10-11 작업 재개 기록

### 구현 완료

- Popup task의 `topActivity`, `baseActivity`, `origActivity`, `realActivity`에서 packageName 추출
- SystemUI 프로세스의 `SharedPreferences`에 `package_alpha:<packageName>` 형식으로 앱별 alpha 저장
- 새 Popup task 생성 및 relayout 시 저장된 alpha 자동 로드·재적용
- opacity slider 초기 progress를 저장값과 동기화
- task 상태 맵을 `ConcurrentHashMap`으로 변경
- 테스트용 `MainActivity`의 AppCompat 테마 충돌 수정 (`AppCompatActivity` → framework `Activity`)

### 실기기 검증

- 대상: Samsung Galaxy Tab S8+ Wi-Fi / SM-X800 / Android 15 / One UI 7
- Magisk의 `Zygisk - LSPosed v1.9.3_mod (7244)` 모듈을 다시 활성화하고 재부팅
- LSPosed가 `com.android.systemui`에서 `HookEntry`를 로드하는 로그 확인
- 모든 주요 hook 등록 성공
- 테스트 앱을 freeform Popup View로 실행
- `opacity_window` 버튼 복구 로그 확인
- slider 입력에 따라 `SurfaceControl` alpha가 실시간 적용되는 것을 화면과 로그로 확인
- `Saved package alpha` 로그 확인
- Popup task를 닫고 다시 생성한 뒤 `Loaded saved package alpha` 및 relayout 재적용 로그 확인

### 남은 작업

1. alpha가 1.0인 기본값은 저장하지 않거나 기존 키를 제거하도록 저장 정책 정리
2. unsupported firmware에서 개별 hook 실패가 SystemUI 로드를 방해하지 않도록 hook별 `runCatching` 및 graceful disable 적용
3. build fingerprint 및 SystemUI resource/class 호환성 테이블 추가
4. 디버그 로그 레벨 정리와 release build/README 작성
