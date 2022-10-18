// Daniel Jones - SFTS - 2022

const adminMessageText =
`
/*
 * File: SFTS_Default_Event_Handlers/General_AdminMessage_PreLoadEventHandler.cs
 * Date: 01.03.2016 (last revision)
 * Description: This example will inform the user about hidden data within the reviewed file.
*/

using System;
using kCura.EventHandler;

namespace SFTS_Default_Event_Handlers
{
    //Set a description for this event handler
    [kCura.EventHandler.CustomAttributes.Description("Example Pre-Load Event Handler which will inform the user about hidden data within the reviewed file.")]

    public class General_AdminMessage_PreLoadEventHandler_9_5_1 : PreLoadEventHandler
    {
        // List of the 'Detail' fields
        private string[] detailFields = { 
            "Detail - Contains Comments",
            "Detail - Contains Hidden Text",
            "Detail - Contains Track Changes",
            "Detail - Contains White Text",
            "Detail - Excel Hidden Columns",
            "Detail - Excel Hidden Rows",
            "Detail - Excel Hidden Sheets",
            "Detail - Excel Hidden Workbook",
            "Detail - Excel Very Hidden Sheets",
            "Detail - Hidden Slides"
        };

        // Field name of the display field
        private string messageFieldName = "Admin - Message";

        public override Response Execute()
        {
            Response retVal = new Response();
            retVal.Success = true;
            retVal.Message = String.Empty;

            // It's layout independent which means it will turn active if the message field is present 
            if (this.ActiveArtifact.Fields[messageFieldName].IsInLayout)
            {
                String Message = String.Empty;

                // Automatic population of fields
                try
                {
                    // Prepare the fields 
                    Field reviewMessage = this.ActiveArtifact.Fields[messageFieldName];

                    // Query all Detail fields and prepare message to the user
                    foreach (String field in detailFields)
                    {
                        Field detailField = this.ActiveArtifact.Fields[field];
                        ChoiceFieldValue detailFieldChoice = (ChoiceFieldValue) detailField.Value;
                        if (detailFieldChoice.IsChoiceSelected("true"))
                        {
                            Message = Message + field.Replace("Detail - "," - ") + "<br>";
                        }      
                    }

                    // Inform user about consideration of hidden data
                    if (!Message.Equals(String.Empty)) 
                    {
                        Message = "<style type=\"text/css\">.message { background-color:#EE0000; color:#FFFFFF }</style><p class=\"message\">Additional considerations:<br>" + Message + "</p>";
                        reviewMessage.Value.Value = Message;
                    }

                }
                catch (System.Exception ex)
                {
                    retVal.Success = false;
                    retVal.Message = "PreLoad EventHandler failure: " + ex;
                    return retVal;
                }
            }

            return retVal;
        }

        public override FieldCollection RequiredFields
        {
            get
            {
                // necessary fields which are not present on the layout need to be added here
                FieldCollection addedFields = new FieldCollection();

                addedFields.Add(new kCura.EventHandler.Field(messageFieldName));
                
                // Add all the detail fields to RequiredFields 
                foreach (String field in detailFields)
                {
                    addedFields.Add(new kCura.EventHandler.Field(field));
                }
                return addedFields;
            }
        }
        
    }
}

`;
export { adminMessageText };
