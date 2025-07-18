export type RouteDestination = {
    lat: number,
    lng: number,
    name: string,
    type: number,
    imageUrl?: string,
    description?: string[]
}

export type DestinationType = {
    name: string,
    id: string,
    icon: string,
}

export type Route = {
    fromIndex: number,
    toIndex: number,
    nodes: [number, number][],
}

// The program I used to generate the paths game [lng,lat] coordinates instead of [lat,lng].
// This function switches them.
function switcharoo(lng: number, lat: number): [number, number] {
    return [lat, lng]
}

export const destinations: RouteDestination[] = [
    {
        lat: -6.2277027,
        lng: 106.7972,
        name: "Senayan City",
        type: 0,
        imageUrl: "https://www.kemangvillage.co.id/wp-content/uploads/2023/08/Mall-Senayan-City-Jakarta-Pusat-Daftar-Tenant.jpg"
    },
    {
        lat: -6.225582,
        lng: 106.7999,
        name: "Plaza Senayan",
        type: 0,
        description: ["Plaza Senayan is a mall nearby Senayan City"]
    },
    {
        lat: -6.218537041333164,
        lng: 106.80004427692597,
        name: "GBK Arena",
        type: 2,
        imageUrl: "https://gbk.id/upload/1706593101-Outdoor.webp"
    },
    {
        lat: -6.2244341367394584,
        lng: 106.79889595715424,
        name: "Starbucks",
        type: 1
    },
    {
        lat: -6.22207730237274,
        lng: 106.79895512307651,
        name: "Fairmont Jakarta",
        type: 3
    },
    {
        lat: -6.227612580292435,
        lng: 106.79885208606721,
        name: "Hotel STC Senayan",
        type: 3
    },
    {
        lat: -6.21850399860349,
        lng: 106.80948972702028,
        name: "The Sultan Hotel Jakarta",
        type: 3
    },
    {
        lat: -6.214760800787998,
        lng: 106.8075478076935,
        name: "Jakarta Convention Center",
        type: 0
    },
    {
        lat: -6.2256281, lng: 106.8025671,
        name: "Perpustakaan",
        type: 4
    }
]

export const destinationTypes: DestinationType[] = [
    {
        name: "Shopping",
        id: "shopping",
        icon: "local_mall",
    },
    {
        name: "Food & Drink",
        id: "food",
        icon: "fork_spoon"
    },
    {
        name: "Exercise",
        id: "exercise",
        icon: "steps"
    },
    {
        name: "Hotel",
        id: "hotel",
        icon: "hotel"
    },
    {
        name: "Education",
        id: "education",
        icon: "book_ribbon"
    }
]

export const routes: Route[] = [
    {
        fromIndex: 6,
        toIndex: 7,
        nodes: [[
            106.810308,
            -6.218595
        ],
        [
            106.810321,
            -6.218725
        ],
        [
            106.810355,
            -6.218777
        ],
        [
            106.810408,
            -6.218808
        ],
        [
            106.81047,
            -6.218811
        ],
        [
            106.810467,
            -6.218991
        ],
        [
            106.810485,
            -6.21921
        ],
        [
            106.810508,
            -6.219272
        ],
        [
            106.810627,
            -6.219464
        ],
        [
            106.810551,
            -6.219699
        ],
        [
            106.810433,
            -6.220036
        ],
        [
            106.810228,
            -6.22046
        ],
        [
            106.810159,
            -6.220557
        ],
        [
            106.809918,
            -6.220826
        ],
        [
            106.809875,
            -6.220843
        ],
        [
            106.809833,
            -6.220841
        ],
        [
            106.8099,
            -6.220949
        ],
        [
            106.810006,
            -6.221051
        ],
        [
            106.81023,
            -6.220837
        ],
        [
            106.810359,
            -6.220683
        ],
        [
            106.810465,
            -6.220498
        ],
        [
            106.81052,
            -6.220358
        ],
        [
            106.810809,
            -6.219543
        ],
        [
            106.810958,
            -6.219071
        ],
        [
            106.811139,
            -6.218579
        ],
        [
            106.811151,
            -6.218439
        ],
        [
            106.81115,
            -6.218289
        ],
        [
            106.811127,
            -6.218138
        ],
        [
            106.811056,
            -6.21784
        ],
        [
            106.810439,
            -6.216911
        ],
        [
            106.810023,
            -6.216315
        ],
        [
            106.809762,
            -6.215972
        ],
        [
            106.809101,
            -6.215048
        ],
        [
            106.808798,
            -6.214567
        ],
        [
            106.808581,
            -6.214241
        ],
        [
            106.808287,
            -6.213847
        ],
        [
            106.808038,
            -6.214017
        ],
        [
            106.80791,
            -6.213887
        ],
        [
            106.80787,
            -6.21386
        ],
        [
            106.807825,
            -6.213842
        ],
        [
            106.807724,
            -6.213821
        ],
        [
            106.80717,
            -6.213846
        ],
        [
            106.807145,
            -6.213419
        ],
        [
            106.807123,
            -6.213368
        ],
        [
            106.807089,
            -6.213328
        ],
        [
            106.806945,
            -6.213255
        ],
        [
            106.806641,
            -6.213241
        ]
        ].map((v) => switcharoo(v[0], v[1]))
    },
    {
        fromIndex: 7,
        toIndex: 2,
        nodes: [
            [
                106.806641,
                -6.213241
            ],
            [
                106.806945,
                -6.213255
            ],
            [
                106.807089,
                -6.213328
            ],
            [
                106.807123,
                -6.213368
            ],
            [
                106.807145,
                -6.213419
            ],
            [
                106.80717,
                -6.213846
            ],
            [
                106.807724,
                -6.213821
            ],
            [
                106.807825,
                -6.213842
            ],
            [
                106.80787,
                -6.21386
            ],
            [
                106.80791,
                -6.213887
            ],
            [
                106.808038,
                -6.214017
            ],
            [
                106.808287,
                -6.213847
            ],
            [
                106.808043,
                -6.213517
            ],
            [
                106.807383,
                -6.212875
            ],
            [
                106.807164,
                -6.212769
            ],
            [
                106.806987,
                -6.212715
            ],
            [
                106.80652,
                -6.212646
            ],
            [
                106.806487,
                -6.212669
            ],
            [
                106.806426,
                -6.212685
            ],
            [
                106.806219,
                -6.212717
            ],
            [
                106.80567,
                -6.212832
            ],
            [
                106.805246,
                -6.212911
            ],
            [
                106.805092,
                -6.212929
            ],
            [
                106.804826,
                -6.212938
            ],
            [
                106.802683,
                -6.21344
            ],
            [
                106.802582,
                -6.213475
            ],
            [
                106.802046,
                -6.213617
            ],
            [
                106.79933,
                -6.214283
            ],
            [
                106.798719,
                -6.214435
            ],
            [
                106.798355,
                -6.214541
            ],
            [
                106.798277,
                -6.214574
            ],
            [
                106.798212,
                -6.214626
            ],
            [
                106.798177,
                -6.214666
            ],
            [
                106.798149,
                -6.214744
            ],
            [
                106.798139,
                -6.214948
            ],
            [
                106.798206,
                -6.215592
            ],
            [
                106.798248,
                -6.216467
            ],
            [
                106.798285,
                -6.218096
            ],
            [
                106.798458,
                -6.218208
            ],
            [
                106.798504,
                -6.218249
            ],
            [
                106.798532,
                -6.218292
            ],
            [
                106.798552,
                -6.21837
            ],
            [
                106.798547,
                -6.218549
            ],
            [
                106.79856,
                -6.218549
            ]
        ].map((v) => switcharoo(v[0], v[1])),
    },
    {
        fromIndex: 2,
        toIndex: 1,
        nodes: [
            [
                106.79856,
                -6.218549
            ],
            [
                106.798547,
                -6.218549
            ],
            [
                106.798544,
                -6.21872
            ],
            [
                106.798532,
                -6.218821
            ],
            [
                106.798489,
                -6.218884
            ],
            [
                106.79842,
                -6.218943
            ],
            [
                106.798375,
                -6.218969
            ],
            [
                106.798262,
                -6.219006
            ],
            [
                106.798227,
                -6.219877
            ],
            [
                106.7982,
                -6.220355
            ],
            [
                106.798199,
                -6.220731
            ],
            [
                106.798239,
                -6.221328
            ],
            [
                106.798235,
                -6.221603
            ],
            [
                106.798292,
                -6.222913
            ],
            [
                106.799221,
                -6.222933
            ],
            [
                106.799283,
                -6.223018
            ],
            [
                106.799768,
                -6.223691
            ],
            [
                106.800439,
                -6.224621
            ],
            [
                106.800829,
                -6.225163
            ],
            [
                106.800741,
                -6.22522
            ],
            [
                106.800612,
                -6.225287
            ],
            [
                106.800523,
                -6.225351
            ],
            [
                106.800507,
                -6.225385
            ],
            [
                106.800492,
                -6.225478
            ],
            [
                106.800491,
                -6.225585
            ],
            [
                106.800502,
                -6.225584
            ]
        ].map(v => switcharoo(v[0], v[1]))
    },
    {
        fromIndex: 1,
        toIndex: 0,
        nodes: [
            [
                106.800502,
                -6.225584
            ],
            [
                106.800883,
                -6.225551
            ],
            [
                106.800818,
                -6.225454
            ],
            [
                106.800492,
                -6.225478
            ],
            [
                106.80049,
                -6.22614
            ],
            [
                106.800979,
                -6.226118
            ],
            [
                106.801119,
                -6.226209
            ],
            [
                106.800717,
                -6.226535
            ],
            [
                106.799825,
                -6.227236
            ],
            [
                106.799799,
                -6.226963
            ],
            [
                106.799772,
                -6.226934
            ],
            [
                106.799733,
                -6.226914
            ],
            [
                106.799504,
                -6.226937
            ],
            [
                106.799471,
                -6.226949
            ],
            [
                106.799458,
                -6.226972
            ],
            [
                106.799455,
                -6.227177
            ],
            [
                106.799443,
                -6.227213
            ],
            [
                106.799419,
                -6.227239
            ],
            [
                106.798563,
                -6.22724
            ],
            [
                106.798578,
                -6.226767
            ],
            [
                106.798363,
                -6.22676
            ],
            [
                106.798359,
                -6.227069
            ],
            [
                106.798347,
                -6.227294
            ],
            [
                106.798267,
                -6.227321
            ],
            [
                106.798251,
                -6.227348
            ],
            [
                106.798253,
                -6.228303
            ],
            [
                106.798246,
                -6.228404
            ],
            [
                106.798218,
                -6.228471
            ],
            [
                106.798161,
                -6.228547
            ],
            [
                106.798162,
                -6.227703
            ]
        ].map(v => switcharoo(v[0], v[1]))
    }
]
