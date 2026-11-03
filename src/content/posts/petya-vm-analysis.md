---
title: "Petya.A VM 감염 분석 및 복구 시도 라이트업"
description: "격리 VM에서 Petya.A 감염 흔적을 분석하고 MBR·NTFS 복구를 시도한 기록."
category: "Digital Forensics"
tags: ["Petya","랜섬웨어","디지털 포렌식","NTFS"]
createdAt: "2026-11-03"
updatedAt: "2026-11-03"
draft: false
notionSource: "39857476-16b2-81b3-a574-ce8386479044"
---

[정적 분석 Addendum](/posts/petya-static-analysis-addendum/)도 함께 정리했다.

## TL;DR

VirtualBox Windows 10 실험 VM에서 실행한 샘플은 Windows Defender 탐지명 기준 <code>Ransom:DOS/Petya.A</code>이며, 부팅 전 단계에서 MBR/부트로더를 장악하는 Petya 계열 부트로커로 확인됐다.

복구 시도 결과, MBR 복구로 Petya 잠금 화면 자체는 제거할 수 있었지만 Windows 정상 부팅은 실패했다. 원인은 단순 부트로더 손상이 아니라 NTFS/MFT 핵심 메타데이터 손상 및 일부 파일 암호화였다.

부분 파일 복구는 가능했다. <code>.crazy</code> 확장자가 붙지 않은 <code>NotTxtTest.nottxt</code>는 원문을 복구했고, <code>.crazy</code>가 붙은 <code>TxtTest.txt.crazy</code>는 추출은 되었지만 암호화된 32바이트 블롭으로 확인됐다.

## 실험 환경

| 항목 | 값 |
| --- | --- |
| VM | <code>Windows-Malware-Lab</code> |
| 가상화 | Oracle VirtualBox |
| 게스트 OS | Windows 10 64-bit |
| RAM / CPU | 12GB / 4 vCPU |
| 네트워크 | NAT 구성, 분석 중 케이블 연결 해제 |
| 기준 스냅샷 | <code>Network-AutoResize</code> |
| 감염 전 백업 | 스냅샷이 아니라 VDI 클론으로 별도 보존 |

중요한 안전 조치:

- 감염 확인 후 VM 네트워크 케이블을 해제했다.
- 스냅샷 복원 없이 현재 디스크를 대상으로 수술을 진행했다.
- 디스크 복구 전 감염 상태 VDI를 별도 백업했다.
- 호스트 Defender가 RAW 이미지의 Petya 시그니처를 탐지하자 호스트 RAW 스캔은 중단했다.

## 1. 초기 증상

VM 재부팅 후 Windows 로그인 화면이 아니라 부팅 전 텍스트 화면이 나타났다. 처음에는 <code>Key:</code> 입력을 요구했고, 잘못된 입력에 대해 <code>Incorrect key! Please try again.</code> 메시지를 반복했다.

![Petya 부팅 전 잠금 화면](/images/petya/01.png)

이후 재부팅 시 빨간 ASCII 아트가 나타났고, Windows는 전혀 올라오지 않았다. 해상도는 <code>720x400</code>, Guest Additions도 실행되지 않았으므로 Windows 커널 이전 단계에서 막힌 상태로 판단했다.

![Windows 설치 복구 환경](/images/petya/02.png)

## 2. 수술 전 백업

복구 시도 전 활성 감염 디스크를 별도 VDI로 클론했다.

```txt
C:\Users\<user>\VirtualBox VMs\Windows-Malware-Lab\ForensicBackups\infected-before-boot-repair-20260710-034640.vdi
```

이 백업은 원래 감염 상태를 보존하기 위한 것이며, 이후 MBR 복구와 파일 추출은 원본 활성 디스크 또는 백업 사본을 대상으로 분리해서 진행했다.

## 3. Windows ISO 복구 콘솔 진입

Windows 설치 ISO로 부팅한 뒤 <code>Shift + F10</code>으로 복구 콘솔을 열었다. 설치 GUI 자체는 사용하지 않았고, 복구 콘솔에서 디스크 상태와 부트 복구 명령을 실행했다.

## 4. 볼륨 상태 확인

<code>diskpart</code>에서 볼륨을 확인한 결과, Windows 파티션은 <code>RAW</code>로 표시됐다.

![DiskPart에서 RAW로 표시된 볼륨](/images/petya/03.png)

핵심 관찰:

- ISO는 정상적으로 <code>D:</code> CD-ROM으로 잡혔다.
- 기존 Windows 디스크는 <code>C:</code>로 잡혔지만 파일시스템이 <code>RAW</code>였다.
- 이 시점에서 단순한 MBR 손상보다 NTFS 메타데이터 손상 가능성이 높아졌다.

## 5. 부트 복구 시도

아래 복구 명령을 순서대로 시도했다.

```shell
bootrec /fixmbr
bootsect /nt60 all /mbr
bootrec /scanos
bootrec /rebuildbcd
bcdboot C:\Windows /s C: /f BIOS
```

<code>bootrec /fixmbr</code>와 <code>bootsect /nt60 all /mbr</code>는 성공했다.

![MBR 복구 명령 결과](/images/petya/04.png)

하지만 추가 부트 복구는 실패했다.

```txt
bootrec /scanos        -> Windows 설치 0개
bootrec /rebuildbcd    -> Windows 설치 0개
bcdboot C:\Windows     -> 부팅 파일 복사 실패
```

MBR 복구 후 Petya 잠금 화면은 사라졌지만, VM은 검은 화면과 커서에서 멈췄다.

![MBR 복구 후 검은 화면](/images/petya/05.png)

결론: Petya 부트로더는 제거됐지만 Windows 파일시스템이 정상 마운트되지 않아 부팅 복구는 실패했다.

## 6. 호스트 Defender 탐지

분석을 위해 감염 VDI를 RAW 이미지로 변환하자, Windows Defender가 호스트에서 <code>Ransom:DOS/Petya.A</code>를 탐지했다.

![Defender의 Petya.A 탐지](/images/petya/06.png)

탐지 대상은 호스트 시스템 파일이 아니라 감염 디스크에서 변환한 RAW 이미지였다. 따라서 본컴 감염이 아니라, 감염 디스크 이미지 내부의 Petya 부트코드를 Defender가 탐지한 것으로 판단했다.

주의:

- <code>허용된 위협</code>으로 보내면 안 된다.
- Defender의 격리/제거 처리는 정상 대응이다.
- 호스트에서 RAW 이미지를 직접 스캔하는 방식은 Defender와 충돌할 수 있다.

## 7. VDI 직접 분석

RAW 파일을 계속 쓰면 Defender가 개입하므로, VDI 포맷을 직접 읽는 방식으로 전환했다.

확인한 구조:

```txt
VDI header
└─ virtual disk
   └─ MBR
      └─ NTFS partition
         └─ NTFS boot sector
         └─ $MFT / $MFTMirr
```

VDI 내부 분석 결과:

| 항목 | 결과 |
| --- | --- |
| MBR signature | <code>55 aa</code> |
| 파티션 타입 | <code>0x07</code> NTFS |
| 파티션 시작 | sector 2048 |
| NTFS OEM string | <code>NTFS    </code> |
| Bytes per sector | 512 |
| Sectors per cluster | 8 |
| Cluster size | 4096 bytes |
| <code>$MFT</code> LCN | 786432 |
| <code>$MFTMirr</code> LCN | 2 |

흥미로운 점은 WinPE에서는 <code>RAW</code>로 보였지만, NTFS 부트섹터 자체는 살아 있었다는 것이다. 문제는 MFT 앞쪽 핵심 레코드가 손상/암호화되어 Windows가 파일시스템을 정상 마운트하지 못한 것으로 보인다.

## 8. MFT 상태

MFT 샘플링 결과:

```txt
records 128    -> FILE 3
records 1024   -> FILE 16
records 8192   -> FILE 3851
records 32768  -> FILE 28427
```

초기 핵심 레코드 중 일부는 깨졌지만, 뒤쪽 파일 레코드 상당수는 <code>FILE</code> 시그니처가 남아 있었다. 그래서 전체 OS 복구는 어렵지만, 개별 파일 복구는 가능성이 있었다.

## 9. 파일 카빙 및 MFT 기반 복구

파일 시그니처 스캔 결과:

```txt
png            22978
jpg            21990
zip/docx/xlsx   2525
7z                20
pdf               20
rar                9
```

대부분은 Windows 기본 리소스일 가능성이 있지만, MFT에서 사용자 프로필 <code>lab</code>의 데스크톱 파일도 발견됐다.

발견한 사용자 파일:

```txt
lab\Desktop\FileSystemSimulation\TxtTest.txt.crazy
lab\Desktop\FileSystemSimulation\NotTxtTest.nottxt
```

복구 결과:

| 파일 | 결과 |
| --- | --- |
| <code>NotTxtTest.nottxt</code> | 정상 복구 성공 |
| <code>TxtTest.txt.crazy</code> | 추출 성공, 원문 복구 실패 |

<code>NotTxtTest.nottxt</code> 내용:

```txt
I am NOT a txt test.
```

<code>TxtTest.txt.crazy</code>는 32바이트 데이터로 추출됐지만, 내용은 랜덤한 암호화 블롭처럼 보였다.

```txt
df a2 28 ad 40 8a 86 e6 dd 9a 65 fd ab 73 8b 3f
b3 99 77 96 1c 17 9e e9 ab 27 40 03 eb fb 94 61
```

해석:

- <code>.crazy</code> 확장자가 붙은 파일은 이름만 바뀐 것이 아니라 내용도 암호화됐다.
- <code>.crazy</code>가 붙지 않은 작은 파일은 MFT resident data로 살아 있어 복구 가능했다.

## 10. Petya 식별 근거

부트 영역 문자열 추출 결과, Petya 문구가 직접 확인됐다.

```txt
You became victim of the PETYA RANSOMWARE!
Incorrect key! Please try again.
Key:
Repairing file system on C:
Decrypting sector
```

또한 onion 주소도 발견됐다.

```txt
http://petya37h5tbhyvki.onion/3iKLTj
http://petya5koahtsf7sv.onion/3iKLTj
```

해시:

```txt
mbr_sector0 sha256:
75351f3ffb87fcc635bd59587a37b1cefe02fe93ca5a210b6a2089021d117359

first_1mb sha256:
70daf49198f34d860c71cd373acf427955018cb13b2f95c4514bd32a6d73474f

sector1_2047 sha256:
737e70a8649025564182d8f4f7e3a25e332f1d39326d10d24061e0b543c5dfe3
```

결론: Defender 탐지명 <code>Ransom:DOS/Petya.A</code>와 부트 영역 문자열이 일치하므로 Petya.A 계열로 판단한다.

## 11. 왜 감염 전 Windows로 부팅 복구가 안 됐나

핵심 이유는 MBR 문제가 아니라 NTFS 메타데이터 손상이다.

복구 가능했던 것:

- MBR 복구
- Petya 부트락 화면 제거
- 일부 MFT 레코드 읽기
- 일부 파일 복구

복구 불가능했던 것:

- Windows 설치 자동 탐지
- BCD 재생성
- 정상 Windows 부팅
- <code>.crazy</code> 파일 원문 복호화

<code>bootrec /fixmbr</code>는 문 앞의 가짜 자물쇠를 제거한 것에 가깝다. 하지만 집 안의 주소록에 해당하는 MFT가 손상되어 Windows가 자기 파일들을 찾지 못했다.

## 12. 최종 결론

이번 샘플은 단순 사용자모드 랜섬웨어가 아니라, 부트 단계에서 동작하는 Petya.A 계열 부트로커였다.

최종 판정:

- Petya 잠금 화면 제거: 성공
- Windows 정상 부팅 복구: 실패
- NTFS 전체 복구: 실패
- 파일 단위 일부 복구: 성공
- <code>.crazy</code> 암호화 파일 복호화: 실패
- 감염 식별: 성공

실험용 VM이라면 가장 현실적인 다음 단계는 <code>Network-AutoResize</code> 스냅샷으로 되돌려 새 실험을 진행하는 것이다. 감염 상태 연구용으로는 백업 VDI를 보존해 두면 된다.

## 다음에 같은 실험을 할 때 체크리스트

- 실행 전 클린 스냅샷 생성
- 네트워크 기본 차단 또는 Host-only 사용
- 클립보드/드래그앤드롭 비활성화
- 감염 후 즉시 네트워크 케이블 해제
- 복구 전 디스크 클론 생성
- RAW 변환은 Defender 탐지 가능성 때문에 격리 환경에서 수행
- 부트로커류는 MBR만이 아니라 MFT 손상 여부를 반드시 확인

[Petya.A 정적 분석 Addendum 읽기](/posts/petya-static-analysis-addendum/)

