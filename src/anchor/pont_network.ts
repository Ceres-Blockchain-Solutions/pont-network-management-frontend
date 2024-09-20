/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/pont_network.json`.
 */
export type PontNetwork = {
  "address": "3dnBfuMPHW52smosEsJwsnLGCR56DrphyUG68GqAcVxb",
  "metadata": {
    "name": "pontNetwork",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addDataAccount",
      "discriminator": [
        175,
        22,
        181,
        215,
        91,
        149,
        30,
        107
      ],
      "accounts": [
        {
          "name": "shipAccount",
          "writable": true
        },
        {
          "name": "dataAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  97,
                  116,
                  97,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "ship"
              },
              {
                "kind": "account",
                "path": "ship_account.data_accounts",
                "account": "shipAccount"
              }
            ]
          }
        },
        {
          "name": "externalObserversAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  120,
                  116,
                  101,
                  114,
                  110,
                  97,
                  108,
                  95,
                  111,
                  98,
                  115,
                  101,
                  114,
                  118,
                  101,
                  114,
                  115,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "dataAccount"
              }
            ]
          }
        },
        {
          "name": "ship",
          "writable": true,
          "signer": true,
          "relations": [
            "shipAccount"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "externalObservers",
          "type": {
            "vec": "pubkey"
          }
        },
        {
          "name": "externalObserversKeys",
          "type": {
            "vec": {
              "array": [
                "u8",
                128
              ]
            }
          }
        },
        {
          "name": "externalObserversX25519Pks",
          "type": {
            "vec": "pubkey"
          }
        }
      ]
    },
    {
      "name": "addDataFingerprint",
      "discriminator": [
        149,
        75,
        45,
        254,
        103,
        59,
        183,
        0
      ],
      "accounts": [
        {
          "name": "dataAccount",
          "writable": true
        },
        {
          "name": "ship",
          "writable": true,
          "signer": true,
          "relations": [
            "dataAccount"
          ]
        }
      ],
      "args": [
        {
          "name": "ciphertext",
          "type": "bytes"
        },
        {
          "name": "tag",
          "type": "bytes"
        },
        {
          "name": "iv",
          "type": "bytes"
        },
        {
          "name": "ciphertextTimestamp",
          "type": "u64"
        }
      ]
    },
    {
      "name": "addExternalObserver",
      "discriminator": [
        141,
        103,
        112,
        218,
        133,
        146,
        243,
        48
      ],
      "accounts": [
        {
          "name": "dataAccount"
        },
        {
          "name": "externalObserversAccount",
          "writable": true
        },
        {
          "name": "shipAccount"
        },
        {
          "name": "shipManagement",
          "writable": true,
          "signer": true,
          "relations": [
            "shipAccount"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "externalObserverToBeApproved",
          "type": "pubkey"
        },
        {
          "name": "externalObserverEncryptedMasterKey",
          "type": {
            "array": [
              "u8",
              128
            ]
          }
        }
      ]
    },
    {
      "name": "addMultipleDataFingerprints",
      "discriminator": [
        166,
        98,
        101,
        186,
        10,
        0,
        167,
        42
      ],
      "accounts": [
        {
          "name": "dataAccount",
          "writable": true
        },
        {
          "name": "ship",
          "writable": true,
          "signer": true,
          "relations": [
            "dataAccount"
          ]
        }
      ],
      "args": [
        {
          "name": "ciphertexts",
          "type": {
            "vec": "bytes"
          }
        },
        {
          "name": "tags",
          "type": {
            "vec": "bytes"
          }
        },
        {
          "name": "ivs",
          "type": {
            "vec": "bytes"
          }
        },
        {
          "name": "ciphertextTimestamps",
          "type": {
            "vec": "u64"
          }
        }
      ]
    },
    {
      "name": "externalObserverRequest",
      "discriminator": [
        45,
        49,
        179,
        150,
        54,
        164,
        22,
        76
      ],
      "accounts": [
        {
          "name": "externalObserversAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  120,
                  116,
                  101,
                  114,
                  110,
                  97,
                  108,
                  95,
                  111,
                  98,
                  115,
                  101,
                  114,
                  118,
                  101,
                  114,
                  115,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "dataAccount"
              }
            ]
          }
        },
        {
          "name": "dataAccount"
        },
        {
          "name": "externalObserver",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "externalObserverX25519Pk",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "initializeShip",
      "discriminator": [
        164,
        242,
        98,
        16,
        219,
        10,
        77,
        221
      ],
      "accounts": [
        {
          "name": "shipAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  104,
                  105,
                  112,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "ship"
              }
            ]
          }
        },
        {
          "name": "shipManagement",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "ship",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "reallocateDataAccount",
      "discriminator": [
        46,
        99,
        68,
        132,
        145,
        88,
        147,
        55
      ],
      "accounts": [
        {
          "name": "dataAccount",
          "writable": true
        },
        {
          "name": "ship",
          "writable": true,
          "signer": true,
          "relations": [
            "dataAccount"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "dataAccount",
      "discriminator": [
        85,
        240,
        182,
        158,
        76,
        7,
        18,
        233
      ]
    },
    {
      "name": "externalObserversAccount",
      "discriminator": [
        170,
        131,
        13,
        175,
        60,
        141,
        65,
        240
      ]
    },
    {
      "name": "shipAccount",
      "discriminator": [
        65,
        113,
        205,
        3,
        159,
        182,
        103,
        244
      ]
    }
  ],
  "events": [
    {
      "name": "dataAccountInitialized",
      "discriminator": [
        103,
        159,
        255,
        119,
        75,
        199,
        99,
        80
      ]
    },
    {
      "name": "dataFingerprintAdded",
      "discriminator": [
        166,
        3,
        163,
        142,
        228,
        114,
        122,
        15
      ]
    },
    {
      "name": "externalObserverAdded",
      "discriminator": [
        62,
        35,
        223,
        229,
        51,
        255,
        154,
        103
      ]
    },
    {
      "name": "externalObserverRequested",
      "discriminator": [
        58,
        191,
        60,
        78,
        153,
        241,
        91,
        5
      ]
    },
    {
      "name": "shipInitialized",
      "discriminator": [
        50,
        7,
        29,
        232,
        239,
        77,
        28,
        162
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "externalObserverAlreadyRequested"
    }
  ],
  "types": [
    {
      "name": "dataAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ship",
            "type": "pubkey"
          },
          {
            "name": "fingerprints",
            "type": {
              "vec": {
                "defined": {
                  "name": "fingerprint"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "dataAccountInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ship",
            "type": "pubkey"
          },
          {
            "name": "dataAccount",
            "type": "pubkey"
          },
          {
            "name": "externalObservers",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "externalObserversKeys",
            "type": {
              "vec": {
                "array": [
                  "u8",
                  128
                ]
              }
            }
          }
        ]
      }
    },
    {
      "name": "dataFingerprintAdded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ship",
            "type": "pubkey"
          },
          {
            "name": "fingerprint",
            "type": {
              "defined": {
                "name": "fingerprint"
              }
            }
          },
          {
            "name": "ciphertext",
            "type": "bytes"
          },
          {
            "name": "tag",
            "type": "bytes"
          },
          {
            "name": "iv",
            "type": "bytes"
          },
          {
            "name": "ciphertextTimestamp",
            "type": "u64"
          },
          {
            "name": "dataAccount",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "externalObserverAdded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "dataAccount",
            "type": "pubkey"
          },
          {
            "name": "externalObserver",
            "type": "pubkey"
          },
          {
            "name": "externalObserversAccount",
            "type": "pubkey"
          },
          {
            "name": "shipAccount",
            "type": "pubkey"
          },
          {
            "name": "shipManagement",
            "type": "pubkey"
          },
          {
            "name": "externalObserverEncryptedMasterKey",
            "type": {
              "array": [
                "u8",
                128
              ]
            }
          }
        ]
      }
    },
    {
      "name": "externalObserverRequested",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "dataAccount",
            "type": "pubkey"
          },
          {
            "name": "externalObserver",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "externalObserversAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "unapprovedExternalObservers",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "unapprovedExternalObserversX25519Pks",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "externalObservers",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "externalObserversX25519Pks",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "externalObserversMasterKeys",
            "type": {
              "vec": {
                "array": [
                  "u8",
                  128
                ]
              }
            }
          }
        ]
      }
    },
    {
      "name": "fingerprint",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "array": [
              "u8",
              32
            ]
          }
        ]
      }
    },
    {
      "name": "shipAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ship",
            "type": "pubkey"
          },
          {
            "name": "shipManagement",
            "type": "pubkey"
          },
          {
            "name": "dataAccounts",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "shipInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ship",
            "type": "pubkey"
          },
          {
            "name": "shipManagement",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
