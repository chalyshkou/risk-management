using riskmanagement as rm from '../db/schema';

annotate rm.Risks with {
    ID     @title: 'Risk';
    title  @title: 'Title';
    owner  @title: 'Owner';
    prio   @title: 'Priority';
    descr  @title: 'Description';
    miti   @title: 'Mitigation';
    impact @title: 'Impact';
    bp     @title: 'Business Partner'
}

annotate rm.BusinessPartners with {
    BusinessPartner @(
        UI.Hidden,
        Common: { Text: LastName }
    );
    LastName @(
        Common: { Label: 'Last Name' }
    );
    FirstName @(
        Common: {Label: 'First Name'}
    );
}

annotate rm.Mitigations with {
    ID @( 
        UI.Hidden,
        Common: {Text: descr}
    ); 
    owner @title: 'Owner';
    descr @title: 'Description';
}

annotate rm.Risks with {
    bp @(Common: {
        Text: bp.FirstName,
        TextArrangement: #TextOnly,
        ValueList: {
            Label: 'Business Partners',
            CollectionPath: 'BusinessPartners',
            Parameters: [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : bp_BusinessPartner,
                    ValueListProperty : 'BusinessPartner',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'LastName',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'FirstName',
                }
            ]
        }
    });
    
    miti @(Common: {
        Text: miti.descr,
        TextArrangement: #TextOnly,
        ValueList: {
            Label: 'Mitigations',
            CollectionPath: 'Mitigations',
            Parameters: [
                {
                    $Type: 'Common.ValueListParameterInOut',
                    LocalDataProperty: miti_ID,
                    ValueListProperty: 'ID'
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'descr'
                }
            ]
        },
        ValueListWithFixedValues: true
    });
}