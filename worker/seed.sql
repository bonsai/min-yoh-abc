-- Initial draft data. No campaign opens until an operator changes campaign-001 to active.
INSERT OR IGNORE INTO magazine_issues (id,title,description,status) VALUES
('magazine-001','民謡ABC 第1号','投票で選ばれた民謡を、やさしい日本語とEasy Englishで読む。','preview');

INSERT OR IGNORE INTO songs (id,title,region,area,status) VALUES
('yasugi-bushi','安来節','島根県','中国','candidate'),
('kokiriko-bushi','こきりこ節','富山県・五箇山','中部・北陸','candidate'),
('antagata-dokosa','あんたがたどこさ','熊本県ゆかりの手まり歌','九州・沖縄','candidate'),
('soran-bushi','ソーラン節','北海道','北海道・東北','candidate'),
('esa-oiwake','江差追分','北海道','北海道・東北','candidate'),
('tsugaru-jongara-bushi','津軽じょんがら節','青森県','北海道・東北','candidate'),
('nanbu-ushi-oiuta','南部牛追唄','岩手県','北海道・東北','candidate'),
('akita-ondo','秋田音頭','秋田県','北海道・東北','candidate'),
('hanagasa-ondo','花笠音頭','山形県','北海道・東北','candidate'),
('aizu-bandaisan','会津磐梯山','福島県','北海道・東北','candidate'),
('yagi-bushi','八木節','群馬県・栃木県','関東','candidate'),
('kisarazu-jinku','木更津甚句','千葉県','関東','candidate'),
('chakkiri-bushi','ちゃっきり節','静岡県','中部・北陸','candidate'),
('etchu-owara-bushi','越中おわら節','富山県','中部・北陸','candidate'),
('yamanaka-bushi','山中節','石川県','中部・北陸','candidate'),
('gujo-odori-kawasaki','郡上おどり（かわさき）','岐阜県','中部・北陸','candidate'),
('ise-ondo','伊勢音頭','三重県','近畿','candidate'),
('kawachi-ondo','河内音頭','大阪府','近畿','candidate'),
('kushimoto-bushi','串本節','和歌山県','近畿','candidate'),
('ondo-no-funauta','音戸の舟唄','広島県','中国','candidate'),
('kaigara-bushi','貝殻節','鳥取県','中国','candidate'),
('awa-odori-yoshikono','阿波踊り（よしこの）','徳島県','四国','candidate'),
('yosakoi-bushi','よさこい節','高知県','四国','candidate'),
('kuroda-bushi','黒田節','福岡県','九州・沖縄','candidate'),
('tankobushi','炭坑節','福岡県','九州・沖縄','candidate'),
('kagoshima-ohara-bushi','鹿児島おはら節','鹿児島県','九州・沖縄','candidate');

INSERT OR IGNORE INTO campaigns (id,title,status,magazine_issue_id,max_songs_per_vote)
VALUES ('campaign-001','民謡ABC 第1回人気投票','draft','magazine-001',5);

INSERT OR IGNORE INTO campaign_songs (campaign_id,song_id,position) VALUES
('campaign-001','yasugi-bushi',1),('campaign-001','kokiriko-bushi',2),('campaign-001','antagata-dokosa',3),
('campaign-001','soran-bushi',4),('campaign-001','esa-oiwake',5),('campaign-001','tsugaru-jongara-bushi',6),
('campaign-001','nanbu-ushi-oiuta',7),('campaign-001','akita-ondo',8),('campaign-001','hanagasa-ondo',9),
('campaign-001','aizu-bandaisan',10),('campaign-001','yagi-bushi',11),('campaign-001','kisarazu-jinku',12),
('campaign-001','chakkiri-bushi',13),('campaign-001','etchu-owara-bushi',14),('campaign-001','yamanaka-bushi',15),
('campaign-001','gujo-odori-kawasaki',16),('campaign-001','ise-ondo',17),('campaign-001','kawachi-ondo',18),
('campaign-001','kushimoto-bushi',19),('campaign-001','ondo-no-funauta',20),('campaign-001','kaigara-bushi',21),
('campaign-001','awa-odori-yoshikono',22),('campaign-001','yosakoi-bushi',23),('campaign-001','kuroda-bushi',24),
('campaign-001','tankobushi',25),('campaign-001','kagoshima-ohara-bushi',26);
