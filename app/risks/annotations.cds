using RiskService as srv from '../../srv/risk-service';

annotate srv.Risks with @(UI: {
    HeaderInfo: {
        TypeName: 'Risk',
        TypeNamePlural: 'Risks'
    },

    SelectionFields: [prio, miti_ID],

    Identification: [{Value: title}],

    LineItem: {
        $value: [
            {
                Value: title
            },
            {
                Value: miti_ID,
            },
            {
                Value: owner
            },
            {
                Value: bp_BusinessPartner
            },
            { 
                Value: prio,
                Criticality: criticality
            },
            {
                Value: impact,
                Criticality: criticality
            }  
        ],
        ![@UI.Criticality]: criticality,
    }
});

annotate srv.Risks with @(UI: {
    HeaderInfo: {
        Title: {
            $Type : 'UI.DataField',
            Value : title,
        },
        Description : {
            $Type : 'UI.DataField',
            Value : descr,
        }
    },

    Facets: [
        {
            $Type: 'UI.ReferenceFacet',
            Label: 'Additional',
            Target: '@UI.FieldGroup#Additional'
        },
        {
            $Type: 'UI.ReferenceFacet',
            Label: 'Main',
            Target: '@UI.FieldGroup#Main',
        }
    ],

    FieldGroup #Additional: {Data: [
        {
            Value: owner
        },
        {
            Value: title
        }
    ]},

    FieldGroup #Main: {Data: [
        {
            Value: miti_ID
        },
        {
            Value: owner
        },
        {
            Value: bp_BusinessPartner
        },
        {
            Value: prio,
            Criticality: criticality
        },
        { 
            Value: impact,
            Criticality: criticality
        }
    ]},
});