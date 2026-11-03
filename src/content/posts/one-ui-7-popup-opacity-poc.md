---
title: "One UI 7 Popup View 투명도 복구 POC"
description: "숨겨진 투명도 UI를 복구하고 task surface에 alpha를 적용한 LSPosed 실험."
category: "Research"
tags: ["Android", "One UI", "LSPosed", "리버싱"]
createdAt: "2026-11-03"
updatedAt: "2026-11-03"
draft: false
notionSource: "37657476-16b2-81b8-9a09-c5aaa316e6a2"
---

Samsung Galaxy Tab S8+의 Android 15 / One UI 7 환경에서 Popup View 투명도 조절 기능을 복구하기 위한 POC를 진행했다. 목표는 숨겨진 버튼을 다시 보이게 하는 데 그치지 않고, 슬라이더 값이 실제 창 투명도에 반영되도록 하는 것이었다.

## 분석 결과

SystemUI와 framework를 살펴보니 `opacity_window` 리소스, 슬라이더 UI, `TaskOrganizer.setFreeformTaskOpacity()` API, `Task.mFreeformAlpha` 필드는 남아 있었다. 그러나 SystemUI의 버튼 노출 정책이 `opacity_window`를 숨기고 있었다.

버튼만 복구하거나 `setFreeformTaskOpacity()`를 호출하는 방식으로는 화면이 실제로 투명해지지 않았다. 실험 환경에서는 값 저장 경로와 시각 효과 적용 경로가 분리된 것으로 판단했다.

## POC 구현

LSPosed 모듈에서 SystemUI의 Popup View 버튼 표시 지점을 후킹해 투명도 버튼과 슬라이더를 복구했다. 슬라이더 입력을 받아 `SurfaceControl.Transaction.setAlpha()`를 Popup View task surface에 직접 적용했다.

창 크기를 바꾸거나 다시 배치할 때 alpha가 초기화되는 문제는 relayout 시 값을 재적용하는 방식으로 처리했다. 이후 앱별 alpha 값을 SystemUI의 `SharedPreferences`에 저장해 Popup View를 닫았다 다시 열어도 복원되도록 했다.

## 확인한 동작

- 대상 기기에서 후크 등록과 버튼 표시를 로그로 확인했다.
- 슬라이더를 움직일 때 화면 투명도가 실시간으로 변하는 것을 확인했다.
- 창 크기 변경과 Popup View 재생성 후에도 저장된 값이 재적용되는 것을 확인했다.

## 남은 과제

기본값 `1.0`의 저장 정책을 정리하고, 지원하지 않는 펌웨어에서 개별 후크 실패가 SystemUI 전체 로드를 방해하지 않도록 예외 처리가 필요하다. 기기와 펌웨어 조합별 호환성 검증도 남아 있다. 따라서 현재 결과는 **한 실기기 환경에서 검증한 POC**다.
