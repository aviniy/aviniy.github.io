---
title: "Petya.A 정적 분석 Addendum"
description: "Petya.A 샘플의 PE 구조와 정적 분석 단서를 정리한 보충 기록."
category: "Digital Forensics"
tags: ["Petya","랜섬웨어","디지털 포렌식","NTFS"]
createdAt: "2026-11-03"
updatedAt: "2026-11-03"
draft: false
notionSource: "39857476-16b2-81e8-b0b2-c103e0559903"
---

[VM 감염 분석 및 복구 시도 라이트업](/posts/petya-vm-analysis/)의 정적 분석 보충 자료다.

## 요약

이 문서는 <code>Petya A VM</code> 페이지에 붙이는 추가 정적 분석 노트다. 샘플은 실행하지 않았고, VirtualBox VM 디스크 스냅샷을 읽어 파일 바이트만 분석했다.

<code>Petya.A</code> <code>Win32 PE</code> <code>MBR ransomware</code> <code>static only</code>

## 안전 조치

분석 전 VM의 네트워크 케이블을 끊고, 클립보드/드래그앤드롭/USB가 비활성화된 상태인지 확인했다. 이후 VM을 재부팅하지 않고 저장 상태로 내린 뒤, 디스크 스냅샷 체인을 VHD 복제본으로 만들어 그 안의 파일만 읽었다.

```txt
VMState="saved"
cableconnected1="off"
clipboard="disabled"
draganddrop="disabled"
usb="off"
```

Petya 계열은 실행 후 재부팅 단계에서 MBR/부트로더 조작 및 MFT 암호화로 이어질 수 있으므로, 동적 분석은 별도 격리 스냅샷에서만 진행해야 한다.

## 샘플 식별자

VM 바탕 화면에서 확인된 샘플은 다음 파일이다.

```txt
Guest path : Users\lab\Desktop\Janus@Petya.A.exe
File size  : 230,912 bytes
MD5        : af2379cc4d607a45ac44d62135fb7015
SHA1       : 39b6d40906c7f7f080e6befa93324dddadcbd9fa
SHA256     : 26b4699a7b9eeb16e76305d843d4ab05e94d43f3201436927e13b3ebafa90739
```

SHA256 <code>26b4699a7b9eeb16e76305d843d4ab05e94d43f3201436927e13b3ebafa90739</code>는 공개 Petya 기술 분석에 언급된 샘플 해시와 일치한다. 따라서 이 파일은 Petya.A 계열 드롭퍼로 판단할 수 있다.

## 획득 방식

Guest Control은 비밀번호 인증이 필요해 사용하지 않았다. 대신 VirtualBox 디스크 스냅샷을 VHD로 복제한 뒤, 7-Zip으로 NTFS 파일 시스템 내부의 샘플만 스트리밍했다.

이 과정에서 EXE를 실행하지 않았고, 분석 중 파일 바이트를 해시 계산, PE 파싱, 문자열 검사 도구에만 전달했다. Host Defender가 샘플 직접 읽기를 차단했기 때문에, 최종 해시는 VHD 내부 파일 스트림에서 Alternate Data Stream을 제외하고 계산했다.

## PE 개요

```txt
Format        : PE32 Windows GUI executable
Machine       : 0x014c, Intel 386
Entry RVA     : 0x1716f
Image base    : 0x400000
Image size    : 0x3f000
Compile time  : 2016-01-09 12:11:59 UTC
Subsystem     : Windows GUI
Signature     : Authenticode signature not observed
Mitigations   : ASLR/DEP/CFG flags not set
Overlay       : none
```

섹션 구성은 다음과 같다.

```txt
.text   raw 0x000400+0x027000, entropy 7.194, entry section
.rdata  raw 0x027400+0x00c200, entropy 4.742
.data   raw 0x033600+0x001a00, entropy 3.973
.rsrc   raw 0x035000+0x001200, entropy 5.532
.reloc  raw 0x036200+0x002400, entropy 6.587
```

<code>.text</code> 엔트로피가 비교적 높아 코드 섹션이 조밀하거나 일부 난독화/압축된 형태일 수 있다. 반면 파일 끝 오버레이는 없었고, 리소스에는 아이콘과 manifest 중심의 정상적인 PE 리소스만 확인됐다.

## Manifest 단서

Manifest에는 다음 성격의 정보가 들어 있었다.

```txt
description: WinRAR SFX module
requestedExecutionLevel: requireAdministrator
```

즉 파일은 WinRAR SFX 모듈처럼 보이는 metadata를 가지고 있으며, 실행 시 UAC 관리자 권한을 요구한다. 초기 Petya 캠페인이 이력서/포트폴리오 파일처럼 보이는 실행 파일을 유도했던 점과 잘 맞는다.

## Import 기반 행위 단서

정적 import table에서 특히 주목할 API는 다음과 같다.

```txt
CreateFileW
DeviceIoControl
FlushFileBuffers
SetFilePointer / SetFilePointerEx
ReadFile / WriteFile
CreateProcessW
OpenProcessToken / SetTokenInformation
RegCreateKeyExW / RegSetValueExW
```

<code>CreateFileW</code>, <code>DeviceIoControl</code>, <code>FlushFileBuffers</code> 조합은 디스크나 장치 직접 접근 가능성을 강하게 시사한다. 이는 Petya의 알려진 동작인 물리 디스크 접근, MBR/부트로더 조작, 강제 재부팅 후 부트 단계 암호화 흐름과 맞물린다.

또한 토큰/권한 관련 API가 보여 관리자 권한 획득 이후 더 높은 권한을 설정하거나 시스템 동작을 유도하는 코드가 있을 가능성이 있다.

## 리소스와 내장 payload 확인

리소스 디렉터리에서는 다음 항목만 확인됐다.

```txt
3/1/1033       icon-like resource
14/100/1033    group icon-like resource
24/1/1033      XML manifest
```

RAR, ZIP, 7z archive marker는 확인되지 않았다. 파일 내부에서 <code>MZ</code> 바이트 시퀀스 후보가 두 개 더 발견됐지만, 각각의 <code>e_lfanew</code>가 유효한 <code>PE\0\0</code> 시그니처를 가리키지 않아 독립 PE payload로 보기는 어렵다.

```txt
MZ hits: 0x0, 0x16415, 0x19187
0x0     : valid outer PE
0x16415 : invalid PE header
0x19187 : invalid PE header
```

따라서 현재 정적 결과만으로는 리소스나 오버레이에 별도 EXE가 그대로 묻혀 있는 형태는 아니다.

## 다운로드 출처 흔적

NTFS Alternate Data Stream <code>Zone.Identifier</code>가 존재했다.

```txt
[ZoneTransfer]
ZoneId=3
HostUrl=https://github.com/
```

<code>ZoneId=3</code>은 인터넷 영역에서 내려받은 파일임을 의미한다. 정확한 GitHub repository나 release URL은 남아 있지 않았지만, GitHub에서 받은 흔적은 확인된다.

## 판단

이 샘플은 실제 Petya.A 계열 샘플로 판단된다. 해시가 공개 분석과 일치하고, 관리자 권한 요구 manifest, 디스크 직접 접근 API, 높은 <code>.text</code> 엔트로피, 다운로드 Zone 정보가 모두 Petya 드롭퍼의 특성과 맞다.

현 상태에서는 VM이 저장 상태이고 네트워크가 차단되어 있으므로 즉각적인 확산 위험은 낮다. 다만 샘플을 실행하거나 VM을 재부팅하며 실험하면 Petya의 부트 단계 payload가 활성화될 수 있으므로, 이후 분석은 반드시 복제 스냅샷에서 진행해야 한다.

