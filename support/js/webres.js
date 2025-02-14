const WebRes={
    TYP:{
            HEAD:1,
            MSG:0,
            CMD:2,
            CLOSE:2,
            NP:5,
            OPEN:3
        },
    CCS:{
        '1000': 'Normal Closure',
        '1001': 'Going Away',
        '1002': 'Protocol Error',
        '1003': 'Unsupported Data',
        '1004': '(For future)',
        '1005': 'No Status Received',
        '1006': 'Abnormal Closure',
        '1007': 'Invalid frame payload data',
        '1008': 'Policy Violation',
        '1009': 'Message too big',
        '1010': 'Missing Extension',
        '1011': 'Internal Error',
        '1012': 'Service Restart',
        '1013': 'Try Again Later',
        '1014': 'Bad Gateway',
        '1015': 'TLS Handshake',
        '1016': 'Wrong Password',
        '3000': 'Unauthorize',
        '3001': 'Invallied authorization parameter',
        '3002':'Session expired',
        '3003': 'Forbidden',
        '3008': 'Timeout',
        '3009':'Database Error',
        '3010': 'Access dennied',
        '3011': 'No Path',
        '3012': 'Not Allowed',
        '3013': 'Duplicate User',
        '3014': 'Not Approved',
        '3015': 'Invallied parameter',
        '3016': 'Process not found',
        '3018': 'No Parameter Set',
        '3019': 'Not in target',
        '3020': 'Duplicate Process',
        '3021': 'Less Count',
        '3022': 'More Count',
        '3023' : 'No uesr',
    },
    CCD:{
        NC:1000,//Normal Closure'
        GA:1001,//Going Away
        PE:1002,//Protocol Error
        UD:1003,//Unsupported Data
        _NA:1004,//Reserved and not used
        NSR:1005,//No Status Received
        AC:1006,//Abnormal Closure
        IPD:1007,//Invalid frame payload data
        PV:1008,//Policy Violation
        MTB:1009,//Message too big
        ME:1010,//Missing Extension
        IE:1011,//Internal Error
        SR:1012,//Service Restart
        TAL:1013,//Try Again Later
        BG:1014,//Bad Gateway
        TLH:1015,//TLS Handshake
        WP:1016,//TLS Handshake
        UNA:3000,//Unauthorize
        IAP:3001,//Invallied authorization parameter
        SE:3002,//session expired
        FRB:3003,//Forbidden
        TOT:3008,//Timeout
        DE:3009,//Database Error
        ADN:3010,//Access denied
        NP:3011,//No Path
        NA:3012,//Not Allowed
        DU:3013,//Duplicate user
        NAP:3014,//Not Approved
        INP:3015,//Invallied Parameter
        PNF:3016,//Process not found
        NPS:3018,//No parameter set
        NIT:3019,//Not in target
        DUP:3020,//Duplicate Process
        LCN:3021,//Less Count
        MCN:3022,//More Count,
        UNF:3032//User Not found
    }
};

if(typeof module=="object"){module.exports=WebRes; }

