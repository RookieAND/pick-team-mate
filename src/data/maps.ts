export type MapMode = '점령' | '호위' | '혼합' | '밀어붙이기' | '플래시포인트' | '섬멸';

export interface OWMap {
  name: string;
  mode: MapMode;
}

export const OW_MAPS: OWMap[] = [
  // 점령 (Control)
  { name: '부산', mode: '점령' },
  { name: '일루오스', mode: '점령' },
  { name: '리장 타워', mode: '점령' },
  { name: '네팔', mode: '점령' },
  { name: '오아시스', mode: '점령' },
  { name: '사모아', mode: '점령' },
  { name: '남극 반도', mode: '점령' },

  // 호위 (Escort)
  { name: '66번 국도', mode: '호위' },
  { name: '감시 기지: 지브롤터', mode: '호위' },
  { name: '도라도', mode: '호위' },
  { name: '리알토', mode: '호위' },
  { name: '샴발리 수도원', mode: '호위' },
  { name: '서킷 로얄', mode: '호위' },
  { name: '쓰레기촌', mode: '호위' },
  { name: '하바나', mode: '호위' },

  // 혼합 (Hybrid)
  { name: '눔바니', mode: '혼합' },
  { name: '미드타운', mode: '혼합' },
  { name: '블리자드 월드', mode: '혼합' },
  { name: '아이헨발데', mode: '혼합' },
  { name: '왕의 길', mode: '혼합' },
  { name: '파라이수', mode: '혼합' },
  { name: '할리우드', mode: '혼합' },
  { name: '네온 정션', mode: '혼합' },

  // 밀어붙이기 (Push)
  { name: '뉴 퀸 스트리트', mode: '밀어붙이기' },
  { name: '이스페란사', mode: '밀어붙이기' },
  { name: '콜로세오', mode: '밀어붙이기' },
  { name: '루나사피', mode: '밀어붙이기' },

  // 플래시포인트 (Flashpoint)
  { name: '뉴 정크 시티', mode: '플래시포인트' },
  { name: '수라바사', mode: '플래시포인트' },
  { name: '아틀리스', mode: '플래시포인트' },

  // 섬멸 (Clash)
  { name: '하나오카', mode: '섬멸' },
  { name: '클라우드뱅크', mode: '섬멸' },
];

// 선공/후공이 의미 있는 모드
export const HAS_SIDE: MapMode[] = ['호위', '혼합', '밀어붙이기'];
