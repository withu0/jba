<?php

/**
 * One sample lesson per fixed category. Videos are intentionally omitted —
 * see docs/implementation/SEEDING.md for why no binaries are seeded.
 */
return [
    [
        'category' => 'scalp-release',
        'sort_order' => 1,
        'is_published' => true,
        'translations' => [
            'ja' => [
                'title' => '頭皮ほぐしの基本手技',
                'body' => "側頭筋と後頭下筋群をゆるめ、顔全体の血流を整える導入レッスンです。\n\n施術前の触診、圧のかけ方、深度の見極めまでを順を追って確認します。",
            ],
            'en' => [
                'title' => 'Scalp release fundamentals',
                'body' => "An introductory lesson on loosening the temporalis and suboccipital muscles to improve circulation across the whole face.\n\nCovers palpation before treatment, how to apply pressure, and how to judge depth.",
            ],
            'zh' => [
                'title' => '头皮放松基础手法',
                'body' => "放松颞肌与枕下肌群、改善面部整体血流的入门课程。\n\n依次讲解施术前的触诊、施压方式与力度判断。",
            ],
        ],
        'images' => [
            [
                'key' => 'palpation',
                'translations' => [
                    'ja' => ['caption' => '側頭部の触診ポイントを確認します。'],
                    'en' => ['caption' => 'Locating the palpation points on the temporal region.'],
                    'zh' => ['caption' => '确认颞部的触诊要点。'],
                ],
            ],
            [
                'key' => 'release',
                'translations' => [
                    'ja' => ['caption' => '指腹で円を描くようにゆっくり圧を加えます。'],
                    'en' => ['caption' => 'Applying slow circular pressure with the finger pads.'],
                    'zh' => ['caption' => '用指腹缓慢画圈施压。'],
                ],
            ],
        ],
    ],
    [
        'category' => 'massage-acupuncture',
        'sort_order' => 1,
        'is_published' => true,
        'translations' => [
            'ja' => [
                'title' => 'マッサージ美容鍼の導入',
                'body' => "手技と鍼を組み合わせ、表情筋のこわばりを段階的にゆるめる方法を解説します。\n\n刺入前のマッサージで筋の状態を整えることが仕上がりを左右します。",
            ],
            'en' => [
                'title' => 'Introduction to massage beauty acupuncture',
                'body' => "How to combine manual technique with needling to release facial muscle tension in stages.\n\nPreparing the muscle with massage before insertion is what determines the final result.",
            ],
            'zh' => [
                'title' => '按摩美容针入门',
                'body' => "讲解如何将手法与针灸结合，分阶段放松表情肌的紧张。\n\n进针前用按摩调整肌肉状态，将直接影响最终效果。",
            ],
        ],
        'images' => [
            [
                'key' => 'prepare',
                'translations' => [
                    'ja' => ['caption' => '施術前に頬部の緊張を確認します。'],
                    'en' => ['caption' => 'Checking tension in the cheek before treatment.'],
                    'zh' => ['caption' => '施术前确认颊部的紧张状态。'],
                ],
            ],
            [
                'key' => 'needling',
                'translations' => [
                    'ja' => ['caption' => '角度を保ちながら浅く刺入します。'],
                    'en' => ['caption' => 'Inserting shallowly while holding a steady angle.'],
                    'zh' => ['caption' => '保持角度，浅层进针。'],
                ],
            ],
        ],
    ],
    [
        'category' => 'electric-acupuncture',
        'sort_order' => 1,
        'is_published' => true,
        'translations' => [
            'ja' => [
                'title' => '電気美容鍼の出力設定',
                'body' => "低周波の出力設定と通電時間の目安を、部位ごとに整理します。\n\n通電中の観察ポイントと、中止すべきサインも合わせて確認してください。",
            ],
            'en' => [
                'title' => 'Setting output for electric beauty acupuncture',
                'body' => "Low-frequency output settings and recommended stimulation times, organised per facial region.\n\nAlso covers what to watch for during stimulation and the signs that mean you should stop.",
            ],
            'zh' => [
                'title' => '电气美容针的输出设置',
                'body' => "按部位整理低频输出设置与通电时间的参考值。\n\n同时确认通电过程中的观察要点以及应当停止的信号。",
            ],
        ],
        'images' => [
            [
                'key' => 'device',
                'translations' => [
                    'ja' => ['caption' => '出力レベルは最小から段階的に上げます。'],
                    'en' => ['caption' => 'Raise the output level gradually from the minimum.'],
                    'zh' => ['caption' => '输出强度应从最小档逐级提升。'],
                ],
            ],
            [
                'key' => 'placement',
                'translations' => [
                    'ja' => ['caption' => 'クリップは鍼柄の根元に確実に留めます。'],
                    'en' => ['caption' => 'Clip firmly onto the base of the needle handle.'],
                    'zh' => ['caption' => '夹子须牢固夹在针柄根部。'],
                ],
            ],
        ],
    ],
    [
        'category' => 'finger-acupuncture',
        'sort_order' => 1,
        'is_published' => true,
        'translations' => [
            'ja' => [
                'title' => '指鍼の基本と適応',
                'body' => "指先の反応点を用いたアプローチの基本と、顔面症状との対応関係をまとめます。\n\n刺激量が過多になりやすい部位のため、時間管理を重視します。",
            ],
            'en' => [
                'title' => 'Finger acupuncture basics and indications',
                'body' => "The basics of working with reactive points on the fingertips and how they map to facial symptoms.\n\nThis area over-stimulates easily, so timing discipline matters.",
            ],
            'zh' => [
                'title' => '指针基础与适应症',
                'body' => "总结利用指尖反应点的基本方法，以及与面部症状的对应关系。\n\n该部位易出现刺激过量，需重视时间管理。",
            ],
        ],
        'images' => [
            [
                'key' => 'points',
                'translations' => [
                    'ja' => ['caption' => '井穴周辺の反応点を探ります。'],
                    'en' => ['caption' => 'Searching for reactive points around the jing-well points.'],
                    'zh' => ['caption' => '探查井穴周边的反应点。'],
                ],
            ],
            [
                'key' => 'timing',
                'translations' => [
                    'ja' => ['caption' => '置鍼時間は短めに設定します。'],
                    'en' => ['caption' => 'Keep retention time on the short side.'],
                    'zh' => ['caption' => '留针时间应设置得较短。'],
                ],
            ],
        ],
    ],
    [
        'category' => 'gold-acupuncture',
        'sort_order' => 1,
        'is_published' => true,
        'translations' => [
            'ja' => [
                'title' => '金鍼の取り扱いと衛生管理',
                'body' => "金鍼特有のしなりを踏まえた保持方法と、使用前後の衛生管理手順を解説します。\n\n素材の違いが刺入感に与える影響も確認します。",
            ],
            'en' => [
                'title' => 'Handling and hygiene for gold needles',
                'body' => "How to hold gold needles given their particular flex, plus hygiene procedures before and after use.\n\nAlso covers how the material changes the feel of insertion.",
            ],
            'zh' => [
                'title' => '金针的操作与卫生管理',
                'body' => "结合金针特有的柔韧性讲解持针方法，以及使用前后的卫生管理流程。\n\n同时确认材质差异对进针手感的影响。",
            ],
        ],
        'images' => [
            [
                'key' => 'handling',
                'translations' => [
                    'ja' => ['caption' => '鍼体を支えて真っ直ぐに保ちます。'],
                    'en' => ['caption' => 'Support the shaft so the needle stays straight.'],
                    'zh' => ['caption' => '托住针体，保持针身笔直。'],
                ],
            ],
            [
                'key' => 'hygiene',
                'translations' => [
                    'ja' => ['caption' => '使用後は所定の手順で洗浄・保管します。'],
                    'en' => ['caption' => 'Clean and store using the prescribed procedure after use.'],
                    'zh' => ['caption' => '使用后按规定流程清洗并保管。'],
                ],
            ],
        ],
    ],
    [
        'category' => 'summary',
        'sort_order' => 1,
        'is_published' => false,
        'translations' => [
            'ja' => [
                'title' => '全カテゴリのまとめと施術計画',
                'body' => "各手技をどう組み合わせ、1回の施術に落とし込むかを整理する総まとめです。\n\n※このレッスンは下書きとして登録されています。",
            ],
            'en' => [
                'title' => 'Wrap-up and treatment planning',
                'body' => "A summary of how to combine the individual techniques into a single treatment session.\n\nNote: this lesson is seeded as a draft.",
            ],
            'zh' => [
                'title' => '综合总结与施术计划',
                'body' => "总结如何将各项手法组合并落实到一次施术中。\n\n注：本课程以草稿状态录入。",
            ],
        ],
        'images' => [
            [
                'key' => 'plan',
                'translations' => [
                    'ja' => ['caption' => '施術計画のテンプレート例です。'],
                    'en' => ['caption' => 'An example treatment planning template.'],
                    'zh' => ['caption' => '施术计划模板示例。'],
                ],
            ],
        ],
    ],
];
