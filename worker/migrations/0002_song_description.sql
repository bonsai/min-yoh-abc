-- Add descriptive metadata to the shared song catalog.
ALTER TABLE songs ADD COLUMN description TEXT NOT NULL DEFAULT '';

UPDATE songs SET description='島根県安来地方の民謡。「どじょうすくい」の踊りで知られる。' WHERE id='yasugi-bushi';
UPDATE songs SET description='富山県五箇山に伝わる古い民謡。' WHERE id='kokiriko-bushi';
UPDATE songs SET description='熊本ゆかりの手まり歌・わらべ歌。' WHERE id='antagata-dokosa';
UPDATE songs SET description='北海道のニシン漁の作業唄として知られる民謡。' WHERE id='soran-bushi';
UPDATE songs SET description='北海道江差地方に伝わる追分節。' WHERE id='esa-oiwake';
UPDATE songs SET description='津軽三味線の代表曲。技巧的な演奏で知られる。' WHERE id='tsugaru-jongara-bushi';
UPDATE songs SET description='南部地方の牛追い労働から生まれた唄。' WHERE id='nanbu-ushi-oiuta';
UPDATE songs SET description='秋田県を代表する音頭。祭りや盆踊りで親しまれる。' WHERE id='akita-ondo';
UPDATE songs SET description='山形花笠まつりで知られる音頭。' WHERE id='hanagasa-ondo';
UPDATE songs SET description='会津地方に伝わる民謡。' WHERE id='aizu-bandaisan';
UPDATE songs SET description='群馬県・栃木県周辺で知られる民謡。' WHERE id='yagi-bushi';
UPDATE songs SET description='千葉県木更津地方に伝わる甚句。' WHERE id='kisarazu-jinku';
UPDATE songs SET description='静岡県に伝わる茶摘みの唄。' WHERE id='chakkiri-bushi';
UPDATE songs SET description='おわら風の盆で知られる富山県の民謡。' WHERE id='etchu-owara-bushi';
UPDATE songs SET description='石川県山中温泉に伝わる民謡。' WHERE id='yamanaka-bushi';
UPDATE songs SET description='郡上おどりで歌い踊られる民謡。' WHERE id='gujo-odori-kawasaki';
UPDATE songs SET description='お伊勢参りの道中で広まった音頭。' WHERE id='ise-ondo';
UPDATE songs SET description='大阪の盆踊りで親しまれる、語りの要素も強い音頭。' WHERE id='kawachi-ondo';
UPDATE songs SET description='和歌山県串本地方に伝わる民謡。' WHERE id='kushimoto-bushi';
UPDATE songs SET description='広島県音戸地方の舟唄。' WHERE id='ondo-no-funauta';
UPDATE songs SET description='鳥取県に伝わる舟唄。' WHERE id='kaigara-bushi';
UPDATE songs SET description='徳島の阿波踊りで歌われる囃子詞・唄。' WHERE id='awa-odori-yoshikono';
UPDATE songs SET description='高知県のよさこい祭りの原点として知られる民謡。' WHERE id='yosakoi-bushi';
UPDATE songs SET description='福岡・博多で知られる勇壮な民謡。' WHERE id='kuroda-bushi';
UPDATE songs SET description='炭鉱の仕事や地域文化に結びついた民謡。' WHERE id='tankobushi';
UPDATE songs SET description='鹿児島を代表する民謡。おはら節とも呼ばれる。' WHERE id='kagoshima-ohara-bushi';

INSERT OR IGNORE INTO songs (id,title,region,area,description,status) VALUES
('hokkaido-bon','北海盆唄','北海道','北海道・東北','北海道の盆踊りで広く歌われる定番の民謡。','published'),
('kusatsu-bushi','草津節','群馬県','関東','草津温泉で親しまれる民謡。','published'),
('chichibu-ondo','秩父音頭','埼玉県','関東','埼玉県秩父地方の音頭。','published'),
('fukagawa-ondo','深川音頭','東京都','関東','東京の深川地域に伝わる音頭。','published'),
('echigo-jishi','越後獅子','新潟県','中部・北陸','越後の獅子舞とともに伝わる囃子もの。','published'),
('kiso-bushi','木曽節','長野県','中部・北陸','木曽路の旅情を歌う民謡。','published');

