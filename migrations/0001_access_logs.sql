-- アクセスログ。ページの表示（pageview）と画面上の操作（event）を同じ表に入れる
-- 生の IP は保存しない。visitor は IP・UA・日付・秘密の値から作ったハッシュで、日が変わると別の値になる
CREATE TABLE access_logs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  ts            INTEGER NOT NULL,          -- UNIX ミリ秒
  kind          TEXT    NOT NULL,          -- 'pageview' | 'event'
  name          TEXT,                      -- event の名前（quiz_start / quiz_complete / share など）
  path          TEXT    NOT NULL,
  status        INTEGER,
  duration_ms   INTEGER,
  result_type   TEXT,                      -- 関係する診断結果（/r/:type や event の対象）
  share_target  TEXT,                      -- 共有先（x / instagram / line / copy）。流入時は ?s= の値
  referrer_host TEXT,
  utm_source    TEXT,
  utm_medium    TEXT,
  utm_campaign  TEXT,
  country       TEXT,
  device        TEXT,                      -- mobile / tablet / desktop
  is_bot        INTEGER NOT NULL DEFAULT 0,
  visitor       TEXT,
  user_agent    TEXT
);

CREATE INDEX idx_access_logs_ts ON access_logs (ts);
CREATE INDEX idx_access_logs_kind_name_ts ON access_logs (kind, name, ts);
