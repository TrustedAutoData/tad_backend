export type TadContracts = {
    "version": "0.1.0",
    "name": "tad_contracts",
    "instructions": [
      {
        "name": "initializeCar",
        "accounts": [
          {
            "name": "car",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "dealer",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "vin",
            "type": "string"
          }
        ]
      },
      {
        "name": "initializeConfig",
        "accounts": [
          {
            "name": "config",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "admin",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "initializeDealer",
        "accounts": [
          {
            "name": "dealer",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "name",
            "type": "string"
          }
        ]
      },
      {
        "name": "initializeUser",
        "accounts": [
          {
            "name": "user",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "email",
            "type": "string"
          }
        ]
      },
      {
        "name": "registerCarKm",
        "accounts": [
          {
            "name": "car",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "owner",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "newKm",
            "type": "u64"
          }
        ]
      },
      {
        "name": "registerServiceAttendance",
        "accounts": [
          {
            "name": "car",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "reportData",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ownerNft",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "creator",
            "isMut": true,
            "isSigner": true,
            "docs": [
              "Signer creating the NFT (e.g., dealership)"
            ]
          },
          {
            "name": "owner",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mplTokenMetadataProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mplCoreProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "reportId",
            "type": "u64"
          },
          {
            "name": "contentUri",
            "type": "string"
          },
          {
            "name": "reportType",
            "type": "string"
          }
        ]
      },
      {
        "name": "getReport",
        "accounts": [
          {
            "name": "car",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "dealerReportData",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "config",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ownerNft",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "creator",
            "isMut": true,
            "isSigner": true,
            "docs": [
              "Signer creating the NFT (e.g., dealership)"
            ]
          },
          {
            "name": "user",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vault",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mplTokenMetadataProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mplCoreProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "reportId",
            "type": "u64"
          },
          {
            "name": "contentUri",
            "type": "string"
          },
          {
            "name": "reportType",
            "type": "string"
          }
        ]
      },
      {
        "name": "reportCarError",
        "accounts": [
          {
            "name": "car",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": [
          {
            "name": "errorCode",
            "type": "u16"
          },
          {
            "name": "message",
            "type": "string"
          }
        ]
      },
      {
        "name": "addUserPoints",
        "accounts": [
          {
            "name": "config",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "user",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "admin",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": [
          {
            "name": "pointsToAdd",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "car",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "vin",
              "type": "string"
            },
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "dealer",
              "type": "publicKey"
            },
            {
              "name": "totalKm",
              "type": "u64"
            },
            {
              "name": "serviceCount",
              "type": "u32"
            },
            {
              "name": "lastServiceTimestamp",
              "type": "i64"
            },
            {
              "name": "obdBumps",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "dealerReportData",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "reportId",
              "type": "u64"
            },
            {
              "name": "contentUri",
              "type": "string"
            },
            {
              "name": "isOwnerNft",
              "type": "bool"
            },
            {
              "name": "reportNft",
              "type": "publicKey"
            }
          ]
        }
      },
      {
        "name": "reportData",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "reportId",
              "type": "u64"
            },
            {
              "name": "contentUri",
              "type": "string"
            },
            {
              "name": "isOwnerNft",
              "type": "bool"
            },
            {
              "name": "reportNft",
              "type": "publicKey"
            }
          ]
        }
      },
      {
        "name": "config",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "admin",
              "type": "publicKey"
            },
            {
              "name": "vault",
              "type": "publicKey"
            }
          ]
        }
      },
      {
        "name": "dealer",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "name",
              "type": "string"
            }
          ]
        }
      },
      {
        "name": "user",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "points",
              "type": "u64"
            },
            {
              "name": "email",
              "type": "string"
            }
          ]
        }
      }
    ],
    "events": [
      {
        "name": "ErrorReported",
        "fields": [
          {
            "name": "vin",
            "type": "string",
            "index": false
          },
          {
            "name": "timestamp",
            "type": "i64",
            "index": false
          },
          {
            "name": "errorCode",
            "type": "u16",
            "index": false
          },
          {
            "name": "message",
            "type": "string",
            "index": false
          }
        ]
      },
      {
        "name": "KmRegistered",
        "fields": [
          {
            "name": "vin",
            "type": "string",
            "index": false
          },
          {
            "name": "newKm",
            "type": "u64",
            "index": false
          },
          {
            "name": "updatedTotal",
            "type": "u64",
            "index": false
          }
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "Overflow",
        "msg": "Overflow occurred while updating points."
      }
    ]
  };
  
  export const IDL: TadContracts = {
    "version": "0.1.0",
    "name": "tad_contracts",
    "instructions": [
      {
        "name": "initializeCar",
        "accounts": [
          {
            "name": "car",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "dealer",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "owner",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "vin",
            "type": "string"
          }
        ]
      },
      {
        "name": "initializeConfig",
        "accounts": [
          {
            "name": "config",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "admin",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "initializeDealer",
        "accounts": [
          {
            "name": "dealer",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "name",
            "type": "string"
          }
        ]
      },
      {
        "name": "initializeUser",
        "accounts": [
          {
            "name": "user",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "email",
            "type": "string"
          }
        ]
      },
      {
        "name": "registerCarKm",
        "accounts": [
          {
            "name": "car",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "owner",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "newKm",
            "type": "u64"
          }
        ]
      },
      {
        "name": "registerServiceAttendance",
        "accounts": [
          {
            "name": "car",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "reportData",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ownerNft",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "creator",
            "isMut": true,
            "isSigner": true,
            "docs": [
              "Signer creating the NFT (e.g., dealership)"
            ]
          },
          {
            "name": "owner",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mplTokenMetadataProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mplCoreProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "reportId",
            "type": "u64"
          },
          {
            "name": "contentUri",
            "type": "string"
          },
          {
            "name": "reportType",
            "type": "string"
          }
        ]
      },
      {
        "name": "getReport",
        "accounts": [
          {
            "name": "car",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "dealerReportData",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "config",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ownerNft",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "creator",
            "isMut": true,
            "isSigner": true,
            "docs": [
              "Signer creating the NFT (e.g., dealership)"
            ]
          },
          {
            "name": "user",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vault",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mplTokenMetadataProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mplCoreProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "reportId",
            "type": "u64"
          },
          {
            "name": "contentUri",
            "type": "string"
          },
          {
            "name": "reportType",
            "type": "string"
          }
        ]
      },
      {
        "name": "reportCarError",
        "accounts": [
          {
            "name": "car",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": [
          {
            "name": "errorCode",
            "type": "u16"
          },
          {
            "name": "message",
            "type": "string"
          }
        ]
      },
      {
        "name": "addUserPoints",
        "accounts": [
          {
            "name": "config",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "user",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "admin",
            "isMut": false,
            "isSigner": true
          }
        ],
        "args": [
          {
            "name": "pointsToAdd",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "car",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "vin",
              "type": "string"
            },
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "dealer",
              "type": "publicKey"
            },
            {
              "name": "totalKm",
              "type": "u64"
            },
            {
              "name": "serviceCount",
              "type": "u32"
            },
            {
              "name": "lastServiceTimestamp",
              "type": "i64"
            },
            {
              "name": "obdBumps",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "dealerReportData",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "reportId",
              "type": "u64"
            },
            {
              "name": "contentUri",
              "type": "string"
            },
            {
              "name": "isOwnerNft",
              "type": "bool"
            },
            {
              "name": "reportNft",
              "type": "publicKey"
            }
          ]
        }
      },
      {
        "name": "reportData",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "reportId",
              "type": "u64"
            },
            {
              "name": "contentUri",
              "type": "string"
            },
            {
              "name": "isOwnerNft",
              "type": "bool"
            },
            {
              "name": "reportNft",
              "type": "publicKey"
            }
          ]
        }
      },
      {
        "name": "config",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "admin",
              "type": "publicKey"
            },
            {
              "name": "vault",
              "type": "publicKey"
            }
          ]
        }
      },
      {
        "name": "dealer",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "name",
              "type": "string"
            }
          ]
        }
      },
      {
        "name": "user",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "points",
              "type": "u64"
            },
            {
              "name": "email",
              "type": "string"
            }
          ]
        }
      }
    ],
    "events": [
      {
        "name": "ErrorReported",
        "fields": [
          {
            "name": "vin",
            "type": "string",
            "index": false
          },
          {
            "name": "timestamp",
            "type": "i64",
            "index": false
          },
          {
            "name": "errorCode",
            "type": "u16",
            "index": false
          },
          {
            "name": "message",
            "type": "string",
            "index": false
          }
        ]
      },
      {
        "name": "KmRegistered",
        "fields": [
          {
            "name": "vin",
            "type": "string",
            "index": false
          },
          {
            "name": "newKm",
            "type": "u64",
            "index": false
          },
          {
            "name": "updatedTotal",
            "type": "u64",
            "index": false
          }
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "Overflow",
        "msg": "Overflow occurred while updating points."
      }
    ]
  };
  