# LLM Token Pricebook

일별 모델별 토큰 가격을 저장하고, 입력·출력 토큰 믹스와 사용 가중치로 Open / Closed / 전체 지수를 계산하는 웹 도구입니다.

## 자동 갱신

`.github/workflows/daily-pricebook.yml`이 매일 실행되어 OpenRouter의 공개 모델 가격을 `data/pricebook.json`에 새 날짜로 누적합니다. GitHub의 커밋 기록과 JSON 파일 모두 일별 스냅샷을 보존합니다.

> OpenRouter 가격은 Silicon Data의 유료 지수 원자료와 동일하지 않은 공개 참고 데이터입니다.

## 실행

```bash
npm install
npm run dev
```

모델별 단가는 USD / 1M tokens 기준이며, 정규화 가격은 입력 단가와 출력 단가를 출력 비중으로 가중평균합니다.
